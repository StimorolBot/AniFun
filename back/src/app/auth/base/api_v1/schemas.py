from fastapi import HTTPException, status
from pydantic_core.core_schema import FieldValidationInfo
from pydantic import BaseModel, ConfigDict, EmailStr, field_validator

from src.utils.valid import ValidPassword, ValidName


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
    recaptcha_token: str
    identifier_token: str


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
