from celery import Celery
from pydantic_settings import BaseSettings


class CelerySettings(BaseSettings):
    CELERY_HOST: str = "localhost"
    CELERY_PORT: int = 6379

    @property
    def get_url(self) -> str:
        return f"redis://{self.CELERY_HOST}:{self.CELERY_PORT}"


celery_settings = CelerySettings()

celery = Celery("celery", broker=celery_settings.get_url, backend=celery_settings.get_url)
celery.autodiscover_tasks(["celery_task"])
