from typing import TYPE_CHECKING

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.app.anime.enums.v1.sub.genres import Genres
from src.model import Base
from src.utils.crud import crud

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.genres_anime import GenresTable


class GenresSubTable(Base):
    """Таблица с жанрами"""

    __tablename__ = "genres_sub_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    label: Mapped[str] = mapped_column(unique=True)
    value: Mapped[str] = mapped_column(unique=True)

    genre_anime_rs: Mapped["GenresTable"] = relationship(back_populates="genre_rs")

    @classmethod
    async def fill(cls, session: AsyncSession):
        for data in Genres:
            await crud.create(
                session=session,
                table=cls,
                data={
                    "label": data.label,
                    "value": data.value,
                }
            )
