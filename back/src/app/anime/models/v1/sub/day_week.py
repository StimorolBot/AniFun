from typing import TYPE_CHECKING

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.app.anime.enums.v1.sub.day_week import DayWeek
from src.model import Base
from src.utils.crud import crud


class DayWeekSubTable(Base):
    """Таблица с днями недели """
    __tablename__ = "day_sub_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, unique=True)
    label: Mapped[str] = mapped_column(unique=True)
    value: Mapped[str] = mapped_column(unique=True)

    @classmethod
    async def fill(cls, session: AsyncSession):
        for data in DayWeek:
            await crud.create(
                session=session,
                table=cls,
                data={
                    "label": data.value["label"],
                    "value": data.value["value"]
                }
            )
