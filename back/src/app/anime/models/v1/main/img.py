from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.anime import AnimeTable


class ImgTable(Base):
    __tablename__ = "img_table"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(ForeignKey("anime_table.title"), index=True)
    poster: Mapped[str] = mapped_column()
    banner: Mapped[str | None] = mapped_column()

    anime_rs: Mapped["AnimeTable"] = relationship(back_populates="img_rs")
