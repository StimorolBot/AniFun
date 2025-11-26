from datetime import datetime

from sqlalchemy import ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from src.model import Base
from src.utils.utils import get_unc_now


class RelationAnime(Base):
    __tablename__ = "relation_anime"

    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True)
    title: Mapped[str] = mapped_column(
        ForeignKey("anime_table.title", onupdate="CASCADE", ondelete="CASCADE")
    )
    date_add: Mapped[datetime] = mapped_column(default=get_unc_now, server_default=func.now())
    relation_title: Mapped[str] = mapped_column(
        ForeignKey("anime_table.title", onupdate="CASCADE", ondelete="CASCADE")
    )

    __table_args__ = (UniqueConstraint("title", "relation_title"),)
