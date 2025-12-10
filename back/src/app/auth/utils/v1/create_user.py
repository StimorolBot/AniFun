from sqlalchemy.ext.asyncio import AsyncSession

from src.app.auth.base.api_v1.jwt.jwt_token import jwt_token
from src.app.auth.models.v1.main.auth import AuthTable
from src.app.auth.models.v1.main.token import TokenTable
from src.app.user.models.v1.avatar import AvatarTable
from src.utils.crud import crud
from src.utils.logger import auth_log


async def create_user(session: AsyncSession, data: dict) -> dict:
    user_created = await crud.create(session=session, table=AuthTable, data=data)
    await session.flush()

    tokens = jwt_token.create_tokens(sub=user_created.uuid, auth_type=data["auth_type"])
    await crud.create(session=session, table=AvatarTable, data={"uuid": user_created.uuid})

    await crud.create(
        session=session, table=TokenTable,
        data={"uuid": user_created.uuid, "refresh_token": tokens["refresh_token"]}
    )
    await session.commit()

    auth_log.info("Создание учетной записи: %s", data["identifier"])
    return tokens
