from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.utils.crud import crud
from src.utils.logger import os_logger
from src.app.anime.models.v1 import sub as sub_table
from src.app.admin.anime.api_v1.enums import anime


async def check_content_table(session: AsyncSession):
    for models, enum in zip(sub_table.__all__, anime.__all__):
        os_logger.debug(f"Проверка заполнения таблицы: {models.__tablename__}")
        try:
            for enum_value in enum:
                await crud.create(session=session, table=models, data={enum.__name__.lower(): f"{enum_value.value}"})
            await session.commit()
            os_logger.debug(f"--> Добавление: {enum}")
        except IntegrityError:
            await session.rollback()
            os_logger.warning(f"Таблица: {models.__tablename__} уже заполнена")
        except TypeError:
            await session.rollback()
            os_logger.warning(f"В таблице {models.__tablename__} отсутствует поле {enum.__name__.lower()}")
