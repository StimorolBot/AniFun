from typing import TYPE_CHECKING
from datetime import datetime

from sqlalchemy import ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base
from src.utils.utils import get_unc_now

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.anime import AnimeTable


class EpisodeTable(Base):
    __tablename__ = "episode_table"

    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True, unique=True)
    title: Mapped[str] = mapped_column(ForeignKey("anime_table.title"), index=True)
    episode: Mapped[int] = mapped_column(CheckConstraint("episode>=1"))
    date_add: Mapped[datetime] = mapped_column(default=get_unc_now)

    anime_rs: Mapped["AnimeTable"] = relationship(back_populates="episode_rs")

    __table_args__ = (UniqueConstraint("title", "episode"),)
