from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from src.model import Base
from src.utils.utils import generate_uuid, get_unc_now


class AnimeTable(Base):
    __tablename__ = "anime_table"

    uuid: Mapped[UUID] = mapped_column(primary_key=True, default=generate_uuid, unique=True, index=True)
    title: Mapped[str] = mapped_column(unique=True)
    description: Mapped[str] = mapped_column()
    year: Mapped[int] = mapped_column()
    episodes: Mapped[int] = mapped_column()
    type: Mapped[int] = mapped_column(ForeignKey("type_table.id"))
    season: Mapped[int] = mapped_column(ForeignKey("season_table.id"))
    age_restrictions: Mapped[int] = mapped_column(ForeignKey("age_restrictions_table.id"))
    status: Mapped[int] = mapped_column(ForeignKey("status_table.id"))
