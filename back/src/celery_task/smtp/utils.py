import ssl
import smtplib
from email.message import EmailMessage
from pydantic import EmailStr

from .type_email import TypeEmail
from .config import gmail_setting
from .template import email_confirm, reset_password


def get_template(
        email: EmailMessage, email_type: TypeEmail,
        token: str, user_email: EmailStr = gmail_setting.ADMIN_EMAIL
):
    email["From"] = gmail_setting.ADMIN_EMAIL
    email["To"] = user_email

    match email_type:
        case TypeEmail.CONFIRM.value:
            return email_confirm(email=email, token=token)
        case TypeEmail.RESET.value:
            return reset_password(email=email, token=token)
        case _:
            print("[!] Неизвестный тип письма")


def create_server(template):
    context = ssl.create_default_context()

    with smtplib.SMTP_SSL(gmail_setting.HOST, gmail_setting.PORT, context=context) as server:
        server.login(gmail_setting.ADMIN_EMAIL, gmail_setting.PASSWORD)
        server.send_message(template)

# celery -A celery_task.config:celery flower --loglevel=INFO
