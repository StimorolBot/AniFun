from sqlalchemy.orm import Mapped, mapped_column

from src.model import Base

class GenresTable(Base):
    __tablename__ = "genres_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)