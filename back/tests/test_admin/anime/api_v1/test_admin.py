import os
from io import BytesIO

import aiofiles
import pytest
from fastapi import status
from httpx import AsyncClient

from tests.conftest import ac

# запуск тестов
# pytest -vv -s tests/test_admin/anime/api_v1/test_admin.py::TestPos


relative_path = "public/.test"
absolute_path = os.path.abspath(relative_path)


class TestPos:
    @pytest.mark.parametrize("title, is_origin, alias", [("title_1", True, "alias"), ("title_2", False, None)])
    async def test_create_title(self, ac: AsyncClient, title: str, is_origin: bool, alias: str | None):
        data = {
            "title": title,
            "description": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error nemo maxime laboriosam...!",
            "year": 2025,
            "alias": alias,
            "type": "ТВ сериал",
            "total_episode": 12,
            "age_restrict": "12+",
            "status": "Онгоинг",
            "season": "Лето",
            "is_origin": is_origin,
            "genres": ["Безумие", "Боевые искусства", "Вампиры", "Военное", "Гарем", "Драма"]
        }
        response = await ac.post("/admin/anime/create-title", json=data)
        assert response.status_code == status.HTTP_201_CREATED

    async def test_add_relation_title(self, ac: AsyncClient):
        data = {"title": "title_1", "relation_title": "title_2"}
        response = await ac.post("/admin/anime/add-relation-title", json=data)
        assert response.status_code == status.HTTP_201_CREATED

    async def test_add_poster(self, ac: AsyncClient):
        params = {"title": "title_1"}
        async with aiofiles.open(f"{absolute_path}/test.webp", "rb") as f:
            img = await f.read()

        img_io = BytesIO(img)
        img_io.name = "test.webp"

        response = await ac.post("/admin/anime/add-poster", params=params, files={"img": img_io})
        assert response.status_code == status.HTTP_201_CREATED

    @pytest.mark.parametrize("title", ["title_1", "title_2"])
    async def test_add_episode(self, ac: AsyncClient, title: str):
        params = {"title": title, "episode_number": 1}
        async with aiofiles.open(f"{absolute_path}/test.mp4", "rb") as f:
            video = await f.read()

        video_io = BytesIO(video)
        video_io.name = "test.mp4"

        async with aiofiles.open(f"{absolute_path}/test.webp", "rb") as f:
            img = await f.read()

        img_io = BytesIO(img)
        img_io.name = "test.webp"

        response = await ac.post("/admin/anime/add-episode", params=params, files={"video": video_io, "img": img_io})
        assert response.status_code == status.HTTP_201_CREATED

    async def test_set_schedules(self, ac: AsyncClient):
        data = {
            "title": "title_1",
            "day_week": "Суббота",
            "item": [
                {
                    "date": "2025-11-08",
                    "episode_number": 1,
                    "episode_name": "episode 1"
                },
                {
                    "date": "2025-11-15",
                    "episode_number": 2,
                    "episode_name": "episode 2"
                },
            ]
        }
        response = await ac.post("/admin/anime/set-schedules", json=data)
        assert response.status_code == status.HTTP_201_CREATED

    async def test_add_slide(self, ac: AsyncClient):
        async with aiofiles.open(f"{absolute_path}/test.webp", "rb") as f:
            img = await f.read()

        img_io = BytesIO(img)
        img_io.name = "test.webp"

        response = await ac.patch("/admin/anime/add-slide", params={"title": "title_1"}, files={"img": img_io})
        assert response.status_code == status.HTTP_200_OK

    async def test_update_title(self, ac: AsyncClient):
        data = {
            "title_prev": "title_2",
            "title": "title_3",
            "description": "new description test 123",
            "age_restrict": "18+",
            "genres": ["Безумие", "Боевые искусства", "Драма"]
        }
        response = await ac.patch("/admin/anime/update-title", json=data)
        assert response.status_code == status.HTTP_200_OK

    async def test_update_schedules(self, ac: AsyncClient):
        data = {
            "title": "title_1",
            "day_week": "Суббота",
            "item": [
                {
                    "date": "2025-11-08",
                    "episode_number": 2,
                    "episode_name": "episode 1",
                    "update_fild": "episode_number"
                },
                {
                    "date": "2025-11-15",
                    "episode_number": 2,
                    "episode_name": "episode 3",
                    "update_fild": "episode_number"
                },
            ]
        }
        response = await ac.patch("/admin/anime/update-schedules", json=data)
        assert response.status_code == status.HTTP_200_OK

    async def test_delete_slide(self, ac: AsyncClient):
        response = await ac.patch("/admin/anime/delete-slide", json={"title": "title_2"})
        assert response.status_code == status.HTTP_200_OK

    async def test_delete_title(self, ac: AsyncClient):
        response = await ac.request("delete", "/admin/anime/delete-title", json={"title": "title_3"})
        assert response.status_code == status.HTTP_200_OK

    async def test_delete_relation_title(self, ac: AsyncClient):
        data = {"title": "title_1", "relation_title": "title_2"}
        response = await ac.request("delete", "/admin/anime/delete-relation-title", json=data)
        assert response.status_code == status.HTTP_200_OK

    async def test_delete_episode(self, ac: AsyncClient):
        data = {
            "title": "title_1",
            "episode_list": [
                {"episode_number": 1},
                {"episode_number": 2},
            ]
        }
        response = await ac.request("delete", "/admin/anime/delete-episode", json=data)
        assert response.status_code == status.HTTP_200_OK

    async def test_delete_schedules(self, ac: AsyncClient):
        response = await ac.request("delete", "/admin/anime/delete-schedules", json={"title": "title_1"})
        assert response.status_code == status.HTTP_200_OK

    async def test_get_api_list(self, ac: AsyncClient):
        response = await ac.get("/admin/anime/api-list")
        assert response.status_code == status.HTTP_200_OK


# pytest -vv -s tests/test_admin/anime/api_v1/test_admin.py::TestNeg

class TestNeg:
    @pytest.mark.parametrize(
        "title, description, year",
        [  # bad title
            (
                    "Lorem, ipsum dolor sit amet." * 8,
                    "Lorem, ipsum dolor sit amet." * 8,
                    2025
            ),
            (
                    "L$ore`",
                    "Lorem, ipsum dolor sit amet." * 8,
                    2025
            ),  # bad description
            (
                    "Lorem, ipsum dolor sit amet.",
                    "Lorem, ipsum dolor sit amet." * 38,
                    2025
            ),
            (
                    "Lorem, ipsum dolor sit amet.",
                    "Lorem, ipsum dolor | sit amet.",
                    2025
            ),  # bad year
            (
                    "Lorem, ipsum dolor sit amet.",
                    "Lorem, ipsum dolor sit amet.",
                    202
            )
        ]
    )
    async def test_add_new_title(self, ac: AsyncClient, title: str, description: str, year: int):
        params = {
            "title": title,
            "description": description,
            "year": year,
            "type": "ТВ сериал",
            "total_episode": 12,
            "age_restrict": "16+",
            "status": "Вышел",
            "season": "Зима",
            "is_origin": True,
            "genres": ["Безумие"]
        }
        response = await ac.post("/admin/anime/create-title", json=params)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
