from sqlalchemy.orm import Mapped, mapped_column

from src.model import Base


class TypeTable(Base):
    __tablename__ = "type_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    type: Mapped[str] = mapped_column()
