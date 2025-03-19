from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base
from src.utils.utils import generate_uuid, get_unc_now

if TYPE_CHECKING:
    from src.app.auth.models.v1.auth import AuthTable


class TokenTable(Base):
    __tablename__ = "token_table"

    uuid: Mapped[str] = mapped_column(ForeignKey("auth_table.uuid"), primary_key=True, index=True)
    refresh_token: Mapped[str] = mapped_column(unique=True)
    date_update: Mapped[datetime] = mapped_column(default=get_unc_now)
    is_black_list: Mapped[bool] = mapped_column(default=False)

    auth_relationship: Mapped["AuthTable"] = relationship(back_populates="token_relationship")
