from sqlalchemy.orm import Mapped, mapped_column

from src.model import Base


class RatingTable(Base):
    __tablename__ = "rating_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
