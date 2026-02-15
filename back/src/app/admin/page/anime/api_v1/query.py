from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import MultipleResultsFound, NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.decl_api import DeclarativeAttributeIntercept
from sqlalchemy.sql.elements import Label

from src.app.anime.models.v1 import main as main_table
from src.utils.crud import crud
from src.utils.logger import server_log


async def is_exist_title(table: DeclarativeAttributeIntercept, session: AsyncSession, **kwargs):
    query = await crud.read(session=session, table=table, **kwargs)

    if not query:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не удалось найти запись.\n"
                   "Пожалуйста, проверьте вводимые данные."
        )

    return query


async def is_exist_record(
        session: AsyncSession,
        table_join: DeclarativeAttributeIntercept,
        second_feld: Label,
        **kwargs
):
    try:
        query = (
            select(
                main_table.AnimeTable.uuid.label("uuid_title"),
                second_feld
            )
            .select_from(main_table.AnimeTable)
            .join(table_join, main_table.AnimeTable.title == table_join.title)
            .filter_by(**kwargs)
        )
        result = await session.execute(query)
        return result.mappings().one()
    except MultipleResultsFound as e:
        server_log.error("При попытке обновить запись возникла ошибка: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Не удалось получить получить данные."
                   "Пожалуйста, повторите попытку позже."
        ) from e
    except NoResultFound as e:
        server_log.warning("Не удалось обновить запись: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не удалось обновить запись."
        ) from e
