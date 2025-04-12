from typing import TYPE_CHECKING
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base
from src.utils.crud import crud
from src.app.anime.enums.v1.sub.season import Season

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.anime import AnimeTable


class SeasonTable(Base):
    __tablename__ = "season_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    season: Mapped[str] = mapped_column(unique=True)

    anime_rs: Mapped["AnimeTable"] = relationship(back_populates="season_rs")

    @classmethod
    async def fill(cls, session: AsyncSession):
        for data in Season:
            await crud.create(session=session, table=cls, data={"season": data.value})
