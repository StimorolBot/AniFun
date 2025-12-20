from typing import TYPE_CHECKING

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.app.anime.enums.v1.sub.restrict import Restrict
from src.model import Base
from src.utils.crud import crud

if TYPE_CHECKING:
    from src.app.anime.models.v1.main.anime import AnimeTable


class AgeRestrictSubTable(Base):
    __tablename__ = "age_r_sub_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    label: Mapped[str] = mapped_column(unique=True)
    value: Mapped[str] = mapped_column()

    anime_rs: Mapped["AnimeTable"] = relationship(back_populates="age_restrict_rs")

    @classmethod
    async def fill(cls, session: AsyncSession):
        for data in Restrict:
            await crud.create(
                session=session,
                table=cls,
                data={"label": data.value["label"], "value": data.value["value"]}
            )
