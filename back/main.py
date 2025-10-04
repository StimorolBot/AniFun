from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import (get_redoc_html, get_swagger_ui_html,
                                  get_swagger_ui_oauth2_redirect_html)
from fastapi_cache.backends.redis import RedisBackend
from fastapi_pagination import add_pagination
from starlette.middleware.sessions import SessionMiddleware

from exception_handler import exception_handler
from src.app.admin.anime.api_v1.router import admin_router
from src.app.anime.catalog.api_v1.router import catalog_router
from src.app.anime.home.api_v1.router import anime_router
from src.app.anime.models.v1 import sub as anime_sub_table
from src.app.anime.releases.api_v1.router import releases_router
from src.app.auth.base.api_v1.router import auth_router
from src.app.auth.models.v1 import sub as auth_sub_table
from src.app.auth.social.api_v1.router import auth_social_router
from src.app.user.api_v1.router import user_router
from src.database.session import async_session_maker
from src.redis.config import fast_api_cache, redis
from src.utils.table import fill_table


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    async with async_session_maker() as session:
        await fill_table(session, anime_sub_table.__all__)
        await fill_table(session, auth_sub_table.__all__)
    fast_api_cache.init(RedisBackend(redis), prefix="fastapi-cache")
    yield


app = FastAPI(title="AniFun", lifespan=lifespan, docs_url=None, redoc_url=None)
add_pagination(app)
exception_handler(app)

app.include_router(auth_router)
app.include_router(auth_social_router)
app.include_router(anime_router)
app.include_router(admin_router)
app.include_router(releases_router)
app.include_router(user_router)
app.include_router(catalog_router)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(SessionMiddleware, secret_key="some-random-string")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PATCH", "PUT"],
    allow_headers=[
        "Content-Type", "Set-Cookie", "Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin", "Authorization", "Content-Length",
        "Range", "Content-Range", "Accept-Range", "Content-Encoding",
    ],
    expose_headers=[
        "Content-Type", "Range", "Content-Range", "Accept-Range",
        "Content-Encoding", "Content-Length", "Content-Encoding",
    ]
)


@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js",
        swagger_css_url="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css",
    )


@app.get(app.swagger_ui_oauth2_redirect_url, include_in_schema=False)
async def swagger_ui_redirect():
    return get_swagger_ui_oauth2_redirect_html()


@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=app.title + " - ReDoc",
        redoc_js_url="https://unpkg.com/redoc@next/bundles/redoc.standalone.js",
    )
