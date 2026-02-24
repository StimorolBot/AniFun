from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.anime import AnimeTable
    from src.app.anime.models.v1.sub.genres import GenresSubTable


class GenresTable(Base):
    """Таблица с жанрами конкретного аниме"""

    __tablename__ = "genres_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(
        ForeignKey("anime_table.title", onupdate="CASCADE", ondelete="CASCADE"),
        index=True
    )
    alias: Mapped[str] = mapped_column(
        ForeignKey("anime_table.alias", onupdate="CASCADE", ondelete="CASCADE"),
    )
    label: Mapped[str] = mapped_column(ForeignKey("genres_sub_table.label"))
    value: Mapped[str] = mapped_column(ForeignKey("genres_sub_table.value"))

    anime_rs: Mapped["AnimeTable"] = relationship(back_populates="genres_rs", foreign_keys=[title])
    genres_rs: Mapped["GenresSubTable"] = relationship(back_populates="genres_anime_rs", foreign_keys=[value])

    # сделать уникальным по нескольким столбцам
    __table_args__ = (UniqueConstraint("title", "label", "value", "alias"),)
