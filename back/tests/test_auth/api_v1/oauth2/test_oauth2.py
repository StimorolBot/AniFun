import base64
import json
from types import SimpleNamespace

from fastapi import status
from httpx import AsyncClient

from src.app.auth.oauth.api_v1 import router as oauth_router
from tests.conftest import ac


class TestAuthPos:
    async def test_uri_google(self, ac: AsyncClient, monkeypatch):
        async def _authorize_redirect(*args, **kwargs):
            return SimpleNamespace(_headers={"location": "https://accounts.google.com/o/oauth2/auth?state=test"})

        monkeypatch.setattr(oauth_router.oauth.google, "authorize_redirect", _authorize_redirect)

        response = await ac.get("/auth/oauth2/uri-google")
        assert response.status_code == status.HTTP_200_OK

    async def test_auth_google(self, ac: AsyncClient, monkeypatch):
        async def _authorize_access_token(*args, **kwargs):
            return {
                "userinfo": {
                    "email": "google_email@gmail.com",
                    "given_name": "test_user"
                }
            }

        monkeypatch.setattr(oauth_router.oauth.google, "authorize_access_token", _authorize_access_token)

        response = await ac.get("/auth/oauth2/auth-google")
        assert response.status_code == status.HTTP_200_OK

    async def test_auth_google_existing_user(self, ac: AsyncClient, monkeypatch):
        async def _authorize_access_token(*args, **kwargs):
            return {"userinfo": {"email": "existing_google@gmail.com", "given_name": "Existing"}}

        async def _crud_read(*args, **kwargs):
            return SimpleNamespace(uuid="existing-google-uuid", identifier="existing_google@gmail.com")

        async def _crud_update(*args, **kwargs):
            return None

        monkeypatch.setattr(oauth_router.oauth.google, "authorize_access_token", _authorize_access_token)
        monkeypatch.setattr(oauth_router.crud, "read", _crud_read)
        monkeypatch.setattr(oauth_router.crud, "update", _crud_update)
        monkeypatch.setattr(
            oauth_router.jwt_token,
            "create_tokens",
            lambda *args, **kwargs: {"access_token": "google-access", "refresh_token": "google-refresh"}
        )
        response = await ac.get("/auth/oauth2/auth-google")
        assert response.status_code == status.HTTP_200_OK

    async def test_uri_discord(self, ac: AsyncClient):
        response = await ac.get("/auth/oauth2/uri-discord")
        assert response.status_code == status.HTTP_200_OK

    async def test_auth_discord(self, ac: AsyncClient, monkeypatch):
        class DummyResponse:
            def __init__(self, status_code: int, payload: dict):
                self.status_code = status_code
                self._payload = payload

            def json(self):
                return self._payload

        class DummyAsyncClient:
            async def __aenter__(self):
                return self

            async def __aexit__(self, exc_type, exc, tb):
                return False

            async def post(self, *args, **kwargs):
                return DummyResponse(
                    status_code=status.HTTP_200_OK,
                    payload={"token_type": "Bearer", "access_token": "discord-access-token"}
                )

            async def get(self, *args, **kwargs):
                return DummyResponse(
                    status_code=status.HTTP_200_OK,
                    payload={"email": "discord_test@gmail.com", "global_name": "test_user"}
                )

        monkeypatch.setattr(oauth_router.httpx, "AsyncClient", DummyAsyncClient)

        response = await ac.get("/auth/oauth2/auth-discord", params={"code": "code"})
        assert response.status_code == status.HTTP_200_OK

    async def test_auth_telegram(self, ac: AsyncClient):
        payload = {"id": 1122334456, "username": "telegram_user", "first_name": "telegram"}
        encoded = base64.b64encode(json.dumps(payload).encode()).decode().rstrip("=")

        response = await ac.post("/auth/oauth2/auth-telegram", json={"data_bas64": encoded})
        assert response.status_code == status.HTTP_200_OK

    async def test_auth_discord_existing_user(self, ac: AsyncClient, monkeypatch):
        class DummyResponse:
            def __init__(self, status_code: int, payload: dict):
                self.status_code = status_code
                self._payload = payload

            def json(self):
                return self._payload

        class DummyAsyncClient:
            async def __aenter__(self):
                return self

            async def __aexit__(self, exc_type, exc, tb):
                return False

            async def post(self, *args, **kwargs):
                return DummyResponse(
                    status_code=status.HTTP_200_OK,
                    payload={"token_type": "Bearer", "access_token": "discord-access-token"}
                )

            async def get(self, *args, **kwargs):
                return DummyResponse(
                    status_code=status.HTTP_200_OK,
                    payload={"email": "existing_discord@gmail.com", "global_name": "existing_user"}
                )

        async def _crud_read(*args, **kwargs):
            return SimpleNamespace(id=99, identifier="existing_discord@gmail.com")

        async def _crud_update(*args, **kwargs):
            return None

        monkeypatch.setattr(oauth_router.httpx, "AsyncClient", DummyAsyncClient)
        monkeypatch.setattr(oauth_router.crud, "read", _crud_read)
        monkeypatch.setattr(oauth_router.crud, "update", _crud_update)
        monkeypatch.setattr(oauth_router.jwt_token, "create", lambda *args, **kwargs: "existing-discord-token")
        response = await ac.get("/auth/oauth2/auth-discord", params={"code": "valid-code"})
        assert response.status_code == status.HTTP_200_OK


class TestAuthNeg:
    async def test_auth_telegram(self, ac: AsyncClient):
        response = await ac.post("/auth/oauth2/auth-telegram", json={"data_bas64": "invalid_base_64"})
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    async def test_auth_google(self, ac: AsyncClient, monkeypatch):
        async def _raise_mismatch(*args, **kwargs):
            raise oauth_router.MismatchingStateError()

        monkeypatch.setattr(oauth_router.oauth.google, "authorize_access_token", _raise_mismatch)

        response = await ac.get("/auth/oauth2/auth-google")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    async def test_auth_discord_token_exchange_failed(self, ac: AsyncClient, monkeypatch):
        class DummyResponse:
            def __init__(self, status_code: int, payload: dict):
                self.status_code = status_code
                self._payload = payload

            def json(self):
                return self._payload

        class DummyAsyncClient:
            async def __aenter__(self):
                return self

            async def __aexit__(self, exc_type, exc, tb):
                return False

            async def post(self, *args, **kwargs):
                return DummyResponse(status_code=status.HTTP_401_UNAUTHORIZED, payload={"error": "invalid_grant"})

        monkeypatch.setattr(oauth_router.httpx, "AsyncClient", DummyAsyncClient)

        response = await ac.get("/auth/oauth2/auth-discord", params={"code": "bad-code"})
        assert response.status_code == status.HTTP_503_SERVICE_UNAVAILABLE
