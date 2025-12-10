import os
from typing import TYPE_CHECKING

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.app.anime.enums.v1.sub.genres import Genres
from src.model import Base
from src.utils.crud import crud
from src.utils.utils import get_base64

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.genres_anime import GenresTable


class GenresSubTable(Base):
    """Таблица с перечнем всех жанров"""

    __tablename__ = "genres_sub_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    genres: Mapped[str] = mapped_column(unique=True)
    poster: Mapped[str] = mapped_column()
    alias: Mapped[str] = mapped_column()

    genres_anime_rs: Mapped["GenresTable"] = relationship(back_populates="genres_rs")

    @classmethod
    async def fill(cls, session: AsyncSession):
        path = f"{os.getcwd()}\\..\\front\\public\\.genres"
        poster_base64 = await get_base64(path)
        for data in Genres:
            await crud.create(
                session=session, table=cls,
                data={"genres": data.value, "poster": poster_base64[data.value], "alias": data.name.lower()}
            )
