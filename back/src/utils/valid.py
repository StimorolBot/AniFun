from fastapi import HTTPException, status

from pydantic import WrapValidator
from typing_extensions import Annotated


def valid_len(val: str, min_val: int, max_val: int):
    if len(val) < min_val or len(val) > max_val:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Поле должно быть в пределах от {min_val} до {max_val} символов"
        )


def valid_forbidden_char(val: str):
    symbols = {"\\", "$", "|", "?", "*", "/", "#", "'", '"', "@", " ", "!", "`", "%", "&"}
    if symbols & set(val):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Поле не должно содержать: {symbols}")


def valid_isalnum(val: str):
    if val.isalnum() is False:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Поле может содержать только буквы и цифры")


def valid_name(name: str, handler) -> str:
    valid_len(name, 4, 20)
    valid_isalnum(name)
    return name


def valid_password(password: str, handler) -> str:
    valid_len(password, 4, 32)
    valid_forbidden_char(password)
    return password


ValidName = Annotated[str, WrapValidator(valid_name)]
ValidPassword = Annotated[str, WrapValidator(valid_password)]
