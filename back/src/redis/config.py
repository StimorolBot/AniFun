from fastapi_cache import FastAPICache
from pydantic_settings import BaseSettings

from redis import asyncio as aioredis


class Settings(BaseSettings):
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_USER_NAME: str = "user_name"
    REDIS_PASSWORD: str = "password"

    @property
    def get_url(self) -> str:
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}"


settings = Settings()
fast_api_cache = FastAPICache()
redis = aioredis.from_url(settings.get_url, encoding="utf-8", decode_responses=True)  # передать psd и name
