from datetime import datetime
from uuid import UUID

from sqlalchemy import ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from src.model import Base
from src.utils.utils import generate_uuid, get_unc_now


class CommentTable(Base):
    """Таблица для хранения комментариев"""

    __tablename__ = "comment_table"

    uuid: Mapped[UUID] = mapped_column(primary_key=True, default=generate_uuid, unique=True)
    title: Mapped[str] = mapped_column(
        ForeignKey("anime_table.title", onupdate="CASCADE", ondelete="CASCADE"),
        index=True
    )
    author_uuid: Mapped[UUID] = mapped_column(ForeignKey("auth_table.uuid"))
    content: Mapped[str] = mapped_column()
    date_add: Mapped[datetime] = mapped_column(default=get_unc_now, server_default=func.now())

    response_comment_uuid: Mapped[UUID | None] = mapped_column(ForeignKey("comment_table.uuid"))
    response_author_uuid: Mapped[UUID | None] = mapped_column(ForeignKey("auth_table.uuid"))


class ReactionCommentTable(Base):
    """Таблица с реакциями комментариев"""

    __tablename__ = "reaction_comment_table"

    id: Mapped[int] = mapped_column(unique=True, autoincrement=True, primary_key=True)
    title: Mapped[str] = mapped_column(
        ForeignKey("anime_table.title", onupdate="CASCADE", ondelete="CASCADE"),
        index=True
    )
    uuid: Mapped[UUID] = mapped_column(ForeignKey("comment_table.uuid"))
    author_uuid: Mapped[UUID] = mapped_column(ForeignKey("auth_table.uuid"))
    reaction_type: Mapped[str] = mapped_column()

    __table_args__ = (UniqueConstraint("uuid", "author_uuid"),)

