from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.anime import AnimeTable
    from src.app.anime.models.v1.sub.genres import GenresSubTable


class GenresTable(Base):
    """Основная таблица с жанрами"""

    __tablename__ = "genres_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(
        ForeignKey("anime_table.title", onupdate="CASCADE", ondelete="CASCADE"),
        index=True
    )
    alias: Mapped[str] = mapped_column(
        ForeignKey("anime_table.alias", onupdate="CASCADE", ondelete="CASCADE"),
    )
    genre: Mapped[str] = mapped_column(ForeignKey("genres_sub_table.genre"), unique=False)
    genre_alias: Mapped[str] = mapped_column(ForeignKey("genres_sub_table.alias"))

    anime_rs: Mapped["AnimeTable"] = relationship(back_populates="genres_rs", foreign_keys=[title])
    genres_rs: Mapped["GenresSubTable"] = relationship(back_populates="genres_anime_rs", foreign_keys=[genre_alias])

    # сделать уникальным по нескольким столбцам
    __table_args__ = (UniqueConstraint("title", "genre", "alias"),)
