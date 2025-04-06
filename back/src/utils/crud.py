from src.utils.abs_model.crud import CrudAbs

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm.decl_api import DeclarativeAttributeIntercept


class Crud(CrudAbs):
    @staticmethod
    async def create(session: AsyncSession, table: DeclarativeAttributeIntercept, data: dict):
        stmt = table(**data)
        session.add(stmt)
        return stmt

    @staticmethod
    async def read(session: AsyncSession, table: DeclarativeAttributeIntercept, **kwargs) -> list:
        stmt = select(table).filter_by(**kwargs)
        result = await session.execute(stmt)
        return result.unique().scalar_one_or_none()

    @staticmethod
    async def update(session: AsyncSession, table: DeclarativeAttributeIntercept, data: dict, **kwargs):
        query = update(table).filter_by(**kwargs).values(**data)
        result = await session.execute(query)
        return result

    @staticmethod
    async def delite(session: AsyncSession, table: DeclarativeAttributeIntercept, **kwargs):
        stmt = delete(table).filter_by(**kwargs)
        await session.execute(stmt)


crud = Crud()
