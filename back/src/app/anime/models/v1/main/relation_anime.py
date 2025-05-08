from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from src.model import Base


class RelationAnime(Base):
    __tablename__ = "relation_anime"

    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True)
    title: Mapped[str] = mapped_column(ForeignKey("anime_table.title"))
    relation_title: Mapped[str] = mapped_column(ForeignKey("anime_table.title"))

    __table_args__ = (UniqueConstraint("title", "relation_title"),)
