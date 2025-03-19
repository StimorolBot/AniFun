from sqlalchemy.orm import Mapped, mapped_column

from src.model import Base


class ScheduleTable(Base):
    __tablename__ = "schedule_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
