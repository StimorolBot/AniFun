from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base
from src.utils.utils import get_unc_now

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.anime import AnimeTable


class EpisodeTable(Base):
    """Таблица для добавления новых эпизодов аниме"""

    __tablename__ = "episode_table"

    uuid: Mapped[UUID] = mapped_column(unique=True, primary_key=True)
    title: Mapped[str] = mapped_column(
        ForeignKey("anime_table.title", onupdate="CASCADE", ondelete="CASCADE"),
        index=True
    )
    number: Mapped[int] = mapped_column()
    name: Mapped[str] = mapped_column()
    date_add: Mapped[datetime] = mapped_column(default=get_unc_now, server_default=func.now())

    anime_rs: Mapped["AnimeTable"] = relationship(back_populates="episode_rs")

    __table_args__ = (UniqueConstraint("title", "number", "name"),)


class EpisodeTimeCodeTable(Base):
    """Таблица с таймкодами эпизодов"""

    __tablename__ = "episode_tc_table"

    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True)
    uuid_episode: Mapped[UUID] = mapped_column(ForeignKey("episode_table.uuid"))
    opening_start: Mapped[int] = mapped_column()
    opening_end: Mapped[int] = mapped_column()
    ending_start: Mapped[int] = mapped_column()
    ending_end: Mapped[int] = mapped_column()


class EpisodePreviewTable(Base):
    """Таблица с превью эпизодов"""

    __tablename__ = "episode_prev_table"

    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True, unique=True)
    episode_uuid: Mapped[UUID] = mapped_column(ForeignKey("episode_table.uuid"))
    preview_uuid: Mapped[UUID] = mapped_column()


class EpisodeWatchProgress(Base):
    """Таблица для хранения прогресса просмотренных серйи"""

    __tablename__ = "episode_wp_table"

    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True, unique=True)
    title: Mapped[str] = mapped_column()
    ures_uuid: Mapped[UUID] = mapped_column(ForeignKey("auth_table.uuid"))
    episode_uuid: Mapped[UUID] = mapped_column(ForeignKey("episode_table.uuid"))
    last_frame_time: Mapped[int] = mapped_column()
    progress: Mapped[int] = mapped_column()
    is_watch: Mapped[bool] = mapped_column()
