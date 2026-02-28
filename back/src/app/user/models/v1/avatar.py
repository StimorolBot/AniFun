from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base

if TYPE_CHECKING:
    from src.app.auth.models.v1.main.auth import AuthTable


class AvatarTable(Base):
    __tablename__ = "avatar_table"

    uuid: Mapped[UUID] = mapped_column(ForeignKey("auth_table.uuid"), primary_key=True)
    avatar_uuid: Mapped[UUID] = mapped_column()

    auth_rs: Mapped["AuthTable"] = relationship(back_populates="avatar_rs")
