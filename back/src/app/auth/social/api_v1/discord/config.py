import os
from pydantic_settings import BaseSettings, SettingsConfigDict

PATH = f"{os.path.dirname(os.path.abspath(__file__))}/.env"


class Settings(BaseSettings):
    CLIENT_ID: str
    CLIENT_SECRET: str
    TOKEN: str

    REDIRECT_URI: str
    API_ENDPOINT: str = "https://discord.com/api/v10"

    @property
    def GET_AUTH_URI(self) -> str:
        return (f"https://discord.com/oauth2/authorize?client_id={self.CLIENT_ID}"
                f"&response_type=code&redirect_uri={self.REDIRECT_URI}&scope=identify+email+connections")

    model_config = SettingsConfigDict(env_file=PATH)


settings = Settings()
