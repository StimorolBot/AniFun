import pytest

from src.app.auth.enums.v1.auth_type import AuthType
from src.app.auth.models.v1.main.auth import AuthTable
from src.utils.crud import crud
from src.utils.utils import generate_uuid
from tests.conftest import async_session_maker


@pytest.fixture(autouse=True, scope="module")
async def create_user():
    async with async_session_maker() as session:
        for i in AuthType:
            await crud.create(
                session=session, table=AuthTable,
                data={
                    "uuid": generate_uuid(),
                    "user_name": "test_user",
                    "identifier": f"test_email{i.value}@gmail.com",
                    "auth_type": i.value
                }
            )
            await session.commit()
