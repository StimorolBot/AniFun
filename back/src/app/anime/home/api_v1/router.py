from fastapi import APIRouter, status, Depends
from fastapi_cache.decorator import cache

from sqlalchemy import select, desc, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.session import get_async_session

from src.app.anime.models.v1.main.anime import AnimeTable
from src.app.anime.models.v1.main.episode import EpisodeTable

from src.app.anime.models.v1.main.genres_anime import GenresAnimeTable
from src.app.anime.home.api_v1.schemas import ResponseTitleDTO, ResponseBannerDTO, ResponseGenresDTO

anime_router = APIRouter(tags=["home"])


@cache(expire=120, namespace="home-page")
@anime_router.get("/slides", status_code=status.HTTP_200_OK, summary="Получить слайды с аниме")
async def get_slide(session: AsyncSession = Depends(get_async_session)):
    query = select(AnimeTable).options(selectinload(AnimeTable.img_rs))
    result = await session.execute(query)
    items = result.scalars().all()
    return [ResponseBannerDTO.model_validate(item, from_attributes=True) for item in items]


@cache(expire=120, namespace="home-page")
@anime_router.get("/last-title", status_code=status.HTTP_200_OK, summary="Получить недавно обновленные тайтлы")
async def get_last_title(session: AsyncSession = Depends(get_async_session)):
    query = (
        select(AnimeTable)
        .options(selectinload(AnimeTable.episode_rs))
        .options(selectinload(AnimeTable.img_rs))
        .select_from(EpisodeTable)
        .order_by(desc(EpisodeTable.date_add))
        .limit(6)
    )
    result = await session.execute(query)
    items = result.all()
    return [ResponseTitleDTO.model_validate(item, from_attributes=True) for item in items]


@cache(expire=120, namespace="home-page")
@anime_router.get("/release-schedules", status_code=status.HTTP_200_OK, summary="Получить расписание релизов")
async def get_release_schedule():  # ! JSONResponse
    ...


@cache(expire=120, namespace="home-page")
@anime_router.get("/popular-franchises", status_code=status.HTTP_200_OK, summary="Получить популярные франшизы")
async def get_popular_franchise():  # ! JSONResponse
    ...


@cache(expire=60, namespace="home-page")
@anime_router.get("/genres", status_code=status.HTTP_200_OK, summary="Получить жанры случайные")
async def get_genres(session: AsyncSession = Depends(get_async_session)):
    genres_count_subquery = (
        select(
            GenresAnimeTable.genres,
            func.count(GenresAnimeTable.genres).label("genres_count")
        )
        .group_by(GenresAnimeTable.genres)
        .subquery("genres_count_subquery")
    )

    query = (
        select(
            GenresAnimeTable,
            genres_count_subquery
        )
        .options(selectinload(GenresAnimeTable.genres_rs))
        .join(GenresAnimeTable, genres_count_subquery.c.genres == GenresAnimeTable.genres)
        .group_by(GenresAnimeTable, genres_count_subquery)
        .order_by(func.random())
        .limit(6)
    )

    result = await session.execute(query)
    items = result.all()
    return [ResponseGenresDTO.model_validate(item, from_attributes=True) for item in items]


@cache(expire=120, namespace="home-page")
@anime_router.get("/announcements", status_code=status.HTTP_200_OK, summary="Получить анонсы")
async def get_announcements():  # ! JSONResponse
    ...
