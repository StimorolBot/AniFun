from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from src.app.auth.enums.v1.role import Role
from src.model import Base
from src.utils.crud import crud


class RoleTable(Base):
    __tablename__ = "role_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    role: Mapped[str] = mapped_column(unique=True)

    @classmethod
    async def fill(cls, session: AsyncSession):
        for data in Role:
            await crud.create(session=session, table=cls, data={"role": data.value})
