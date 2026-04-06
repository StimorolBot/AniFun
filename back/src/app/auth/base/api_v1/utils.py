from typing import Annotated

from fastapi import Cookie, HTTPException, status

from src.app.auth.base.api_v1.jwt.jwt_token import jwt_token
from src.app.auth.base.api_v1.password_auth import password_auth


def get_reg_dict(reg_dict: dict) -> dict:
    reg_dict["hash_password"] = password_auth.get_hash_password(reg_dict["password"])
    reg_dict["is_active"] = False
    reg_dict["is_superuser"] = False
    reg_dict["is_verified"] = False

    del reg_dict["password"]
    del reg_dict["password_confirm"]

    return reg_dict


def get_user_by_token(access_token: Annotated[str | None, Cookie()] = None) -> dict:
    if not access_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Пользователь не авторизирован")
    return jwt_token.decode(token=access_token)
