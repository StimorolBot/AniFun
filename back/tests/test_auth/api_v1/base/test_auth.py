import pytest
from fastapi import status
from httpx import AsyncClient

from tests.conftest import ac
from src.redis.redis_manager import redis_manager

TEST_USER_EMAIL = "user@example.com"


# запуск тестов
# pytest -vv -s tests/test_auth/api_v1/base/test_auth.py::TestAuthPos


class TestAuthPos:

    @pytest.mark.dependency()
    async def test_register(self, ac: AsyncClient):
        user_data = {
            "email": TEST_USER_EMAIL, "user_name": "string123",
            "password": "string123", "password_confirm": "string123"
        }
        response = await ac.post("/auth/register", json=user_data)
        response_dist = response.json()
        pytest.recaptcha_token = response_dist["recaptcha_token"]

        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.dependency(depends=["TestAuthPos::test_register"])
    async def test_verify_email(self, ac: AsyncClient):
        redis_data = await redis_manager.get_value(pytest.recaptcha_token)
        user_data = {"email_token": redis_data["email_token"], "recaptcha_token": pytest.recaptcha_token}
        response = await ac.post("/auth/verify-email", json=user_data)

        assert response.status_code == status.HTTP_201_CREATED

    @pytest.mark.dependency()
    async def test_login(self, ac: AsyncClient):
        user_data = {"email": TEST_USER_EMAIL, "password": "string123"}
        response = await ac.post("/auth/login", json=user_data)
        pytest.access_token = response.json()

        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.dependency(depends=["TestAuthPos::test_login"])
    async def test_logout(self, ac: AsyncClient):
        response = await ac.patch("/auth/logout", cookies=pytest.access_token)
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.dependency()
    async def test_token_password(self, ac: AsyncClient):
        response = await ac.post("/auth/token-password", json={"user_email": TEST_USER_EMAIL})
        pytest.recaptcha_token = response.json()
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.dependency(depends=["TestAuthPos::test_token_password"])
    async def test_reset_password(self, ac: AsyncClient):
        redis_data = await redis_manager.get_value(pytest.recaptcha_token["recaptcha_token"])
        data = {
            "password": "TestPassword123", "password_confirm": "TestPassword123",
            "email_token": redis_data["email_token"], **pytest.recaptcha_token
        }
        response = await ac.patch("/auth/reset-password", json=data)
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.dependency(depends=["TestAuthPos::test_login"])
    async def test_refresh_token(self, ac: AsyncClient):
        response = await ac.post("/auth/refresh-token", cookies=pytest.access_token)
        assert response.status_code == status.HTTP_200_OK


# pytest -vv -s tests/test_auth/api_v1/base/test_auth.py::TestAuthNeg
class TestAuthNeg:
    @pytest.mark.parametrize(
        "user_name, email, password, password_confirm",
        [
            (" ", "email@gmail.com", "string123", "string123"),
            ("123", "email@gmail.com", "string123", "string123"),
            ("VeryLongUserName12345", "email@gmail.com", "string123", "string123"),

            ("userName", " ", "string123", "string123"),
            ("userName", "bag_email_123_com", "string123", "string123"),
            ("userName", "email@.com", "string123", "string123"),

            ("userName", "email@email.com", " ", " "),
            ("userName", "email@email.com", "psd", "psd"),
            ("userName", "email@email.com", "password1", "password2"),
            ("userName", "email@email.com", "pas@swor_d1", "pas@swor_d1")
        ]
    )
    async def test_register(self, ac: AsyncClient, user_name, email, password, password_confirm):
        user_data = {
            "user_name": user_name, "email": email,
            "password": password, "password_confirm": password_confirm
        }
        response = await ac.post("/auth/register", json=user_data)

        if response.status_code == status.HTTP_400_BAD_REQUEST:
            assert response.status_code == status.HTTP_400_BAD_REQUEST
        else:
            assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    async def test_login(self, ac: AsyncClient):
        user_data = {"email": "fake_email@mail.com", "password": "fake_password"}
        response = await ac.post("/auth/login", json=user_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    async def test_logout(self, ac: AsyncClient):
        response = await ac.patch("/auth/logout", cookies={"access_token": ""})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
