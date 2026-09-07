import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.anime import AnimeTable


# pylint: disable=too-few-public-methods
class ScheduleTable(Base):
    """Таблица с расписанием выхода эпизодов"""

    __tablename__ = "schedule_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, unique=True)
    title_uuid: Mapped[UUID] = mapped_column(
        ForeignKey("anime_table.uuid", onupdate="CASCADE", ondelete="CASCADE"),
        index=True
    )

    date_release: Mapped[datetime.date] = mapped_column()
    time_release: Mapped[datetime.time] = mapped_column()
    episode_number: Mapped[int] = mapped_column()
    episode_name: Mapped[str] = mapped_column()
    is_released: Mapped[bool] = mapped_column(default=False)

    anime_rs: Mapped["AnimeTable"] = relationship(back_populates="schedule_rs")

    __table_args__ = (UniqueConstraint("title_uuid", "episode_number", "episode_name"),)
