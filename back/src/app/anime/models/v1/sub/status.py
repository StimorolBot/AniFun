from typing import TYPE_CHECKING

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.app.anime.enums.v1.sub.status import Status
from src.model import Base
from src.utils.crud import crud

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.anime import AnimeTable


class StatusSubTable(Base):
    __tablename__ = "status_sub_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    status: Mapped[str] = mapped_column(unique=True)
    alias: Mapped[str] = mapped_column(unique=True)

    anime_rs: Mapped["AnimeTable"] = relationship(back_populates="status_rs")

    @classmethod
    async def fill(cls, session: AsyncSession):
        for data in Status:
            await crud.create(session=session, table=cls, data={"status": data.value, "alias": data.name.lower()})
