from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from src.app.auth.enums.v1.auth_provider import AuthProvider
from src.model import Base
from src.utils.crud import crud


class AuthProviderTable(Base):
    __tablename__ = "auth_provider_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    provider: Mapped[str] = mapped_column(unique=True)

    @classmethod
    async def fill(cls, session: AsyncSession):
        for data in AuthProvider:
            await crud.create(session=session, table=cls, data={"provider": data.value})
