from typing import Annotated
from datetime import timedelta

from fastapi_cache.decorator import cache
from fastapi.responses import FileResponse
from fastapi import APIRouter, status, Depends, HTTPException, Cookie

from sqlalchemy.ext.asyncio import AsyncSession

from src.utils.crud import crud
from src.celery_task.tasks import send_email
from src.app.auth.base.api_v1.utils import get_reg_dict
from src.utils.utils import generate_code
from src.app.auth.base.api_v1.dependency import cookie_token_dep

from src.database.session import get_async_session
from src.celery_task.smtp.type_email import TypeEmail

from src.app.auth.base.api_v1.jwt.jwt_token import jwt_token
from src.app.auth.base.api_v1.jwt.token_type import TokenType
from src.app.auth.base.api_v1.jwt.config import jwt_setting
from src.app.auth.base.api_v1.jwt.models.token import TokenTable

from src.app.auth.models.v1.auth import AuthTable
from src.app.auth.base.api_v1.password_auth import password_auth
from src.app.auth.base.api_v1.schemas import Register, VerifyToken, ResetPassword, Login, Email

from src.utils.logger import auth_logger

from src.celery_task.config import celery
from src.redis.redis_manager import redis_manager

auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/register", status_code=status.HTTP_200_OK, summary="Регистрация")
async def register(register_data: Register, session: AsyncSession = Depends(get_async_session)) -> dict:
    user = await crud.read(table=AuthTable.email, session=session, email=register_data.email)

    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с такой почтой уже существует"
        )

    user_auth_data = get_reg_dict(register_data.model_dump())

    recaptcha_token = generate_code(code_len=128)
    email_token = generate_code()

    task = send_email.apply_async(args=(register_data.email, TypeEmail.CONFIRM.value, email_token), ignore_result=False)
    celery.AsyncResult(task.id)

    await redis_manager.set_value(name=recaptcha_token, value={"email_token": email_token, **user_auth_data}, ex=180)
    auth_logger.info("Запрос на создание учетной записи: %s", register_data.email)

    return {"recaptcha_token": recaptcha_token}


@auth_router.post("/verify-email", status_code=status.HTTP_201_CREATED, summary="Верификация почты")
async def verify_email(
        verify_data: VerifyToken, session: AsyncSession = Depends(get_async_session)
) -> dict:
    redis_data = await redis_manager.get_value(verify_data.recaptcha_token)
    if not redis_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Время жизни токена истекло")

    await redis_manager.del_value(verify_data.recaptcha_token)

    if redis_data["email_token"] != verify_data.email_token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Неверный токен")

    redis_data["is_verified"] = True
    del redis_data["email_token"]

    user_created = await crud.create(session=session, table=AuthTable, data=redis_data)
    await session.commit()

    access_token = jwt_token.create(
        token_type=TokenType.ACCESS.value,
        token_data={"sub": user_created.uuid}
    )
    refresh_token = jwt_token.create(
        token_type=TokenType.REFRESH.value,
        token_data={"sub": user_created.uuid},
        expire_timedelta=timedelta(days=jwt_setting.refresh_token_expire_days)
    )

    await crud.create(
        session=session, table=TokenTable,
        data={"uuid": user_created.uuid, "refresh_token": refresh_token}
    )
    await session.commit()

    auth_logger.info("Создание учетной записи: %s", redis_data["email"])
    return {"access_token": access_token}


@auth_router.post("/login", status_code=status.HTTP_200_OK, summary="Вход")
async def login(login_data: Login, session: AsyncSession = Depends(get_async_session)) -> dict:
    unauthorized_error = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный логин/пароль")
    user = await crud.read(session=session, table=AuthTable, email=login_data.email)

    if not user:
        raise unauthorized_error

    is_verify_password = password_auth.verify_password(hash_password=user.hash_password, password=login_data.password)
    if is_verify_password is False:
        raise unauthorized_error

    access_token = jwt_token.create(token_type=TokenType.ACCESS.value, token_data={"sub": user.uuid})
    await crud.update(session=session, table=AuthTable, uuid=user.uuid, data={"is_active": True})
    auth_logger.info("Вход в учетную запись: %s", user.email)

    return {"access_token": access_token}


@auth_router.patch("/logout", status_code=status.HTTP_200_OK, summary="Выход")
async def logout(logout_data=cookie_token_dep, session: AsyncSession = Depends(get_async_session)):
    await crud.update(session=session, table=AuthTable, uuid=logout_data["sub"], data={"is_active": False})
    auth_logger.info("Выход из учетной записи: %s", logout_data["sub"])
    return {"detail": "Выход из учетной записи"}


@auth_router.post("/token-password", status_code=status.HTTP_200_OK, summary="Токен для сброса пароля")
async def token_for_reset_password(email: Email):
    recaptcha_token = generate_code(code_len=128)
    email_token = generate_code()

    task = send_email.apply_async(args=(email.user_email, TypeEmail.RESET.value, email_token), ignore_result=False)
    celery.AsyncResult(task.id)

    await redis_manager.set_value(
        name=recaptcha_token,
        value={"email_token": email_token, "email": email.user_email}, ex=180
    )
    auth_logger.info("Запрос на сброс пароля: %s", email.user_email)

    return {"recaptcha_token": recaptcha_token}


@auth_router.patch("/reset-password", status_code=status.HTTP_200_OK, summary="Сброс пароля")
async def reset_password(reset_password_data: ResetPassword, session: AsyncSession = Depends(get_async_session)):
    redis_data = await redis_manager.get_value(reset_password_data.recaptcha_token)
    if not redis_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Время жизни токена истекло")

    await redis_manager.del_value(reset_password_data.recaptcha_token)

    if redis_data["email_token"] != reset_password_data.email_token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Неверный токен")

    hash_password = password_auth.get_hash_password(reset_password_data.password)

    await crud.update(
        session=session, table=AuthTable,
        data={"hash_password": hash_password},
        email=redis_data["email"]
    )
    auth_logger.info("Пользователь %s изменил пароль", reset_password_data.password)

    return {"detail": "Пароль успешно изменен"}


@auth_router.post("/refresh-token", status_code=status.HTTP_200_OK, summary="Обновить токен")
async def refresh(
        access_token: Annotated[str | None, Cookie()] = None,
        session: AsyncSession = Depends(get_async_session)
):
    try:
        user = jwt_token.decode(access_token)
        refresh_token = await crud.read(session=session, table=TokenTable, uuid=user["sub"])
        return jwt_token.refresh(refresh_token=refresh_token.refresh_token)
    except TypeError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Пользователь не авторизован")


@cache(expire=120, namespace="background-img")
@auth_router.get("/background-img", status_code=status.HTTP_200_OK, summary="Получить фон")
async def get_background_img() -> FileResponse:
    try:
        return FileResponse("./src/app/auth/api_v1/background.json")
    except FileNotFoundError:
        auth_logger.warning("Не удалось найти файл: 'background.json'")
        raise FileNotFoundError("Не удалось найти файл: 'background.json'")
