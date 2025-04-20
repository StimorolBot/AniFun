from typing import Literal
from datetime import date as datetime_date, timedelta
from pydantic_core._pydantic_core import ValidationError

from fastapi import APIRouter, status, Depends, HTTPException
from fastapi_cache.decorator import cache

from sqlalchemy import select, asc, func
from sqlalchemy.orm import selectinload

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.utils.logger import sql_log, anime_log
from src.database.session import get_async_session

from src.app.anime.models.v1.main.img import ImgTable
from src.app.anime.models.v1.main.anime import AnimeTable
from src.app.anime.models.v1.main.episode import EpisodeTable
from src.app.anime.models.v1.main.schedule import ScheduleTable

from src.app.anime.home.api_v1 import schemas
from src.app.anime.models.v1.main.genres_anime import GenresAnimeTable

from src.app.anime.home.api_v1.subquery import subquery_genres

anime_router = APIRouter(tags=["home"])


@cache(expire=120, namespace="home-page")
@anime_router.get("/slides", status_code=status.HTTP_200_OK, summary="Получить слайды с аниме")
async def get_slide(session: AsyncSession = Depends(get_async_session)):
    query = (
        select(AnimeTable)
        .join(AnimeTable.img_rs)
        .options(selectinload(AnimeTable.img_rs))
        .join(AnimeTable.genres_rs)
        .options(selectinload(AnimeTable.genres_rs))
        .select_from(ImgTable)
        .filter(ImgTable.banner != None)
    )
    result = await session.execute(query.distinct())
    items = result.scalars().all()
    try:
        return [schemas.ResponseBannerDTO.model_validate(item, from_attributes=True) for item in items]
    except ValidationError as e:
        sql_log.warning("В таблице %s не заполнено поле: %s", AnimeTable.__tablename__, e)


@cache(expire=120, namespace="home-page")
@anime_router.get("/last-title", status_code=status.HTTP_200_OK, summary="Получить недавно обновленные тайтлы")
async def get_last_title(session: AsyncSession = Depends(get_async_session)):
    subquery = subquery_genres()
    query = (
        select(EpisodeTable, ImgTable.poster, subquery)
        .join(EpisodeTable.anime_rs)
        .options(selectinload(EpisodeTable.anime_rs))
        .join(ImgTable, ImgTable.title == EpisodeTable.title)
        # отдавать максимум 2 жанра
        .join(subquery, subquery.c.title == EpisodeTable.title)
        .order_by(asc(EpisodeTable.date_add))
        .limit(6)
    )
    try:
        result = await session.execute(query)
        items = result.mappings().all()
        return [schemas.ResponseTitleDTO.model_validate(item, from_attributes=True) for item in items]
    except IntegrityError as e:
        anime_log.warning("Дублирование эпизодов", e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Серия уже была добавлена")


@cache(expire=120, namespace="home-page")
@anime_router.get("/schedules", status_code=status.HTTP_200_OK, summary="Получить расписание релизов")
async def get_release_schedule(
        schedule: Literal["today", "tomorrow"] = "today",
        session: AsyncSession = Depends(get_async_session)
):
    subquery = subquery_genres()
    query = (
        select(
            ScheduleTable, ImgTable.poster, AnimeTable.year,
            AnimeTable.season, AnimeTable.age_restrict, subquery
        )
        .select_from(ScheduleTable)
        .join(ImgTable, ImgTable.title == ScheduleTable.title)
        .join(AnimeTable, AnimeTable.title == ScheduleTable.title)
        .join(subquery, subquery.c.title == ScheduleTable.title)
        .where(
            ScheduleTable.date == datetime_date.today().strftime("%d-%m-%Y")
            if schedule == "today"
            else
            ScheduleTable.date == (datetime_date.today() + timedelta(hours=24)).strftime("%d-%m-%Y")
        )
    )
    result = await session.execute(query)
    items = result.mappings().all()
    return [schemas.ResponseSchedulesDTO.model_validate(item, from_attributes=True) for item in items]


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
    return [schemas.ResponseGenresDTO.model_validate(item, from_attributes=True) for item in items]


@cache(expire=120, namespace="home-page")
@anime_router.get("/announcements", status_code=status.HTTP_200_OK, summary="Получить анонсы")
async def get_announcements():  # ! JSONResponse
    ...
