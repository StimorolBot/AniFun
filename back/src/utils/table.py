from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.utils.logger import server_log


async def fill_table(session: AsyncSession, table_list):
    for model in table_list:
        server_log.debug(f"Проверка заполнения таблицы: '{model.__tablename__}'")
        try:
            await model.fill(session)
            await session.commit()
            server_log.debug(f"Таблица '{model.__tablename__}' заполнена")
        except IntegrityError as e:
            await session.rollback()
            server_log.info(e)
