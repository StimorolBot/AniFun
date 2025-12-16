from uuid import UUID

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base


class RatingTable(Base):
    """Таблица с аниме рейтингом"""
    __tablename__ = "rating_table"

    id: Mapped[int] = mapped_column(primary_key=True)
    uuid: Mapped[UUID] = mapped_column(ForeignKey("auth_table.uuid"))
    title: Mapped[str] = mapped_column(ForeignKey("anime_table.title", onupdate="CASCADE", ondelete="CASCADE"))
    star: Mapped[int] = mapped_column()

    __table_args__ = (UniqueConstraint("uuid", "title"),)
