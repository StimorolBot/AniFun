from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from src.model import Base


class ScheduleTable(Base):
    __tablename__ = "schedule_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(ForeignKey("anime_table.title"), index=True)
    episode_number: Mapped[int] = mapped_column()
    day_week: Mapped[str] = mapped_column()
    date: Mapped[str] = mapped_column()

    __table_args__ = (UniqueConstraint("title", "episode_number", "day_week", "date"),)
