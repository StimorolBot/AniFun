from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.app.user.utils.utils import get_user_avatar
from src.model import Base

if TYPE_CHECKING:
    from src.app.auth.models.v1.main.auth import AuthTable


class AvatarTable(Base):
    __tablename__ = "avatar_table"

    uuid: Mapped[UUID] = mapped_column(ForeignKey("auth_table.uuid"), primary_key=True)
    avatar: Mapped[str] = mapped_column(default=get_user_avatar)

    auth_rs: Mapped["AuthTable"] = relationship(back_populates="avatar_rs")
