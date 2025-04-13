from typing import TYPE_CHECKING

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.model import Base
from src.utils.crud import crud
from src.app.anime.enums.v1.sub.restrict import Restrict

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.anime import AnimeTable


class AgeRestrictTable(Base):
    __tablename__ = "age_restrict_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    restrict: Mapped[str] = mapped_column(unique=True)

    anime_rs: Mapped["AnimeTable"] = relationship(back_populates="age_restrict_rs")

    @classmethod
    async def fill(cls, session: AsyncSession):
        for data in Restrict:
            await crud.create(session=session, table=cls, data={"restrict": data.value})
