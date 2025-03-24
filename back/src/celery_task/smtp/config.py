import os
from pydantic_settings import BaseSettings, SettingsConfigDict

PATH = f"{os.path.dirname(os.path.abspath(__file__))}/.env"

class GmailSettings(BaseSettings):
    PASSWORD: str
    ADMIN_EMAIL: str
    HOST: str = "smtp.gmail.com"
    PORT: int = 465

    model_config = SettingsConfigDict(env_file=PATH)


gmail_setting = GmailSettings()
