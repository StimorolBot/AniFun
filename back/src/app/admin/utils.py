import base64

from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.decl_api import DeclarativeAttributeIntercept
from starlette import status
from transliterate import slugify

from src.app.admin.config import settings
from src.app.user.utils.utils import get_current_user


def get_base64(data) -> str:
    return base64.b64encode(data).decode()


def generate_alias(text: str, language_code: str = "ru") -> str:
    """
        language_code: ['bg', 'el', 'hy', 'ka', 'l1', 'mk', 'mn', 'ru', 'sr', 'uk']
    """
    return slugify(text=text, language_code=language_code)


def check_access(current_user: dict = Depends(get_current_user)):
    if current_user.get("sub") != settings.ADMIN_UUID:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Не удалось найти страницу"
        )


def is_equals_day_week(day_1: str, day_2: str):
    if day_1 != day_2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Дата выхода серии не совпадает с установленным днем недели."
        )


async def is_exist_title(table: DeclarativeAttributeIntercept, session: AsyncSession, **kwargs):
    query = select(table).filter_by(**kwargs)
    query = await session.execute(query)

    if not query.first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не удалось найти запись.\n"
                   "Пожалуйста, проверьте вводимые данные."
        )
