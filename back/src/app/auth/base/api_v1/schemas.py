from typing import Annotated

from fastapi import HTTPException, status
from pydantic import (BaseModel, ConfigDict, EmailStr,
                      ValidatorFunctionWrapHandler, WrapValidator,
                      field_validator)
from pydantic_core.core_schema import FieldValidationInfo

from src.utils.valid import ValidText, valid_forbidden_char, valid_len


def valid_password(password: str, handler: ValidatorFunctionWrapHandler) -> str:
    valid_len(password, 8, 32, "Пароль")
    valid_forbidden_char(password, handler)
    return password


def valid_name(name: str, handler: ValidatorFunctionWrapHandler) -> str:
    valid_len(name, 4, 20, "Имя")
    if name.isalnum() is False:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Поле может содержать только буквы и цифры")

    return name


ValidName = Annotated[str, WrapValidator(valid_name)]
ValidPassword = Annotated[str, WrapValidator(valid_password)]


class Register(BaseModel):
    user_name: ValidName
    identifier: EmailStr
    password: ValidPassword
    password_confirm: ValidPassword

    model_config = ConfigDict(from_attributes=True)

    @field_validator("password_confirm")
    @classmethod
    def eq_password(cls, v, info: FieldValidationInfo):
        if v != info.data["password"]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Пароли не совпадают")
        return v


class VerifyToken(BaseModel):
    recaptcha_token: ValidText[127, 129]
    identifier_token: ValidText[7, 9]


class ResetPassword(VerifyToken):
    password: ValidPassword
    password_confirm: ValidPassword

    model_config = ConfigDict(from_attributes=True)

    @field_validator("password_confirm")
    @classmethod
    def eq_password(cls, v, info: FieldValidationInfo):
        if v != info.data["password"]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Пароли не совпадают")
        return v


class Login(BaseModel):
    identifier: EmailStr
    password: ValidPassword


class Email(BaseModel):
    identifier: EmailStr
