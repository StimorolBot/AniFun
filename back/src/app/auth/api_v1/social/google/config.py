import os
from pydantic_settings import BaseSettings, SettingsConfigDict

PATH = f"{os.path.dirname(os.path.abspath(__file__))}/.env"


class Settings(BaseSettings):
    CLIENT_ID: str
    AUTH_URI: str
    TOKEN_URI: str
    AUTH_PROVIDER_X509_CERT_URL: str
    CLIENT_SECRET: str
    REDIRECT_URIS: str = "http://localhost:5173/auth/social/google"
    JAVASCRIPT_ORIGINS: str

    model_config = SettingsConfigDict(env_file=PATH)


settings = Settings()
