from sqlalchemy.orm import Mapped, mapped_column

from src.model import Base


class StatusTable(Base):
    __tablename__ = "status_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
