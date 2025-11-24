import asyncio
from typing import AsyncGenerator

import pytest
from fastapi_pagination import add_pagination
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

from main import app
from src.app.anime.models.v1 import sub as anime_sub_table
from src.app.auth.models.v1 import sub as auth_sub_table
from src.database.session import get_async_session
from src.model import Base
from src.utils.table import fill_table as ft
from tests.config import config_test

engine_test = create_async_engine(config_test.get_db_url, poolclass=NullPool)
async_session_maker = sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)
Base.metadata.bind = engine_test


async def get_test_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session


app.dependency_overrides[get_async_session] = get_test_async_session
add_pagination(app)


async def fill_table():
    async with async_session_maker() as session:
        await ft(session, auth_sub_table.__all__)
        await ft(session, anime_sub_table.__all__)


@pytest.fixture(autouse=True, scope="module")
async def prepare_database():
    assert config_test.MODE == "TEST"
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await fill_table()
    yield
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture(autouse=True, scope="module")
def event_loop(request):
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(autouse=True, scope="module")
async def ac() -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
