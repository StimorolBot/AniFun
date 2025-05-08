from typing import Annotated

from fastapi_cache.decorator import cache
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from fastapi import APIRouter, status, Depends, HTTPException, Cookie

from sqlalchemy.ext.asyncio import AsyncSession

from src.utils.crud import crud
from src.utils.logger import auth_log, os_log
from src.utils.utils import generate_code
from src.app.auth.utils.v1.create_user import create_user

from src.redis.redis_manager import redis_manager
from src.database.session import get_async_session

from src.app.auth.base.api_v1.utils import get_reg_dict
from src.app.auth.base.api_v1.dependency import get_user_by_token

from src.app.auth.base.api_v1.jwt.jwt_token import jwt_token
from src.app.auth.base.api_v1.jwt.token_type import TokenType
from src.app.auth.models.v1.main.token import TokenTable

from src.app.auth.models.v1.main.auth import AuthTable
from src.app.auth.base.api_v1.password_auth import password_auth
from src.app.auth.base.api_v1.schemas import Register, VerifyToken, ResetPassword, Login, Email

from src.app.auth.enums.v1.auth_type import AuthType

from src.celery_task.config import celery
from src.celery_task.tasks import send_email
from src.celery_task.smtp.type_email import TypeEmail

auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/register", summary="Регистрация")
async def register(register_data: Register, session: AsyncSession = Depends(get_async_session)):
    user = await crud.read(table=AuthTable, session=session, identifier=register_data.identifier)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с такой почтой уже существует"
        )

    user_auth_data = get_reg_dict(register_data.model_dump())

    recaptcha_token = generate_code(code_len=128)
    identifier_token = generate_code()

    task = send_email.apply_async(
        args=(register_data.identifier, TypeEmail.CONFIRM.value, identifier_token),
        ignore_result=False
    )
    celery.AsyncResult(task.id)

    await redis_manager.set_value(
        name=recaptcha_token,
        value={"identifier_token": identifier_token, "auth_type": AuthType.BASE.value, **user_auth_data},
        ex=180
    )
    auth_log.info("Запрос на создание учетной записи: %s", register_data.identifier)

    return JSONResponse(status_code=status.HTTP_200_OK, content={"recaptcha_token": recaptcha_token})


@auth_router.post("/verify-email", summary="Верификация почты")
async def verify_email(verify_data: VerifyToken, session: AsyncSession = Depends(get_async_session)):
    redis_data = await redis_manager.get_value(verify_data.recaptcha_token)
    if not redis_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Время жизни токена истекло")

    await redis_manager.del_value(verify_data.recaptcha_token)

    if redis_data["identifier_token"] != verify_data.identifier_token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Неверный токен")

    redis_data["is_verified"] = True
    del redis_data["identifier_token"]
    data = await create_user(session=session, data=redis_data)

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=data)


@auth_router.patch("/login", summary="Вход")
async def login(login_data: Login, session: AsyncSession = Depends(get_async_session)):
    unauthorized_error = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный логин/пароль")
    user = await crud.read(session=session, table=AuthTable, identifier=login_data.identifier, auth_type=AuthType.BASE.value)

    if not user:
        raise unauthorized_error

    is_verify_password = password_auth.verify_password(hash_password=user.hash_password, password=login_data.password)
    if is_verify_password is False:
        raise unauthorized_error

    access_token = jwt_token.create(
        token_type=TokenType.ACCESS.value,
        token_data={"sub": user.uuid, "auth_type": AuthType.BASE.value}
    )
    await crud.update(session=session, table=AuthTable, uuid=user.uuid, data={"is_active": True})
    auth_log.info("Вход в учетную запись: %s", user.identifier)

    return JSONResponse(status_code=status.HTTP_200_OK, content={"access_token": access_token})


@auth_router.patch("/logout", summary="Выход")
async def logout(logout_data: dict = Depends(get_user_by_token), session: AsyncSession = Depends(get_async_session)):
    await crud.update(session=session, table=AuthTable, uuid=logout_data["sub"], data={"is_active": False})
    auth_log.info("Выход из учетной записи: %s", logout_data["sub"])
    return JSONResponse(status_code=status.HTTP_200_OK, content="Выход из учетной записи")


@auth_router.post("/token-password", summary="Токен для сброса пароля")
async def token_for_reset_password(email: Email):
    recaptcha_token = generate_code(code_len=128)
    identifier_token = generate_code()

    task = send_email.apply_async(args=(email.identifier, TypeEmail.RESET.value, identifier_token), ignore_result=False)
    celery.AsyncResult(task.id)

    await redis_manager.set_value(
        name=recaptcha_token,
        value={"identifier_token": identifier_token, "identifier": email.identifier}, ex=180
    )
    auth_log.info("Запрос на сброс пароля: %s", email.identifier)

    return JSONResponse(status_code=status.HTTP_200_OK, content={"recaptcha_token": recaptcha_token})


@auth_router.patch("/reset-password", summary="Сброс пароля")
async def reset_password(reset_password_data: ResetPassword, session: AsyncSession = Depends(get_async_session)):
    redis_data = await redis_manager.get_value(reset_password_data.recaptcha_token)
    if not redis_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Время жизни токена истекло")

    await redis_manager.del_value(reset_password_data.recaptcha_token)

    if redis_data["identifier_token"] != reset_password_data.identifier_token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Неверный токен")

    user = await crud.read(
        session=session, table=AuthTable,
        identifier=redis_data["identifier"],
        auth_type=AuthType.BASE.value
    )

    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Пароли не совпадают")

    hash_password = password_auth.get_hash_password(reset_password_data.password)

    await crud.update(
        session=session, table=AuthTable,
        data={"hash_password": hash_password},
        identifier=redis_data["identifier"]
    )
    auth_log.info("Пользователь %s изменил пароль", reset_password_data.password)

    return JSONResponse(status_code=status.HTTP_200_OK, content={"detail": "Пароль успешно изменен"})


@auth_router.post("/refresh-token", status_code=status.HTTP_200_OK, summary="Обновить токен")
async def refresh(
        access_token: Annotated[str | None, Cookie()] = None,
        session: AsyncSession = Depends(get_async_session)
):
    try:
        user = jwt_token.decode(access_token)
        refresh_token = await crud.read(session=session, table=TokenTable, uuid=user["sub"])
        return jwt_token.refresh(refresh_token=refresh_token.refresh_token)  # ! JSONResponse
    except TypeError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Пользователь не авторизован")


@cache(expire=120, namespace="background-img")
@auth_router.get("/background-img", status_code=status.HTTP_200_OK, summary="Получить фон")
async def get_background_img() -> FileResponse:
    try:
        return FileResponse("./public/auth.json")
    except FileNotFoundError:
        os_log.warning("Не удалось найти файл: 'auth.json'")
        raise FileNotFoundError("Не удалось найти файл: 'auth.json'")
