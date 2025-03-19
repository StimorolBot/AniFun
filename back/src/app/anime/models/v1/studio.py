from sqlalchemy.orm import Mapped, mapped_column

from src.model import Base


class StudioTable(Base):
    __tablename__ = "studio_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
