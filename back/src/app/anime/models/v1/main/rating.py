from uuid import UUID

from sqlalchemy import CheckConstraint, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from src.model import Base


# pylint: disable=too-few-public-methods
class RatingTable(Base):
    """Таблица с аниме рейтингом"""
    __tablename__ = "rating_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title_uuid: Mapped[UUID] = mapped_column(
        ForeignKey(
            "anime_table.uuid",
            onupdate="CASCADE",
            ondelete="CASCADE"
        )
    )
    user_uuid: Mapped[UUID] = mapped_column(
        ForeignKey(
            "auth_table.uuid",
            onupdate="CASCADE",
            ondelete="CASCADE"
        )
    )
    star: Mapped[int] = mapped_column(CheckConstraint("star >= 1 AND star <= 10"))

    __table_args__ = (UniqueConstraint("user_uuid", "title_uuid"),)
