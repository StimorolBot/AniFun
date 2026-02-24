from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.anime import AnimeTable


class PosterTable(Base):
    __tablename__ = "poster_table"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(
        ForeignKey("anime_table.title", onupdate="CASCADE", ondelete="CASCADE"),
        index=True
    )
    poster_uuid: Mapped[UUID] = mapped_column()
    anime_rs: Mapped["AnimeTable"] = relationship(back_populates="poster_rs")


class BannerTable(Base):
    __tablename__ = "banner_table"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(
        ForeignKey("anime_table.title", onupdate="CASCADE", ondelete="CASCADE"),
        index=True
    )
    uuid_banner: Mapped[UUID] = mapped_column()
    anime_rs: Mapped["AnimeTable"] = relationship(back_populates="banner_rs")
