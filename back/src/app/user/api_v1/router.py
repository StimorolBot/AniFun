from fastapi import APIRouter, Depends, status

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.user.utils.utils import get_current_user
from src.database.session import get_async_session

from src.app.user.schemas.api_v1 import schemas
from src.app.user.models.v1.avatar import AvatarTable
from src.app.auth.models.v1.main.auth import AuthTable

user_router = APIRouter(prefix="/users", tags=["user"])


@user_router.get("/user/avatar", status_code=status.HTTP_200_OK, summary="Получить аватар пользователя")
async def get_user_avatar(
        current_user: dict = Depends(get_current_user),
        session: AsyncSession = Depends(get_async_session)
) -> schemas.Avatar| None:
    query = (
        select(
            AuthTable.user_name.label("user_name"),
            AvatarTable.avatar.label("avatar"),
        )
        .select_from(AuthTable)
        .filter_by(uuid=current_user.get("sub"))
        .join(AvatarTable, isouter=True)
    )
    result = await session.execute(query)
    data = result.mappings().one_or_none()
    return data if data else None
