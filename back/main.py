from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi_cache.backends.redis import RedisBackend
from fastapi_pagination import add_pagination

from exception_handler import exception_handler
from include_router import include_router
from middleware import add_middleware
from src.app.anime.models.v1 import sub as anime_sub_table
from src.app.auth.models.v1 import sub as auth_sub_table
from src.database.session import async_session_maker
from src.redis.config import fast_api_cache, redis
from src.utils.table import fill_table
from swagger import include_doc


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    async with async_session_maker() as session:
        await fill_table(session, anime_sub_table.__all__)
        await fill_table(session, auth_sub_table.__all__)
    fast_api_cache.init(RedisBackend(redis), prefix="fastapi-cache")
    yield


app = FastAPI(title="AniFun", lifespan=lifespan, docs_url=None, redoc_url=None)

add_pagination(app)
add_middleware(app)

exception_handler(app)

include_router(app)
include_doc(app)
