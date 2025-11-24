import os
from uuid import UUID

from pydantic_settings import BaseSettings, SettingsConfigDict

PATH = f"{os.path.dirname(os.path.abspath(__file__))}/.env"


class Settings(BaseSettings):
    ADMIN_UUID: UUID
    model_config = SettingsConfigDict(env_file=PATH)


settings = Settings()
