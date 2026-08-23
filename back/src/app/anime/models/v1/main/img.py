from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey, false, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base
from src.utils.utils import get_unc_now

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.anime import AnimeTable


# pylint: disable=too-few-public-methods
class PosterTable(Base):
    __tablename__ = "poster_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title_uuid: Mapped[UUID] = mapped_column(
        ForeignKey("anime_table.uuid", ondelete="CASCADE"),
        index=True
    )
    poster_uuid: Mapped[UUID] = mapped_column()
    anime_rs: Mapped["AnimeTable"] = relationship(back_populates="poster_rs")


class BannerTable(Base):
    __tablename__ = "banner_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title_uuid: Mapped[UUID] = mapped_column(
        ForeignKey("anime_table.uuid", ondelete="CASCADE"),
        index=True
    )
    banner_uuid: Mapped[UUID] = mapped_column()
    position: Mapped[int | None] = mapped_column()
    date_add: Mapped[datetime] = mapped_column(default=get_unc_now, server_default=func.now())
    is_active: Mapped[bool] = mapped_column(default=False, server_default=false())

    anime_rs: Mapped["AnimeTable"] = relationship(back_populates="banner_rs")
