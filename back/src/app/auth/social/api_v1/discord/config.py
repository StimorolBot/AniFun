import os
from pydantic_settings import BaseSettings, SettingsConfigDict

PATH = f"{os.path.dirname(os.path.abspath(__file__))}/.env"


class Settings(BaseSettings):
    CLIENT_ID: str
    CLIENT_SECRET: str
    TOKEN: str

    AUTH_URI: str
    REDIRECT_URI: str
    API_ENDPOINT: str = "https://discord.com/api/v10"

    model_config = SettingsConfigDict(env_file=PATH)


settings = Settings()
