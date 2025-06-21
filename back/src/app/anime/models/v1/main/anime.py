from uuid import UUID
from typing import List
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base
from src.utils.utils import generate_uuid

if TYPE_CHECKING:
    from src.app.anime.models.v1.sub import TypeTable
    from src.app.anime.models.v1.sub import SeasonTable
    from src.app.anime.models.v1.sub import StatusTable
    from src.app.anime.models.v1.sub import AgeRestrictTable
    from src.app.anime.models.v1.main.img import ImgTable
    from src.app.anime.models.v1.main.genres_anime import GenresAnimeTable
    from src.app.anime.models.v1.main.episode import EpisodeTable


class AnimeTable(Base):
    __tablename__ = "anime_table"

    uuid: Mapped[UUID] = mapped_column(primary_key=True, default=generate_uuid, unique=True)
    title: Mapped[str] = mapped_column(unique=True, index=True)
    alias: Mapped[str] = mapped_column()
    year: Mapped[int] = mapped_column(CheckConstraint("year>1970"))
    description: Mapped[str] = mapped_column()

    is_origin: Mapped[bool] = mapped_column(default=True)

    type: Mapped[str] = mapped_column(ForeignKey("type_table.type"))
    season: Mapped[str] = mapped_column(ForeignKey("season_table.season"))
    age_restrict: Mapped[str] = mapped_column(ForeignKey("age_restrict_table.restrict"))
    status: Mapped[str] = mapped_column(ForeignKey("status_table.status"))

    type_rs: Mapped["TypeTable"] = relationship(back_populates="anime_rs")
    season_rs: Mapped["SeasonTable"] = relationship(back_populates="anime_rs")
    age_restrict_rs: Mapped["AgeRestrictTable"] = relationship(back_populates="anime_rs")
    status_rs: Mapped["StatusTable"] = relationship(back_populates="anime_rs")
    img_rs: Mapped["ImgTable"] = relationship(back_populates="anime_rs")
    genres_rs: Mapped[List["GenresAnimeTable"]] = relationship(back_populates="anime_rs")
    episode_rs: Mapped["EpisodeTable"] = relationship(back_populates="anime_rs")
