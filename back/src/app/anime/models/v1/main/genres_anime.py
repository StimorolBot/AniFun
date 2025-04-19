from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.anime import AnimeTable
    from src.app.anime.models.v1.sub.genres import GenresTable


class GenresAnimeTable(Base):
    __tablename__ = "genres_anime_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(ForeignKey("anime_table.title"))
    genres: Mapped[str] = mapped_column(ForeignKey("genres_table.genres"), unique=False)

    anime_rs: Mapped["AnimeTable"] = relationship(back_populates="genres_rs")
    genres_rs: Mapped["GenresTable"] = relationship(back_populates="genres_anime_rs")


    # сделать уникальным по нескольким столбцам
    __table_args__ = (UniqueConstraint("title", "genres"),)
