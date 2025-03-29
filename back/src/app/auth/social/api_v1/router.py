import httpx
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import APIRouter, Request, status, HTTPException, Depends
from authlib.integrations.base_client.errors import MismatchingStateError

from src.app.auth.social.api_v1.google.oauth import oauth
from src.app.auth.social.api_v1.google.config import settings as google_settings
from src.app.auth.social.api_v1.discord.config import settings as discord_settings

from src.utils.crud import crud
from src.utils.logger import auth_logger

from src.database.session import get_async_session
from src.app.auth.utils.v1.create_user import create_user

from src.app.auth.base.api_v1.jwt.jwt_token import jwt_token
from src.app.auth.base.api_v1.jwt.token_type import TokenType

from src.app.auth.models.v1.auth import AuthTable

auth_social_router = APIRouter(prefix="/auth/social", tags=["auth-social"])


@auth_social_router.get("/login-google", status_code=status.HTTP_200_OK, summary="Вход через google")
async def login_google(request: Request) -> str:
    redirect_uri = google_settings.REDIRECT_URI
    uri = await oauth.google.authorize_redirect(request, redirect_uri)
    return uri._headers["location"]


@auth_social_router.get("/auth-google", status_code=status.HTTP_200_OK, summary="Аутентификация через google")
async def auth_google(request: Request, session: AsyncSession = Depends(get_async_session)):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_data = token["userinfo"]
        read_table = await crud.read(session=session, table=AuthTable, identifier=user_data["email"])

        if not read_table:
            access_token = await create_user(
                session=session,
                data={
                    "user_name": user_data["name"], "identifier": user_data["email"],
                    "auth_type": 1, "is_active": True, "is_verified": True
                }
            )
            return {"access_token": access_token}

        await crud.update(session=session, table=AuthTable, data={"is_active": True}, identifier=read_table.uuid)
        access_token = jwt_token.create(token_type=TokenType.ACCESS.value, token_data={"sub": read_table.uuid})

        return {"access_token": access_token}
    except MismatchingStateError as e:
        auth_logger.warning(f"При попытке входа в учетную запись возникла ошибка: {e}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Не удалось найти страницу")


@auth_social_router.get("/login-discord", status_code=status.HTTP_200_OK, summary="Вход через discord")
async def login_discord() -> str:
    return discord_settings.GET_AUTH_URI


@auth_social_router.get("/auth-discord", status_code=status.HTTP_200_OK, summary="Аутентификация через discord")
async def auth_discord(code: str, session: AsyncSession = Depends(get_async_session)) -> dict:
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

        if token_response.status_code == status.HTTP_200_OK:
            token_response_dict = token_response.json()
            user_data_response = await client.get(
                f"{discord_settings.API_ENDPOINT}/users/@me",
                headers={"Authorization": f"{token_response_dict["token_type"]} {token_response_dict["access_token"]}"}
            )

            user_data_dict = user_data_response.json()
            read_table = await crud.read(session=session, table=AuthTable, identifier=user_data_dict["email"])

            if not read_table:
                access_token = await create_user(
                    session=session,
                    data={
                        "identifier": user_data_dict["email"], "user_name": user_data_dict["global_name"],
                        "auth_type": 2, "is_active": True, "is_verified": True
                    }
                )
                return {"access_token": access_token}

            await crud.update(session=session, table=AuthTable, data={"is_active": True}, identifier=read_table.uuid)
            access_token = jwt_token.create(token_type=TokenType.ACCESS.value, token_data={"sub": read_table.uuid})

            return {"access_token": access_token}



@auth_social_router.post("/auth-telegram", status_code=status.HTTP_200_OK, summary="Аутентификация через telegram")
async def auth_telegram(data=None) -> str:
    print(data)
