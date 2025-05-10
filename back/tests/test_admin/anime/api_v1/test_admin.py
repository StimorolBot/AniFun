import os
import pytest
from io import BytesIO

from fastapi import status
from httpx import AsyncClient

from tests.conftest import ac
from src.app.admin.file_server import file_server

# запуск тестов
# pytest -vv -s tests/test_admin/anime/api_v1/test_admin.py::TestPos


relative_path = "public/.test"
absolute_path = os.path.abspath(relative_path)


class TestPos:

    @pytest.mark.parametrize(
        "title, poster, is_origin",
        [
            ("title_1", "test_poster.webp", True),
            ("title_2", "test.poster.webp", False)
        ]
    )
    async def test_add_new_title(self, ac: AsyncClient, title: str, poster: str, is_origin: bool):
        params = {
            "title": title,
            "description": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error nemo maxime laboriosam...!",
            "year": 2025,
            "type": "ТВ сериал",
            "episodes": 12,
            "age_restrict": "12+",
            "status": "Онгоинг",
            "season": "Лето",
            "is_origin": is_origin,
        }
        genres = ["Безумие", "Боевые искусства", "Вампиры", "Военное", "Гарем", "Драма"]
        file = await file_server.read(path=absolute_path, title="test_poster.webp")
        file_io = BytesIO(file)
        file_io.name = poster

        response = await ac.post(
            "/admin/anime/add-new-title",
            params=params,
            files={"img": file_io},
            data={"genres": genres}
        )

        assert response.status_code == status.HTTP_201_CREATED

    async def test_add_relation_title(self, ac: AsyncClient):
        data = {"title": "title_1", "relation_title": "title_2"}
        response = await ac.post("/admin/anime/add-relation-title", json=data)
        assert response.status_code == status.HTTP_201_CREATED

    @pytest.mark.parametrize(
        "title, video_name",
        [
            ("title_1", "test.mp4"),
            ("title_2", "test.1.mp4")
        ]
    )
    async def test_add_episode(self, ac: AsyncClient, title: str, video_name: str):
        params = {"title": title, "episode": 1}
        file = await file_server.read(path=absolute_path, title="test.mp4")
        file_io = BytesIO(file)
        file_io.name = video_name
        response = await ac.post("/admin/anime/add-episode", params=params, files={"video": file_io})
        assert response.status_code == status.HTTP_201_CREATED

    async def test_set_schedules(self, ac: AsyncClient):
        data = {
            "title": "title_1",
            "day_week": "Суббота",
            "schedule_item": [
                {
                    "day": 10,
                    "month": 5,
                    "year": 2025,
                    "episode_number": 1,
                    "episode_name": "episode 1"
                },
            ]
        }
        response = await ac.post("/admin/anime/set-schedules", json=data)
        assert response.status_code == status.HTTP_201_CREATED

    async def test_add_slide(self, ac: AsyncClient):
        params = {"title": "title_1"}
        file = await file_server.read(path=absolute_path, title="test_banner.webp")
        file_io = BytesIO(file)
        file_io.name = "test_banner.webp"

        response = await ac.patch("/admin/anime/add-slide", params=params, files={"img": file_io})
        assert response.status_code == status.HTTP_200_OK

    async def test_delite_slide(self, ac: AsyncClient):
        response = await ac.patch("/admin/anime/delite-slide", params={"title": "title_1"})
        assert response.status_code == status.HTTP_200_OK

    async def test_delite_title(self, ac: AsyncClient):
        response = await ac.delete("/admin/anime/delite-title", params={"title": "title_1"})
        assert response.status_code == status.HTTP_200_OK


# pytest -vv -s tests/test_admin/anime/api_v1/test_admin.py::TestNeg

class TestNeg:
    @pytest.mark.parametrize(
        "title, description, year, type_, episodes, age_restrict, status_, season, is_origin, genres",
        [  # bad title
            (
                    "Lorem, ipsum dolor sit amet." * 8,
                    "Lorem, ipsum dolor sit amet." * 8,
                    2025, "ТВ сериал", 12, "16+", "Вышел", "Зима", True, ["Безумие"]
            ),
            (
                    "L$ore`",
                    "Lorem, ipsum dolor sit amet." * 8,
                    2025, "ТВ сериал", 12, "16+", "Вышел", "Зима", True, ["Безумие"]
            ),
            # bad description
            (
                    "Lorem, ipsum dolor sit amet.",
                    "Lorem, ipsum dolor sit amet." * 38,
                    2025, "ТВ сериал", 12, "16+", "Вышел", "Зима", True, ["Безумие"]
            ),
            (
                    "Lorem, ipsum dolor sit amet.",
                    "Lorem, ipsum dolor | sit amet.",
                    2025, "ТВ сериал", 12, "16+", "Вышел", "Зима", True, ["Безумие"]
            ),
            # bad year
            (
                    "Lorem, ipsum dolor sit amet.",
                    "Lorem, ipsum dolor sit amet.",
                    202, "ТВ сериал", 12, "16+", "Вышел", "Зима", True, ["Безумие"]
            ),
        ]
    )
    async def test_add_new_title(
            self, ac: AsyncClient,
            title, description,
            year, type_,
            episodes, age_restrict,
            status_, season,
            is_origin, genres
    ):
        params = {
            "title": title,
            "description": description,
            "year": year,
            "type": type_,
            "episodes": 12,
            "age_restrict": age_restrict,
            "status": status_,
            "season": season,
            "is_origin": is_origin,
        }
        file = await file_server.read(path=absolute_path, title="test_poster.webp")
        file_io = BytesIO(file)
        file_io.name = "test_poster.webp"

        response = await ac.post(
            "/admin/anime/add-new-title",
            params=params,
            files={"img": file_io},
            data={"genres": genres}
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST
