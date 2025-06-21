from typing import TYPE_CHECKING, List

import datetime
from uuid import UUID

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.episode import EpisodeTable

class ScheduleTable(Base):
    """Таблица для установки расписания выхода новых эпизодов"""

    __tablename__ = "schedule_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, unique=True)
    title: Mapped[str] = mapped_column(ForeignKey("anime_table.title"), index=True)
    episode_number: Mapped[int] = mapped_column()
    episode_name: Mapped[str] = mapped_column()
    day_week: Mapped[str] = mapped_column()
    date: Mapped[datetime.date] = mapped_column()

    uuid_episode: Mapped[UUID| None] = mapped_column(ForeignKey("episode_table.uuid"))
    uuid_episode_rs: Mapped[List["EpisodeTable"]] = relationship(back_populates="schedule_rs")

    __table_args__ = (UniqueConstraint("title", "episode_number", "day_week", "episode_name"),)

