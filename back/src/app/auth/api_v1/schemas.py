from fastapi import HTTPException, status
from pydantic_core.core_schema import FieldValidationInfo
from pydantic import BaseModel, ConfigDict, EmailStr, field_validator

from src.utils.valid import ValidPassword, ValidName


class Register(BaseModel):
    user_name: ValidName
    email: EmailStr
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
    email_token: str


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


class ResponseDTO(BaseModel):
    user_name: ValidName
    email: EmailStr


class Login(BaseModel):
    email: EmailStr
    password: ValidPassword

# from celery_task.smtp.type_email import TypeEmail
# from core.validator import ValidName, ValidPassword, ValidCodeConfirm


# class Email(BaseModel):
#     email: EmailStr
#
#
# class CodeConfirm(Email):
#     email_type: TypeEmail
#
#
# class Login(Email):
#     password: ValidPassword
#
#
# class Register(Login):
#     user_name: ValidName
#     code_confirm: ValidCodeConfirm
#     is_active: bool = False
#     is_superuser: bool = False
#     is_verified: bool = False
#
#     model_config = ConfigDict(from_attributes=True)
#
#
# class RegisterDTO(Email):
#     user_name: ValidName
#
#
# class ResetPassword(Email):
#     password: ValidPassword
#     code_confirm: ValidCodeConfirm
#
#
# from pydantic import BaseModel
#
#
# class TokenSchemas(BaseModel):
#     access_token: str
#     refresh_token: str | None = None
#     token_type: str = "Bearer"
#     refresh_max_age: int | None = None
