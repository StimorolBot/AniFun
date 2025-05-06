from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base
from src.utils.utils import generate_uuid, get_unc_now

if TYPE_CHECKING:
    from src.app.auth.models.v1.main.token import TokenTable


class AuthTable(Base):
    __tablename__ = "auth_table"

    uuid: Mapped[str] = mapped_column(primary_key=True, default=generate_uuid, index=True)
    user_name: Mapped[str] = mapped_column()
    identifier: Mapped[str] = mapped_column()
    date_register: Mapped[datetime] = mapped_column(default=get_unc_now)
    hash_password: Mapped[str | None] = mapped_column()
    auth_type: Mapped[str] = mapped_column(ForeignKey("auth_type_table.auth_type"))
    is_active: Mapped[bool] = mapped_column(default=True)
    is_superuser: Mapped[bool] = mapped_column(default=False)
    is_verified: Mapped[bool] = mapped_column(default=False)

    token_rs: Mapped["TokenTable"] = relationship(back_populates="auth_rs")

    __table_args__ = (UniqueConstraint("identifier", "auth_type"),)
