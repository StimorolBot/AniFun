import os

from pydantic_settings import BaseSettings, SettingsConfigDict

PATH = f"{os.path.dirname(os.path.abspath(__file__))}/.env"


class Setting(BaseSettings):
    MODE: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_HOST: str
    POSTGRES_PORT: str
    POSTGRES_DB: str

    model_config = SettingsConfigDict(env_file=PATH)

    @property
    def get_db_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:"
            f"{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )


setting = Setting()
