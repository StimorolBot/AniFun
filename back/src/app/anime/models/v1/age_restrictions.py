from sqlalchemy.orm import Mapped, mapped_column

from src.model import Base


class AgeRestrictionsTable(Base):
    __tablename__ = "age_restrictions_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
