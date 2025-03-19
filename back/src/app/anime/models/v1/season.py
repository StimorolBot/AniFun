from sqlalchemy.orm import Mapped, mapped_column

from src.model import Base


class SeasonTable(Base):
    __tablename__ = "season_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
