from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.anime import AnimeTable


class ReleaseDayTable(Base):
    """Таблица с днями недели выхода тайтлов"""
    __tablename__ = "release_day_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, unique=True)

    title: Mapped[str] = mapped_column(
        ForeignKey("anime_table.title", onupdate="CASCADE", ondelete="CASCADE"),
        unique=True
    )
    label: Mapped[str] = mapped_column(ForeignKey("day_sub_table.label"))
    value: Mapped[str] = mapped_column(ForeignKey("day_sub_table.value"))

    anime_rs: Mapped["AnimeTable"] = relationship(back_populates="release_day_rs")
