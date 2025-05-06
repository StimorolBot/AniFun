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

from src.app.anime.models.v1 import main as main_table
from src.app.anime.models.v1.sub.genres import GenresTable

from src.app.anime.home.api_v1 import schemas
from src.app.anime.models.v1.main.genres_anime import GenresAnimeTable

from src.app.anime.home.api_v1.subquery import subquery_genres

anime_router = APIRouter(tags=["home"])


@cache(expire=120, namespace="home-page")
@anime_router.get("/slides", status_code=status.HTTP_200_OK, summary="Получить слайды с аниме")
async def get_slide(session: AsyncSession = Depends(get_async_session)):
    query = (
        select(main_table.AnimeTable)
        .join(main_table.AnimeTable.img_rs)
        .options(selectinload(main_table.AnimeTable.img_rs))
        .join(main_table.AnimeTable.genres_rs)
        .options(selectinload(main_table.AnimeTable.genres_rs))
        .select_from(main_table.ImgTable)
        .filter(main_table.ImgTable.banner != None)
    )
    result = await session.execute(query.distinct())
    items = result.scalars().all()
    try:
        return [schemas.ResponseBannerDTO.model_validate(item, from_attributes=True) for item in items]
    except ValidationError as e:
        sql_log.warning("В таблице %s не заполнено поле: %s", main_table.AnimeTable.__tablename__, e)


@cache(expire=120, namespace="home-page")
@anime_router.get("/last-title", status_code=status.HTTP_200_OK, summary="Получить недавно обновленные тайтлы")
async def get_last_title(session: AsyncSession = Depends(get_async_session)):
    subquery = subquery_genres()
    query = (
        select(main_table.EpisodeTable, main_table.ImgTable.poster, subquery)
        .join(main_table.EpisodeTable.anime_rs)
        .options(selectinload(main_table.EpisodeTable.anime_rs))
        .join(main_table.ImgTable, main_table.ImgTable.title == main_table.EpisodeTable.title)
        # отдавать максимум 2 жанра
        .join(subquery, subquery.c.title == main_table.EpisodeTable.title)
        .order_by(asc(main_table.EpisodeTable.date_add))
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
            main_table.ScheduleTable, main_table.ImgTable.poster, main_table.AnimeTable.year,
            main_table.AnimeTable.season, main_table.AnimeTable.age_restrict, main_table.AnimeTable.alias, subquery
        )
        .select_from(main_table.ScheduleTable)
        .join(main_table.ImgTable, main_table.ImgTable.title == main_table.ScheduleTable.title)
        .join(main_table.AnimeTable, main_table.AnimeTable.title == main_table.ScheduleTable.title)
        .join(subquery, subquery.c.title == main_table.ScheduleTable.title)
        .where(
            main_table.ScheduleTable.date == datetime_date.today().strftime("%d-%m-%Y")
            if schedule == "today"
            else
            main_table.ScheduleTable.date == (datetime_date.today() + timedelta(hours=24)).strftime("%d-%m-%Y")
        )
    )
    result = await session.execute(query)
    items = result.mappings().all()
    return [schemas.ResponseSchedulesDTO.model_validate(item, from_attributes=True) for item in items]


@cache(expire=120, namespace="home-page")
@anime_router.get("/franchises", status_code=status.HTTP_200_OK, summary="Получить франшизы")
async def get_franchise(session: AsyncSession = Depends(get_async_session)):
    query = (
        select(
            main_table.RelationAnime, main_table.ImgTable.poster,
            main_table.AnimeTable.year, main_table.AnimeTable.alias,
            main_table.AnimeTable.type, main_table.AnimeTable.season,
            main_table.AnimeTable.age_restrict, main_table.AnimeTable.title
        )
        .join(main_table.ImgTable, main_table.RelationAnime.title == main_table.ImgTable.title)
        .join(main_table.AnimeTable, main_table.RelationAnime.title == main_table.AnimeTable.title)
        .limit(3)
        .order_by(func.random())
    )
    result = await session.execute(query)
    items = result.mappings().all()

    return [schemas.FranchisesDTO.model_validate(item, from_attributes=True) for item in items]


@cache(expire=60, namespace="home-page")
@anime_router.get("/genres", status_code=status.HTTP_200_OK, summary="Получить жанры")
async def get_genres(session: AsyncSession = Depends(get_async_session)):
    query = (
        select(
            GenresAnimeTable.genres,
            GenresTable.poster,
            GenresTable.alias,
            func.count(GenresAnimeTable.genres).label("genres_count")
        )
        .join(GenresAnimeTable, GenresTable.genres == GenresAnimeTable.genres)
        .group_by(GenresAnimeTable.genres, GenresTable.poster, GenresTable.alias)
        .order_by(func.random())
        .limit(6)
    )

    result = await session.execute(query)
    items = result.unique().all()
    return [schemas.ResponseGenresDTO.model_validate(item, from_attributes=True) for item in items]


@cache(expire=120, namespace="home-page")
@anime_router.get("/announcements", status_code=status.HTTP_200_OK, summary="Получить анонсы")
async def get_announcements(session: AsyncSession = Depends(get_async_session)):
    ...
