from datetime import datetime
from uuid import UUID

from sqlalchemy import ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from src.model import Base
from src.utils.utils import get_unc_now


class SequelTable(Base):
    __tablename__ = "sequel_table"

    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True)
    uuid: Mapped[UUID] = mapped_column()
    title: Mapped[str] = mapped_column(
        ForeignKey("anime_table.title", onupdate="CASCADE", ondelete="CASCADE")
    )
    sequel_title: Mapped[str] = mapped_column(
        ForeignKey("anime_table.title", onupdate="CASCADE", ondelete="CASCADE")
    )
    date_add: Mapped[datetime] = mapped_column(default=get_unc_now, server_default=func.now())

    __table_args__ = (UniqueConstraint("title", "sequel_title"),)
