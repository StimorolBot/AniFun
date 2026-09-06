from typing import Annotated

from fastapi import Cookie, HTTPException, status
from jwt.exceptions import DecodeError, ExpiredSignatureError

from src.app.auth.base.api_v1.jwt.jwt_token import jwt_token
from src.app.user.schemas.api_v1.schemas import DecodeAccessToken
from src.utils.logger import auth_log


def get_current_user(
        access_token: Annotated[str | None, Cookie(alias="access_token")] = None
) -> DecodeAccessToken | None:
    if not access_token:
        return None
    try:
        payload = jwt_token.decode(token=access_token)
        return DecodeAccessToken(**payload)

    except ExpiredSignatureError as e:
        auth_log.warning("При попытке декодировать токен возникла ошибка: %s", e)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Время жизни токена истекло")

    except DecodeError as e:
        auth_log.warning("При попытке декодировать токен возникла ошибка: %s", e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Невалидный токен")


