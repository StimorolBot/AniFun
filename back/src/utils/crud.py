from typing import TypeVar

from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase

from src.utils.abs_model.crud import CrudAbs

T = TypeVar("T", bound=DeclarativeBase)


class Crud(CrudAbs):
    @staticmethod
    async def create(session: AsyncSession, table: type[T], data: dict):
        stmt = table(**data)
        session.add(stmt)
        return stmt

    @staticmethod
    async def read(session: AsyncSession, table: type[T], **kwargs) -> T | None:
        stmt = select(table).filter_by(**kwargs)
        result = await session.execute(stmt)
        return result.unique().scalar_one_or_none()

    @staticmethod
    async def update(session: AsyncSession, table: type[T], data: dict, **kwargs):
        query = update(table).filter_by(**kwargs).values(**data)
        result = await session.execute(query)
        return result

    @staticmethod
    async def delite(session: AsyncSession, table: type[T], **kwargs):
        stmt = delete(table).filter_by(**kwargs)
        await session.execute(stmt)


crud = Crud()
