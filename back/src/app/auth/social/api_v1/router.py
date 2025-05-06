import json
import base64
from binascii import Error as ErrorBinascii

import httpx
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import APIRouter, Request, status, HTTPException, Depends
from authlib.integrations.base_client.errors import MismatchingStateError
from starlette.responses import JSONResponse

from src.app.auth.social.api_v1.google.oauth import oauth
from src.app.auth.social.api_v1.google.config import settings as google_settings
from src.app.auth.social.api_v1.discord.config import settings as discord_settings

from src.utils.crud import crud
from src.utils.logger import auth_log

from src.database.session import get_async_session
from src.app.auth.utils.v1.create_user import create_user

from src.app.auth.base.api_v1.jwt.jwt_token import jwt_token
from src.app.auth.base.api_v1.jwt.token_type import TokenType

from src.app.auth.enums.v1.auth_type import AuthType
from src.app.auth.models.v1.main.auth import AuthTable

from src.app.auth.social.api_v1.telegram.schemas import OauthTelegram

auth_social_router = APIRouter(prefix="/auth/social", tags=["auth-social"])


@auth_social_router.get("/login-google", status_code=status.HTTP_200_OK, summary="Вход через google")
async def login_google(request: Request) -> str:
    redirect_uri = google_settings.REDIRECT_URI
    uri = await oauth.google.authorize_redirect(request, redirect_uri)
    return uri._headers["location"]


@auth_social_router.get("/auth-google", summary="Авторизация через google")
async def auth_google(request: Request, session: AsyncSession = Depends(get_async_session)):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_data = token["userinfo"]
        data_table = await crud.read(
            session=session,
            table=AuthTable,
            identifier=user_data["email"],
            auth_type=AuthType.GOOGLE.value
        )

        if not data_table:
            access_token = await create_user(
                session=session,
                data={
                    "user_name": user_data["given_name"], "identifier": user_data["email"],
                    "auth_type": AuthType.GOOGLE.value, "is_active": True, "is_verified": True
                }
            )
            await session.commit()
            return JSONResponse(status_code=status.HTTP_200_OK, content=access_token)

        await crud.update(session=session, table=AuthTable, data={"is_active": True}, identifier=data_table.identifier)
        access_token = jwt_token.create(token_type=TokenType.ACCESS.value, token_data={"sub": data_table.uuid})

        return JSONResponse(status_code=status.HTTP_200_OK, content={"access_token": access_token})
    except MismatchingStateError as e:
        auth_log.warning("При попытке входа в учетную запись возникла ошибка: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="При попытке авторизации произошла ошибка, пожалуйста повторите попытку позже"
        )


@auth_social_router.get("/auth-discord", summary="Авторизация через discord")
async def auth_discord(code: str, session: AsyncSession = Depends(get_async_session)):
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": discord_settings.REDIRECT_URI
    }
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            f"{discord_settings.API_ENDPOINT}/oauth2/token",
            headers=headers, data=data,
            auth=(discord_settings.CLIENT_ID, discord_settings.CLIENT_SECRET)
        )

        if token_response.status_code != status.HTTP_200_OK:
            auth_log.warning("при попытке авторизации через discord произошла ошибка, %s", token_response.status_code)
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="При попытке авторизации произошла ошибка. Пожалуйста, повторите попытку позже"
            )

        token_response_dict = token_response.json()
        user_data_response = await client.get(
            f"{discord_settings.API_ENDPOINT}/users/@me",
            headers={"Authorization": f"{token_response_dict["token_type"]} {token_response_dict["access_token"]}"}
        )

        user_data_dict = user_data_response.json()
        data_table = await crud.read(
            session=session,
            table=AuthTable,
            identifier=user_data_dict["email"],
            auth_type=AuthType.DISCORD.value
        )

        if not data_table:
            access_token = await create_user(
                session=session,
                data={
                    "identifier": user_data_dict["email"], "user_name": user_data_dict["global_name"],
                    "auth_type": AuthType.DISCORD.value, "is_active": True, "is_verified": True
                }
            )
            await session.commit()
            return JSONResponse(status_code=status.HTTP_200_OK, content=access_token)

        await crud.update(session=session, table=AuthTable, data={"is_active": True}, identifier=data_table.identifier)
        access_token = jwt_token.create(token_type=TokenType.ACCESS.value, token_data={"sub": data_table.uuid})

        return JSONResponse(status_code=status.HTTP_200_OK, content={"access_token": access_token})


@auth_social_router.post("/auth-telegram", summary="Авторизация через telegram")
async def auth_telegram(data: OauthTelegram, session: AsyncSession = Depends(get_async_session)):
    try:
        base64_string_data = base64.b64decode(data.data_bas64 + '=' * (-len(data.data_bas64) % 4)).decode()
        dict_data = json.loads(base64_string_data)

        data_table = await crud.read(
            session=session,
            table=AuthTable,
            identifier=f"{dict_data["id"]}",
            auth_type=AuthType.TG.value
        )

        if not data_table:
            access_token = await create_user(
                session=session,
                data={
                    "user_name": dict_data.get("username")
                    if dict_data.get("username") is not None
                    else dict_data["first_name"],
                    "identifier": f"{dict_data["id"]}",
                    "auth_type": AuthType.TG.value, "is_active": True, "is_verified": True
                }
            )
            await session.commit()
            return JSONResponse(status_code=status.HTTP_200_OK, content=access_token)

        await crud.update(session=session, table=AuthTable, data={"is_active": True}, identifier=data_table.identifier)
        access_token = jwt_token.create(token_type=TokenType.ACCESS.value, token_data={"sub": data_table.uuid})

        return JSONResponse(status_code=status.HTTP_200_OK, content={"access_token": access_token})
    except MismatchingStateError as e:
        auth_log.warning("При попытке входа в учетную запись возникла ошибка: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="При попытке авторизации произошла ошибка, пожалуйста повторите попытку позже"
        )
    except ErrorBinascii as e:
        auth_log.error("Не удалось декодировать base64: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="При попытке авторизации произошла ошибка, пожалуйста повторите попытку позже"
        )
