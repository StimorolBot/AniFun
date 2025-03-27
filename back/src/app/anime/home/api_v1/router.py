from fastapi import APIRouter, status
from fastapi_cache.decorator import cache

anime_router = APIRouter(tags=["home"])


@cache(expire=120, namespace="home-page")
@anime_router.get("/banner", status_code=status.HTTP_200_OK, summary="Получить банер с аниме")
async def get_banner():
    ...


@cache(expire=120, namespace="home-page")
@anime_router.get("/new-release", status_code=status.HTTP_200_OK, summary="Получить новые релизы")
async def get_new_release():
    ...


@cache(expire=120, namespace="home-page")
@anime_router.get("/release-schedule", status_code=status.HTTP_200_OK, summary="Получить расписание релизов")
async def get_release_schedule():
    ...


@cache(expire=120, namespace="home-page")
@anime_router.get("/popular-franchise", status_code=status.HTTP_200_OK, summary="Получить популярные франшизы")
async def get_popular_franchise():
    ...


@cache(expire=120, namespace="home-page")
@anime_router.get("/genres", status_code=status.HTTP_200_OK, summary="Получить жанры")
async def get_genres():
    ...


@cache(expire=120, namespace="home-page")
@anime_router.get("/announcements", status_code=status.HTTP_200_OK, summary="Получить анонсы")
async def get_announcements():
    ...
