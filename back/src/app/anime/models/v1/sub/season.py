from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.anime import AnimeTable


class SeasonTable(Base):
    __tablename__ = "season_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    season: Mapped[str] = mapped_column(unique=True)

    anime_rs: Mapped["AnimeTable"] = relationship(back_populates="season_rs")
