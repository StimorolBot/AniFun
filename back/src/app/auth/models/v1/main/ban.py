from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base
from src.utils.utils import get_unc_now

if TYPE_CHECKING:
    from src.app.auth.models.v1.main.auth import AuthTable


class BanTable(Base):
    __tablename__ = "ban_table"

    uuid: Mapped[UUID] = mapped_column(ForeignKey("auth_table.uuid"), primary_key=True, index=True)
    is_ban: Mapped[bool] = mapped_column(default=False)
    date_add: Mapped[datetime] = mapped_column(default=get_unc_now, server_default=func.now())
    date_end: Mapped[datetime] = mapped_column()

    auth_rs: Mapped["AuthTable"] = relationship(back_populates="ban_rs")
