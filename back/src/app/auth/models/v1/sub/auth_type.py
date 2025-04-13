from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from src.model import Base
from src.utils.crud import crud
from src.app.auth.enums.v1.auth_type import AuthType


class AuthTypeTable(Base):
    __tablename__ = "auth_type_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    auth_type: Mapped[str] = mapped_column(unique=True)

    @classmethod
    async def fill(cls, session: AsyncSession):
        for data in AuthType:
            await crud.create(session=session, table=cls, data={"auth_type": data.value})
