from datetime import datetime
from typing import TYPE_CHECKING, List
from uuid import UUID

from sqlalchemy import CheckConstraint, ForeignKey, func, true
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base
from src.utils.utils import generate_uuid, get_unc_now

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.episode import EpisodeTable
    from src.app.anime.models.v1.main.genres_anime import GenresAnimeTable
    from src.app.anime.models.v1.main.img import ImgTable
    from src.app.anime.models.v1.sub import (AgeRestrictTable, SeasonTable,
                                             StatusTable, TypeTable)


class AnimeTable(Base):
    __tablename__ = "anime_table"

    uuid: Mapped[UUID] = mapped_column(primary_key=True, default=generate_uuid, unique=True)
    title: Mapped[str] = mapped_column(unique=True, index=True)
    alias: Mapped[str] = mapped_column(unique=True)
    year: Mapped[int] = mapped_column(CheckConstraint("year>1970"))
    description: Mapped[str] = mapped_column()
    total_episode: Mapped[int] = mapped_column()

    date_add: Mapped[datetime] = mapped_column(default=get_unc_now, server_default=func.now())
    is_origin: Mapped[bool] = mapped_column(default=True, server_default=true())

    type: Mapped[str] = mapped_column(ForeignKey("type_table.type"))
    season: Mapped[str] = mapped_column(ForeignKey("season_table.season"))
    age_restrict: Mapped[str] = mapped_column(ForeignKey("age_restrict_table.restrict"))
    status: Mapped[str] = mapped_column(ForeignKey("status_table.status"))

    type_rs: Mapped["TypeTable"] = relationship(back_populates="anime_rs")
    season_rs: Mapped["SeasonTable"] = relationship(back_populates="anime_rs")
    age_restrict_rs: Mapped["AgeRestrictTable"] = relationship(back_populates="anime_rs")
    status_rs: Mapped["StatusTable"] = relationship(back_populates="anime_rs")
    img_rs: Mapped["ImgTable"] = relationship(back_populates="anime_rs", cascade="all, delete-orphan")
    genres_rs: Mapped[List["GenresAnimeTable"]] = relationship(
        back_populates="anime_rs",
        foreign_keys="[GenresAnimeTable.title]"
    )
    episode_rs: Mapped["EpisodeTable"] = relationship(back_populates="anime_rs")
