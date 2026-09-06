from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from src.app.anime.enums.v1.sub.voice_team import VoiceTeam
from src.model import Base
from src.utils.crud import crud


class VoiceTeamTable(Base):
    __tablename__ = "voice_team_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    label: Mapped[str] = mapped_column(unique=True)
    value: Mapped[str] = mapped_column(unique=True)

    @classmethod
    async def fill(cls, session: AsyncSession):
        for data in VoiceTeam:
            await crud.create(
                session=session,
                table=cls,
                data={"label": data.label, "value": data.value}
            )
