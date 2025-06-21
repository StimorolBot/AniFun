from uuid import UUID
from typing import TYPE_CHECKING
from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base
from src.utils.utils import get_unc_now

from src.utils.utils import generate_uuid

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.anime import AnimeTable
    from src.app.anime.models.v1.main.schedule import ScheduleTable


class EpisodeTable(Base):
    """Таблица для добавления новых эпизодов аниме"""

    __tablename__ = "episode_table"

    uuid: Mapped[UUID] = mapped_column(default=generate_uuid, primary_key=True, unique=True, index=True)
    title: Mapped[str] = mapped_column(ForeignKey("anime_table.title"), index=True)

    date_add: Mapped[datetime] = mapped_column(default=get_unc_now)
    preview: Mapped[str] = mapped_column()

    anime_rs: Mapped["AnimeTable"] = relationship(back_populates="episode_rs")
    schedule_rs: Mapped["ScheduleTable"] = relationship(back_populates="uuid_episode_rs")
