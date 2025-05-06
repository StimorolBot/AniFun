from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from src.utils.crud import crud
from src.utils.logger import auth_log
from src.app.auth.models.v1.main.auth import AuthTable
from src.app.auth.models.v1.main.token import TokenTable

from src.app.auth.base.api_v1.jwt.config import jwt_setting
from src.app.auth.base.api_v1.jwt.jwt_token import jwt_token
from src.app.auth.base.api_v1.jwt.token_type import TokenType


async def create_user(session: AsyncSession, data: dict) -> dict:
    user_created = await crud.create(session=session, table=AuthTable, data=data)

    await session.flush()

    access_token = jwt_token.create(
        token_type=TokenType.ACCESS.value,
        token_data={"sub": user_created.uuid, "auth_type": data["auth_type"]}
    )

    refresh_token = jwt_token.create(
        token_type=TokenType.REFRESH.value,
        token_data={"sub": user_created.uuid, "auth_type": data["auth_type"]},
        expire_timedelta=timedelta(days=jwt_setting.refresh_token_expire_days)
    )

    await crud.create(
        session=session, table=TokenTable,
        data={"uuid": user_created.uuid, "refresh_token": refresh_token}
    )
    await session.commit()

    auth_log.info("Создание учетной записи: %s", data["identifier"])
    return {"access_token": access_token}
