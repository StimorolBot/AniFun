import os

from pydantic_settings import BaseSettings, SettingsConfigDict

PATH = f"{os.path.dirname(os.path.abspath(__file__))}/.env"

class Settings(BaseSettings):
    ACCESS_KEY: str
    SECRET_KEY: str
    ENDPOINT_URL: str

    model_config = SettingsConfigDict(env_file=PATH)


settings = Settings()
