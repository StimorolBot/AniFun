from datetime import datetime
from typing import TYPE_CHECKING, List
from uuid import UUID

from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base
from src.utils.utils import generate_uuid, get_unc_now

if TYPE_CHECKING:
    from src.app.auth.models.v1.main.auth import AuthTable


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

    response_rs: Mapped[List["ResponseCommentTable"]] = relationship(back_populates="comment_rs")


class ResponseCommentTable(Base):
    """Таблица для хранения ответов на комментарии"""

    __tablename__ = "response_commet_table"

    uuid: Mapped[UUID] = mapped_column(primary_key=True, default=generate_uuid, unique=True)
    title: Mapped[str] = mapped_column(
        ForeignKey("anime_table.title", onupdate="CASCADE", ondelete="CASCADE"),
        index=True
    )
    author_uuid: Mapped[UUID] = mapped_column(ForeignKey("auth_table.uuid"))
    content: Mapped[str] = mapped_column()
    date_add: Mapped[datetime] = mapped_column(default=get_unc_now)

    response_uuid_comment: Mapped[UUID] = mapped_column(ForeignKey("comment_table.uuid"))
    response_uuid_author: Mapped[UUID] = mapped_column(ForeignKey("auth_table.uuid"))

    comment_rs: Mapped["CommentTable"] = relationship(back_populates="response_rs")
    auth_rs: Mapped["AuthTable"] = relationship(
        back_populates="response_rs",
        foreign_keys=[response_uuid_author],
    )
