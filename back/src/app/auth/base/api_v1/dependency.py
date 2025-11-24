from typing import Annotated

from fastapi import Cookie, HTTPException, status

from src.app.auth.base.api_v1.jwt.jwt_token import jwt_token


def get_user_by_token(access_token: Annotated[str | None, Cookie()] = None) -> dict:
    if not access_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Пользователь не авторизирован")
    return jwt_token.decode(token=access_token)
