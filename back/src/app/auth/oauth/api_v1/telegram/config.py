import os

from pydantic_settings import BaseSettings, SettingsConfigDict

PATH = f"{os.path.dirname(os.path.abspath(__file__))}/.env"


class Settings(BaseSettings):
    TOKEN: str

    model_config = SettingsConfigDict(env_file=PATH)


settings = Settings()
