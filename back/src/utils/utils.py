import string
import secrets
from uuid import uuid4
from typing import Annotated
from datetime import datetime, UTC
from fastapi import Cookie, HTTPException, status

from src.app.auth.api_v1.jwt.jwt_token import jwt_token


def generate_uuid() -> str:
    return uuid4().hex


def get_unc_now(f: str = "%d-%m-%Y, %H:%M:%S") -> datetime:
    date_str = datetime.now(UTC).strftime(f)
    return datetime.strptime(date_str, f)


def generate_code(code_len: int = 8) -> str:
    letters_and_digits = string.ascii_letters + string.digits + "_" + "-"
    return ''.join(secrets.choice(letters_and_digits) for _ in range(code_len))


def get_user_by_token(access_token: Annotated[dict, Cookie()] = None) -> dict:
    if not access_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Пользователь не авторизирован")
    return jwt_token.decode(token=access_token)
