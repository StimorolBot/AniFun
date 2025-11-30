from src.app.auth.base.api_v1.abs_model.password_auth_abs import \
    PasswordAuthABC
from src.app.auth.base.api_v1.config import myctx


class PasswordAuth(PasswordAuthABC):
    @staticmethod
    def verify_password(hash_password: str, password: str) -> bool:
        return myctx.verify(password, hash_password)

    @staticmethod
    def get_hash_password(password: str) -> str:
        return myctx.hash(password)


password_auth = PasswordAuth()
