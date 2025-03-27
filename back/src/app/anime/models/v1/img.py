from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from src.model import Base


class ImgTable(Base):
    __tablename__ = "img_table"

    uuid: Mapped[str] = mapped_column(ForeignKey("anime_table.uuid"), primary_key=True, index=True)
    poster: Mapped[str] = mapped_column()
    banner: Mapped[str | None] = mapped_column()
