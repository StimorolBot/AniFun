from datetime import datetime
from uuid import UUID

from sqlalchemy import ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from src.model import Base
from src.utils.utils import get_unc_now


# pylint: disable=too-few-public-methods
class AnimeRelationTable(Base):
    __tablename__ = "anime_relation_table"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )
    uuid: Mapped[UUID] = mapped_column(
        unique=True,
    )
    title_uuid: Mapped[UUID] = mapped_column(
        ForeignKey(
            "anime_table.uuid",
            onupdate="CASCADE",
            ondelete="CASCADE",
        )
    )
    related_title_uuid: Mapped[UUID] = mapped_column(
        ForeignKey(
            "anime_table.uuid",
            onupdate="CASCADE",
            ondelete="CASCADE",
        )
    )
    position: Mapped[int] = mapped_column()
    date_add: Mapped[datetime] = mapped_column(
        default=get_unc_now,
        server_default=func.now(),
    )

    __table_args__ = (
        UniqueConstraint(
            "title_uuid",
            "related_title_uuid",
        ),
    )
