import datetime

import pytest
from fastapi import status
from httpx import AsyncClient
from types import SimpleNamespace

from src.app.anime.enums.v1 import sub as sub_enum
from src.app.anime.schemas.api_v1 import schemas
from src.utils.crud import crud
from tests.conftest import ac


class TestPos:
    @pytest.mark.parametrize(
        "title, is_origin, alias", [
            ("title_test", True, "test-alias"),
            ("title_test_2", False, None),
            ("title_test_3", True, None)
        ]
    )
    async def test_create_title(self, ac: AsyncClient, title: str, is_origin: bool, alias: str):
        data = {
            "title": title,
            "description": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error nemo maxime laboriosam...!",
            "year": 2025,
            "alias": alias,
            "type": sub_enum.TypeLabel.TV.value,
            "season": sub_enum.SeasonLabel.SUMMER.value,
            "age_restrict": sub_enum.RestrictLabel.PG_13.value,
            "status": sub_enum.StatusLabel.ONGOING.value,
            "genres": [
                {"label": sub_enum.Genres.MADNESS.value["label"], "value": sub_enum.Genres.MADNESS.value["value"]},
                {"label": sub_enum.Genres.CARS.value["label"], "value": sub_enum.Genres.CARS.value["value"]},
                {"label": sub_enum.Genres.MEXA.value["label"], "value": sub_enum.Genres.MEXA.value["value"]}
            ],
            "is_origin": is_origin,
            "total_episode": 12
        }
        response = await ac.post("/admin/anime/create-title", json=data)
        assert response.status_code == status.HTTP_201_CREATED

    async def test_update_title(self, ac: AsyncClient):
        data = {
            "old_title_name": "title_test",
            "new_title_name": "update_title_name",
            "description": "new description test 123",
            "age_restrict": sub_enum.RestrictLabel.NC_17.value,
            "genres": [
                {"label": sub_enum.Genres.SPORT.value["label"], "value": sub_enum.Genres.SPORT.value["value"]},
                {"label": sub_enum.Genres.CHILDREN.value["label"], "value": sub_enum.Genres.CHILDREN.value["value"]}
            ],
        }
        response = await ac.patch("/admin/anime/update-title", json=data)
        assert response.status_code == status.HTTP_200_OK

    async def test_delete_title(self, ac: AsyncClient):
        response = await ac.delete("/admin/anime/delete-title", params={"title": "title_test_3"})
        assert response.status_code == status.HTTP_204_NO_CONTENT

    async def test_add_banner(self, ac: AsyncClient):
        response = await ac.post(
            "/admin/anime/add-banner",
            params={"title": "update_title_name"},
            files={"file": ("test", b"banner-file.png", "image/png")}
        )
        assert response.status_code == status.HTTP_201_CREATED

    async def test_update_banner(self, ac: AsyncClient):
        response = await ac.patch(
            "/admin/anime/update-banner",
            params={"title": "update_title_name"},
            files={"file": ("test", b"update-banner-file.png", "image/png")}
        )
        assert response.status_code == status.HTTP_200_OK

    async def test_delete_banner(self, ac: AsyncClient):
        response = await ac.delete(
            "/admin/anime/delete-banner",
            params={"title": "update_title_name"}
        )
        assert response.status_code == status.HTTP_204_NO_CONTENT

    async def test_add_poster(self, ac: AsyncClient):
        response = await ac.post(
            "/admin/anime/add-poster-title",
            params={"title": "update_title_name"},
            files={"file": ("test", b"poster-file.png", "image/png")}
        )
        assert response.status_code == status.HTTP_201_CREATED

    async def test_update_poster_title(self, ac: AsyncClient):
        response = await ac.patch(
            "/admin/anime/update-poster-title",
            params={"title": "update_title_name"},
            files={"file": ("test", b"update-poster-file.png", "image/png")}
        )
        assert response.status_code == status.HTTP_200_OK

    async def test_add_poster_genres(self, ac: AsyncClient):
        response = await ac.post(
            "/admin/anime/add-poster-genres",
            params={"genres": "игры"},
            files={"file": ("test", b"poster-file.png", "image/png")}
        )
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.parametrize(
        "title, is_schedule_exist",
        [("update_title_name", True), ("title_test_2", False)]
    )
    async def test_add_episode(self, ac: AsyncClient, title: str, is_schedule_exist: bool):
        params = {
            "title": title,
            "episode_number": 1,
            "is_schedule_exist": is_schedule_exist,
            "episode_name": "test_name"
        }
        response = await ac.post(
            "/admin/anime/add-episode",
            params=params,
            files={"file": ("test", b"poster-file.mp4", "video/mp4")}
        )
        assert response.status_code == status.HTTP_201_CREATED

    async def test_delete_episode(self, ac: AsyncClient):
        params = {
            "title": "update_title_name",
            "episode_number": 1,
        }
        response = await ac.delete("/admin/anime/delete-episode", params=params)
        assert response.status_code == status.HTTP_204_NO_CONTENT

    async def test_add_preview(self, ac: AsyncClient):
        params = {"title": "title_test_2", "episode_number": 1}
        response = await ac.post(
            "/admin/anime/add-preview-episode",
            params=params,
            files={"file": ("test", b"preview-file.png", "image/png")}
        )
        assert response.status_code == status.HTTP_201_CREATED

    async def test_update_preview_episode(self, ac: AsyncClient):
        params = {"title": "title_test_2", "episode_number": 1}
        response = await ac.patch(
            "/admin/anime/update-preview-episode",
            params=params,
            files={"file": ("test", b"preview-file-update.png", "image/png")}
        )
        assert response.status_code == status.HTTP_200_OK

    async def test_add_sequel_title(self, ac: AsyncClient):
        data = {"title": "update_title_name", "sequel_title": "title_test_2"}
        response = await ac.post("/admin/anime/add-sequel-title", json=data)
        assert response.status_code == status.HTTP_201_CREATED

    async def test_delete_sequel_title(self, ac: AsyncClient):
        params = {"title": "update_title_name", "sequel_title": "title_test_2"}
        response = await ac.delete("/admin/anime/delete-sequel-title", params=params)
        assert response.status_code == status.HTTP_204_NO_CONTENT

    async def test_set_schedules(self, ac: AsyncClient):
        data = {
            "title": "update_title_name",
            "day_week": {
                "value": sub_enum.DayWeek.FRIDAY.value["value"],
                "label": sub_enum.DayWeek.FRIDAY.value["label"]
            },
            "item": [
                {
                    "date": "2026-04-10",
                    "episode_number": 1,
                    "episode_name": "episode 1"
                },
                {
                    "date": "2026-04-17",
                    "episode_number": 2,
                    "episode_name": "episode 2"
                },
            ],
            "is_extend": False
        }
        response = await ac.post("/admin/anime/set-schedules", json=data)
        assert response.status_code == status.HTTP_201_CREATED

    @pytest.mark.parametrize(
        "update_field, old_value, day_week, date_release, episode_number, episode_name",
        [
            ("day_week",
             sub_enum.DayWeek.FRIDAY.value["label"],
             {"value": sub_enum.DayWeekValue.SUNDAY.value, "label": sub_enum.DayWeekLabel.SUNDAY.value},
             None, None, None
             ),
            ("date_release", "2026-04-10", None, "2026-04-11", None, None),
            ("episode_number", 1, None, None, 2, None),
            ("episode_name", "episode 2", None, None, None, "update 2")
        ])
    async def test_update_schedules(
            self,
            ac: AsyncClient,
            update_field: str,
            old_value,
            day_week: schemas.DayWeekDTO | None,
            date_release: datetime.date | None,
            episode_number: int | None,
            episode_name: str | None
    ):
        data = {
            "title": "update_title_name",
            "update_field": update_field,
            "old_value": old_value,
            "day_week": day_week,
            "date_release": date_release,
            "episode_number": episode_number,
            "episode_name": episode_name
        }
        response = await ac.patch("/admin/anime/update-schedules", json=data)
        assert response.status_code == status.HTTP_200_OK

    async def test_delete_schedules_item(self, ac: AsyncClient):
        params = {"title": "update_title_name", "episode_number": 1}
        response = await ac.delete("/admin/anime/delete-schedules-item", params=params)
        assert response.status_code == status.HTTP_204_NO_CONTENT

    async def test_delete_schedules(self, ac: AsyncClient):
        response = await ac.delete("/admin/anime/delete-schedules", params={"title": "update_title_name"})
        assert response.status_code == status.HTTP_204_NO_CONTENT


class TestNeg:

    @pytest.mark.parametrize(
        "title, description, alias, year, type_, season, age_restrict,"
        "status_, genres, is_origin, total_episode, expected_status",
        [
            (
                    "`Bad title name",
                    "Test description",
                    None,
                    2020,
                    sub_enum.TypeLabel.TV.value,
                    sub_enum.SeasonLabel.SUMMER.value,
                    sub_enum.RestrictLabel.PG_13.value,
                    sub_enum.StatusLabel.ONGOING.value,
                    [{"value": sub_enum.GenresValue.MEXA.value, "label": sub_enum.GenresLabel.MEXA.value}],
                    True,
                    12,
                    status.HTTP_400_BAD_REQUEST
            ),
            (
                    "Bad title name" * 30,
                    "Test description",
                    None,
                    2020,
                    sub_enum.TypeLabel.TV.value,
                    sub_enum.SeasonLabel.SUMMER.value,
                    sub_enum.RestrictLabel.PG_13.value,
                    sub_enum.StatusLabel.ONGOING.value,
                    [{"value": sub_enum.GenresValue.MEXA.value, "label": sub_enum.GenresLabel.MEXA.value}],
                    True,
                    12,
                    status.HTTP_400_BAD_REQUEST
            ),
            (
                    "Bad title name",
                    "Test description",
                    "Тест 123",
                    2020,
                    sub_enum.TypeLabel.TV.value,
                    sub_enum.SeasonLabel.SUMMER.value,
                    sub_enum.RestrictLabel.PG_13.value,
                    sub_enum.StatusLabel.ONGOING.value,
                    [{"value": sub_enum.GenresValue.MEXA.value, "label": sub_enum.GenresLabel.MEXA.value}],
                    True,
                    12,
                    status.HTTP_400_BAD_REQUEST
            ),
            (
                    "Bad title name",
                    "Test description",
                    None,
                    2222,
                    sub_enum.TypeLabel.TV.value,
                    sub_enum.SeasonLabel.SUMMER.value,
                    sub_enum.RestrictLabel.PG_13.value,
                    sub_enum.StatusLabel.ONGOING.value,
                    [{"value": sub_enum.GenresValue.MEXA.value, "label": sub_enum.GenresLabel.MEXA.value}],
                    True,
                    12,
                    status.HTTP_400_BAD_REQUEST
            ),
            (
                    "Bad title name",
                    "Test description",
                    None,
                    2020,
                    "bad type",
                    sub_enum.SeasonLabel.SUMMER.value,
                    sub_enum.RestrictLabel.PG_13.value,
                    sub_enum.StatusLabel.ONGOING.value,
                    [{"value": sub_enum.GenresValue.MEXA.value, "label": sub_enum.GenresLabel.MEXA.value}],
                    True,
                    12,
                    status.HTTP_422_UNPROCESSABLE_ENTITY
            ),
            (
                    "Bad title name",
                    "Test description",
                    None,
                    2020,
                    sub_enum.TypeLabel.TV.value,
                    "bad season",
                    sub_enum.RestrictLabel.PG_13.value,
                    sub_enum.StatusLabel.ONGOING.value,
                    [{"value": sub_enum.GenresValue.MEXA.value, "label": sub_enum.GenresLabel.MEXA.value}],
                    True,
                    12,
                    status.HTTP_422_UNPROCESSABLE_ENTITY
            ),
            (
                    "Bad title name",
                    "Test description",
                    None,
                    2020,
                    sub_enum.TypeLabel.TV.value,
                    sub_enum.SeasonLabel.SUMMER.value,
                    "bad age restrict",
                    sub_enum.StatusLabel.ONGOING.value,
                    [{"value": sub_enum.GenresValue.MEXA.value, "label": sub_enum.GenresLabel.MEXA.value}],
                    True,
                    12,
                    status.HTTP_422_UNPROCESSABLE_ENTITY
            ),
            (
                    "Bad title name",
                    "Test description",
                    None,
                    2020,
                    sub_enum.TypeLabel.TV.value,
                    sub_enum.SeasonLabel.SUMMER.value,
                    sub_enum.RestrictLabel.PG_13.value,
                    "bad status",
                    [{"value": sub_enum.GenresValue.MEXA.value, "label": sub_enum.GenresLabel.MEXA.value}],
                    True,
                    12,
                    status.HTTP_422_UNPROCESSABLE_ENTITY
            ),
            (
                    "Bad title name",
                    "Test description",
                    None,
                    2020,
                    sub_enum.TypeLabel.TV.value,
                    sub_enum.SeasonLabel.SUMMER.value,
                    sub_enum.RestrictLabel.PG_13.value,
                    sub_enum.StatusLabel.ONGOING.value,
                    [sub_enum.GenresValue.MEXA.value],
                    True,
                    12,
                    status.HTTP_422_UNPROCESSABLE_ENTITY
            ),
            (
                    "Bad title name",
                    "Test description",
                    None,
                    2020,
                    sub_enum.TypeLabel.TV.value,
                    sub_enum.SeasonLabel.SUMMER.value,
                    sub_enum.RestrictLabel.PG_13.value,
                    sub_enum.StatusLabel.ONGOING.value,
                    [{"value": "bad value", "label": "bad label"}],
                    "True",
                    12,
                    status.HTTP_422_UNPROCESSABLE_ENTITY
            ),
            (
                    "Bad title name",
                    "Test description",
                    None,
                    2020,
                    sub_enum.TypeLabel.TV.value,
                    sub_enum.SeasonLabel.SUMMER.value,
                    sub_enum.RestrictLabel.PG_13.value,
                    sub_enum.StatusLabel.ONGOING.value,
                    [sub_enum.GenresValue.MEXA.value],
                    "True",
                    -12,
                    status.HTTP_400_BAD_REQUEST
            ),
        ]
    )
    async def test_add_new_title(
            self,
            ac: AsyncClient,
            title: str,
            description: str,
            alias: str,
            year: int,
            type_: str,
            season: str,
            age_restrict: str,
            status_: str,
            genres: list,
            is_origin: bool,
            total_episode: int,
            expected_status: int
    ):
        data = {
            "title": title,
            "description": description,
            "alias": alias,
            "year": year,
            "type": type_,
            "season": season,
            "age_restrict": age_restrict,
            "status": status_,
            "genres": genres,
            "is_origin": is_origin,
            "total_episode": total_episode,
        }
        response = await ac.post("/admin/anime/create-title", json=data)
        assert response.status_code == expected_status

    @pytest.mark.parametrize(
        "old_title_name, new_title_name, expected_status",
        [
            ("insufficient data", None, status.HTTP_400_BAD_REQUEST),
            ("non existent title", "new title name", status.HTTP_404_NOT_FOUND),
        ]
    )
    async def test_update_title(self, ac: AsyncClient, old_title_name: str, new_title_name: str, expected_status: int):
        data = {
            "old_title_name": old_title_name,
            "new_title_name": new_title_name,
        }
        response = await ac.patch("/admin/anime/update-title", json=data)
        assert response.status_code == expected_status

    async def test_delete_title(self, ac: AsyncClient):
        response = await ac.delete("/admin/anime/delete-title", params={"title": "non exist"})
        assert response.status_code == status.HTTP_404_NOT_FOUND

    @pytest.mark.parametrize(
        "content, content_type, expected_status",
        [
            (b"banner-file.mp4", "video/mp4", status.HTTP_422_UNPROCESSABLE_ENTITY),
            (b"banner-file.png", "image/png", status.HTTP_404_NOT_FOUND)
        ]
    )
    async def test_add_banner(self, ac: AsyncClient, content: bytes, content_type: str, expected_status: int):
        response = await ac.post(
            "/admin/anime/add-banner",
            params={"title": "update_title_name"},
            files={"file": ("test", content, content_type)}
        )
        assert response.status_code == expected_status

    @pytest.mark.parametrize(
        "content, content_type, expected_status",
        [
            (b"banner-file.mp4", "video/mp4", status.HTTP_422_UNPROCESSABLE_ENTITY),
            (b"banner-file.png", "image/png", status.HTTP_404_NOT_FOUND)
        ]
    )
    async def test_add_update(self, ac: AsyncClient, content: bytes, content_type: str, expected_status: int):
        response = await ac.patch(
            "/admin/anime/update-banner",
            params={"title": "non exist"},
            files={"file": ("test", content, content_type)}
        )
        assert response.status_code == expected_status

    async def test_delete_banner(self, ac: AsyncClient):
        response = await ac.delete(
            "/admin/anime/delete-banner",
            params={"title": "non exist"}
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND

    @pytest.mark.parametrize(
        "content, content_type, expected_status, is_exist",
        [
            (b"banner-file.mp4", "video/mp4", status.HTTP_422_UNPROCESSABLE_ENTITY, False),
            (b"banner-file.png", "image/png", status.HTTP_404_NOT_FOUND, False),
            (b"banner-file.png", "image/png", status.HTTP_400_BAD_REQUEST, True),
        ]
    )
    async def test_add_poster_title(
            self,
            ac: AsyncClient,
            content: bytes,
            content_type: str,
            expected_status: int,
            is_exist: bool,
            monkeypatch
    ):
        if is_exist:
            async def _read(*args, **kwargs):
                return True

            monkeypatch.setattr(crud, "read", _read)

        response = await ac.post(
            "/admin/anime/add-poster-title",
            params={"title": "non exist"},
            files={"file": ("test", content, content_type)}
        )
        assert response.status_code == expected_status

    @pytest.mark.parametrize("genres, content", [("безумие", "video/mp4"), ("non exist", "image/png")])
    async def test_add_poster_genres(self, ac: AsyncClient, genres: str, content: str):
        response = await ac.post(
            "/admin/anime/add-poster-genres",
            params={"genres": genres},
            files={"file": ("test", b"poster-file.png", content)}
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    @pytest.mark.parametrize(
        "title, episode_number, is_schedule_exist, episode_name, expected_status",
        [
            ("bad#title name", 1, True, "episode_name", status.HTTP_400_BAD_REQUEST),
            ("title name", -1, True, "episode_name", status.HTTP_400_BAD_REQUEST),
            ("title name", 1, "test", "episode_name", status.HTTP_422_UNPROCESSABLE_ENTITY),
            ("title name", 1, True, "episode_name", status.HTTP_404_NOT_FOUND),
        ]
    )
    async def test_add_episode(
            self,
            ac: AsyncClient,
            title: str,
            episode_number: int,
            is_schedule_exist: bool,
            episode_name: str,
            expected_status: int
    ):
        params = {
            "title": title,
            "episode_number": episode_number,
            "is_schedule_exist": is_schedule_exist,
            "episode_name": episode_name
        }
        response = await ac.post(
            "/admin/anime/add-episode",
            params=params,
            files={"file": ("test", b"poster-file.mp4", "video/mp4")}
        )
        assert response.status_code == expected_status

    @pytest.mark.parametrize(
        "title, episode_number, expected_status",
        [
            ("bad#title name", 1, status.HTTP_400_BAD_REQUEST),
            ("title name", -1, status.HTTP_400_BAD_REQUEST),
            ("title name", 1001, status.HTTP_400_BAD_REQUEST),
            ("title name", 1, status.HTTP_404_NOT_FOUND),
        ]
    )
    async def test_delete_episode(self, ac: AsyncClient, title: str, episode_number: int, expected_status: int):
        params = {"title": title, "episode_number": episode_number}
        response = await ac.delete("/admin/anime/delete-episode", params=params)
        assert response.status_code == expected_status

    @pytest.mark.parametrize(
        "title, episode_number, content_type, expected_status",
        [
            ("bad#title name", 1, "image/png", status.HTTP_400_BAD_REQUEST),
            ("title name", -1, "image/png", status.HTTP_400_BAD_REQUEST),
            ("title name", 1001, "image/png", status.HTTP_400_BAD_REQUEST),
            ("title name", 1, "image/png", status.HTTP_404_NOT_FOUND),
            ("title name", 1, "video/mp4", status.HTTP_422_UNPROCESSABLE_ENTITY),
        ]
    )
    async def test_add_preview_episode(
            self,
            ac: AsyncClient,
            title: str,
            episode_number: int,
            expected_status: int,
            content_type: str
    ):
        params = {"title": title, "episode_number": episode_number}
        response = await ac.post(
            "/admin/anime/add-preview-episode",
            params=params,
            files={"file": ("test", b"preview-file.png", content_type)}
        )
        assert response.status_code == expected_status

    @pytest.mark.parametrize(
        "title, episode_number, content_type, expected_status",
        [
            ("bad#title name", 1, "image/png", status.HTTP_400_BAD_REQUEST),
            ("title name", -1, "image/png", status.HTTP_400_BAD_REQUEST),
            ("title name", 1001, "image/png", status.HTTP_400_BAD_REQUEST),
            ("title name", 1, "image/png", status.HTTP_404_NOT_FOUND),
            ("title name", 1, "video/mp4", status.HTTP_422_UNPROCESSABLE_ENTITY),
        ]
    )
    async def test_update_preview_episode(
            self,
            ac: AsyncClient,
            title: str,
            episode_number: int,
            expected_status: int,
            content_type: str
    ):
        params = {"title": title, "episode_number": episode_number}
        response = await ac.patch(
            "/admin/anime/update-preview-episode",
            params=params,
            files={"file": ("test", b"preview-file-update.png", content_type)}
        )
        assert response.status_code == expected_status

    @pytest.mark.parametrize(
        "title, sequel_title, expected_status",
        [
            ("title @", "sequel title", status.HTTP_400_BAD_REQUEST),
            ("title", "sequel%title", status.HTTP_400_BAD_REQUEST),
            ("title", "sequel title", status.HTTP_400_BAD_REQUEST),
        ]
    )
    async def test_add_sequel_title(
            self,
            ac: AsyncClient,
            title: str,
            sequel_title: str,
            expected_status: int,
            monkeypatch
    ):
        async def read_(*args, **kwargs):
            return SimpleNamespace(is_origin=False, year=2020)

        data = {"title": title, "sequel_title": sequel_title}

        monkeypatch.setattr(crud, "read", read_)
        response = await ac.post("/admin/anime/add-sequel-title", json=data)
        assert response.status_code == expected_status

    async def test_delete_sequel_title(self, ac: AsyncClient):
        params = {"title": "title", "sequel_title": "sequel title"}
        response = await ac.delete("/admin/anime/delete-sequel-title", params=params)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    @pytest.mark.parametrize(
        "date_, expected_status",
        [
            ("20-04-10", status.HTTP_422_UNPROCESSABLE_ENTITY),
            ("2026-04-12", status.HTTP_400_BAD_REQUEST)
        ]
    )
    async def test_set_schedules(
            self,
            ac: AsyncClient,
            date_: str,
            expected_status: int,
            monkeypatch
    ):
        data = {
            "title": "title",
            "day_week": {
                "value": sub_enum.DayWeek.FRIDAY.value["value"],
                "label": sub_enum.DayWeek.FRIDAY.value["label"]
            },
            "item": [{
                "date": date_,
                "episode_number": 1,
                "episode_name": "episode 1"
            }],
            "is_extend": False
        }

        async def read_(*args, **kwargs):
            return True

        monkeypatch.setattr(crud, "read", read_)
        response = await ac.post("/admin/anime/set-schedules", json=data)
        assert response.status_code == expected_status

    @pytest.mark.parametrize(
        "update_field, old_value, expected_status",
        [
            ("day_week", None, status.HTTP_422_UNPROCESSABLE_ENTITY),
            ("episode_name", "episode 1", status.HTTP_400_BAD_REQUEST),
        ])
    async def test_update_schedules(
            self,
            ac: AsyncClient,
            update_field: str,
            old_value,
            expected_status: int
    ):
        data = {
            "title": "update_title_name",
            "update_field": update_field,
            "old_value": old_value,
        }
        response = await ac.patch("/admin/anime/update-schedules", json=data)
        assert response.status_code == expected_status

    async def test_delete_schedules(self, ac: AsyncClient):
        response = await ac.delete("/admin/anime/delete-schedules", params={"title": "title"})
        assert response.status_code == status.HTTP_404_NOT_FOUND

    async def test_delete_schedules_item(self, ac: AsyncClient):
        params = {"title": "title", "episode_number": 1}
        response = await ac.delete("/admin/anime/delete-schedules-item", params=params)
        assert response.status_code == status.HTTP_404_NOT_FOUND
