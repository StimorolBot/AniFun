from datetime import datetime
from typing import TYPE_CHECKING, List
from uuid import UUID

from sqlalchemy import CheckConstraint, ForeignKey, String, func, true
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base
from src.utils.utils import generate_uuid, get_unc_now

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.episode import EpisodeTable
    from src.app.anime.models.v1.main.genres_anime import GenresTable
    from src.app.anime.models.v1.main.img import BannerTable, PosterTable
    from src.app.anime.models.v1.main.schedule import ScheduleTable
    from src.app.anime.models.v1.sub import (AgeRestrictSubTable,
                                             SeasonSubTable, StatusSubTable,
                                             TypeSubTable)


# pylint: disable=too-few-public-methods
class AnimeTable(Base):
    __tablename__ = "anime_table"

    uuid: Mapped[UUID] = mapped_column(primary_key=True, default=generate_uuid, unique=True)
    title: Mapped[str] = mapped_column(
        String(150),
        CheckConstraint("length(title) > 5 AND length(title) < 150"),
        unique=True
    )
    sub_title: Mapped[str | None] = mapped_column(
        String(150),
        CheckConstraint("length(sub_title) > 5 AND length(sub_title) < 150"),
        unique=True
    )
    alias: Mapped[str] = mapped_column(
        String(150),
        CheckConstraint("length(alias) > 5 AND length(alias) < 150"),
        unique=True,
        index=True
    )
    year: Mapped[int] = mapped_column(CheckConstraint("year BETWEEN 1970 AND 2050"))
    description: Mapped[str] = mapped_column(
        String(1000),
        CheckConstraint("length(description) > 10 AND length(description) < 1000")
    )
    total_episode: Mapped[int] = mapped_column(CheckConstraint("total_episode > 1 AND total_episode < 1000"))

    date_add: Mapped[datetime] = mapped_column(default=get_unc_now, server_default=func.now())

    type: Mapped[str] = mapped_column(ForeignKey("type_sub_table.value"))
    season: Mapped[str] = mapped_column(ForeignKey("season_sub_table.value"))
    age_restrict: Mapped[str] = mapped_column(ForeignKey("age_r_sub_table.value"))
    status: Mapped[str] = mapped_column(ForeignKey("status_sub_table.value"))

    type_rs: Mapped["TypeSubTable"] = relationship(back_populates="anime_rs")
    season_rs: Mapped["SeasonSubTable"] = relationship(back_populates="anime_rs")
    age_restrict_rs: Mapped["AgeRestrictSubTable"] = relationship(back_populates="anime_rs")
    status_rs: Mapped["StatusSubTable"] = relationship(back_populates="anime_rs")
    poster_rs: Mapped["PosterTable"] = relationship(
        back_populates="anime_rs",
        cascade="all, delete-orphan",
        uselist=False
    )
    banner_rs: Mapped["BannerTable"] = relationship(
        back_populates="anime_rs",
        cascade="all, delete-orphan",
        uselist=False
    )
    genres_rs: Mapped[List["GenresTable"]] = relationship(
        back_populates="anime_rs",
        cascade="all, delete-orphan"
    )
    episode_rs: Mapped["EpisodeTable"] = relationship(back_populates="anime_rs")
    schedule_rs: Mapped["ScheduleTable"] = relationship(back_populates="anime_rs")
