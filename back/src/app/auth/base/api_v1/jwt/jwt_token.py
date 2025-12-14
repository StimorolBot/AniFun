from datetime import datetime, timedelta, timezone
from uuid import UUID

import jwt
from fastapi import HTTPException, status
from jwt.exceptions import (DecodeError, ExpiredSignatureError,
                            InvalidSignatureError)

from src.app.auth.base.api_v1.jwt.abs_model.jwt_token import JwtTokenABC
from src.app.auth.base.api_v1.jwt.config import jwt_setting
from src.app.auth.base.api_v1.jwt.token_type import TokenType
from src.app.auth.enums.v1.auth_type import AuthType
from src.utils.logger import auth_log


class JWTToken(JwtTokenABC):
    @staticmethod
    def encode(
            payload: dict,
            algorithm: str = jwt_setting.algorithm,
            private_key: str = jwt_setting.private_path_key.read_text(),
            expire_timedelta: timedelta | None = None,
            expire_minutes: int = jwt_setting.access_token_expire_minutes
    ):
        to_encode = payload.copy()
        now = datetime.now(timezone.utc)
        if expire_timedelta:
            expire = now + expire_timedelta
        else:
            expire = now + timedelta(minutes=expire_minutes)
        to_encode.update(exp=expire, iat=now)
        return jwt.encode(to_encode, private_key, algorithm=algorithm)

    @staticmethod
    def decode(
            token: str,
            algorithms: str = jwt_setting.algorithm,
            public_key: str = jwt_setting.public_path_key.read_text()
    ):
        try:
            return jwt.decode(token, public_key, algorithms=algorithms)
        except ExpiredSignatureError as e:
            auth_log.warning("При попытке декодировать токен возникла ошибка: %s", e)
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Время жизни токена истекло")
        except DecodeError as e:
            auth_log.warning("При попытке декодировать токен возникла ошибка: %s", e)
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Невалидный токен")

    def create(self, token_type: TokenType, token_data: dict, expire_timedelta: timedelta | None = None):
        jwt_payload = {"type": token_type}
        jwt_payload.update(token_data)
        return self.encode(payload=jwt_payload, expire_timedelta=expire_timedelta)

    def valid_type(self, token: str, token_type: TokenType) -> dict:
        if not token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Пользователь не авторизован")
        try:
            payload = self.decode(token)
            if payload.get("type") != token_type:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный тип токена")
            return payload
        except InvalidSignatureError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Невалидный токен")

    def refresh(self, refresh_token: str) -> str:
        payload = self.valid_type(token=refresh_token, token_type=TokenType.REFRESH.value)
        access_token = self.create(
            token_type=TokenType.ACCESS.value,
            token_data={"sub": payload["sub"]}
        )
        return access_token

    def create_tokens(self, sub: UUID | str, auth_type: AuthType):
        sub = sub if isinstance(sub, str) else sub.hex

        access_token = self.create(
            token_type=TokenType.ACCESS.value,
            token_data={"sub": sub, "auth_type": auth_type}
        )

        refresh_token = self.create(
            token_type=TokenType.REFRESH.value,
            token_data={"sub": sub, "auth_type": auth_type},
            expire_timedelta=timedelta(days=jwt_setting.refresh_token_expire_days)
        )
        return {"access_token": access_token, "refresh_token": refresh_token}


jwt_token = JWTToken()
