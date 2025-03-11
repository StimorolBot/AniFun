from email.message import EmailMessage

from .config import celery
from .smtp.type_email import TypeEmail
from .smtp.utils import create_server, get_template


@celery.task(name="smtp_task", max_retries=3, default_retry_delay=3, limit=3)
def send_email(user_email: str, email_type: TypeEmail, token: str):
    email = EmailMessage()
    template = get_template(email, email_type, token)
    create_server(template)


#   celery -A celery_task.config:celery worker --loglevel=INFO --pool=solo