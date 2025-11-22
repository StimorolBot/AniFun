from datetime import datetime, timedelta
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_cache.decorator import cache
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from pydantic_core._pydantic_core import ValidationError
from sqlalchemy import asc, func, select
from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from starlette.responses import JSONResponse

from src.app.anime.enums.v1.sub.limit_episode import LimitEpisode
from src.app.anime.home.api_v1 import schemas
from src.app.anime.models.v1 import main as main_table
from src.app.anime.models.v1.main.genres_anime import GenresAnimeTable
from src.app.anime.models.v1.sub.genres import GenresTable
from src.app.anime.subquery.v_1.subquery import subquery_genres
from src.database.session import get_async_session
from src.utils.logger import anime_log
from src.utils.valid import ValidTitle

home_router = APIRouter(tags=["home"])


@cache(expire=120, namespace="home-page")
@home_router.get("/slides", status_code=status.HTTP_200_OK, summary="Получить слайды с аниме")
async def get_slide(session: AsyncSession = Depends(get_async_session)):
    query = (
        select(main_table.AnimeTable)
        .join(main_table.AnimeTable.img_rs)
        .options(selectinload(main_table.AnimeTable.img_rs))
        .join(main_table.AnimeTable.genres_rs)
        .options(selectinload(main_table.AnimeTable.genres_rs))
        .select_from(main_table.ImgTable)
        .filter(main_table.ImgTable.banner != "")
    )
    result = await session.execute(query.distinct())
    items = result.scalars().all()
    try:
        return [schemas.ResponseBannerDTO.model_validate(item, from_attributes=True) for item in items]
    except ValidationError as e:
        anime_log.warning("При попытке получить слайд возникла ошибка: %s", e)
        return JSONResponse(
            status_code=status.HTTP_204_NO_CONTENT,
            content="Слайдер пуст."
        )


@home_router.get("/new-episode", status_code=status.HTTP_200_OK, summary="Получить новые эпизоды")
async def get_new_episode(limit: LimitEpisode, session: AsyncSession = Depends(get_async_session)):
    genres_sq = subquery_genres()
    query = (
        select(main_table.EpisodeTable, main_table.ImgTable.poster, genres_sq)
        .join(main_table.EpisodeTable.anime_rs)
        .options(selectinload(main_table.EpisodeTable.anime_rs))
        .join(main_table.ImgTable, main_table.ImgTable.title == main_table.EpisodeTable.title)
        .join(genres_sq, main_table.AnimeTable.title == genres_sq.c.title)
        .order_by(asc(main_table.EpisodeTable.date_add))
        .limit(limit.value)
    )
    result = await session.execute(query)
    items = result.mappings().all()
    return [schemas.ResponseTitleDTO.model_validate(item, from_attributes=True) for item in items]


@cache(expire=120, namespace="home-page")
@home_router.get("/schedules", status_code=status.HTTP_200_OK, summary="Получить расписание релизов")
async def get_release_schedule(
        schedule: Literal["today", "tomorrow"] = "today",
        session: AsyncSession = Depends(get_async_session)
):
    subquery = subquery_genres()
    query = (
        select(
            main_table.ScheduleTable, main_table.ImgTable.poster, main_table.AnimeTable.year,
            main_table.AnimeTable.type, main_table.AnimeTable.season, main_table.AnimeTable.age_restrict,
            main_table.AnimeTable.alias, subquery
        )
        .select_from(main_table.ScheduleTable)
        .join(main_table.ImgTable, main_table.ImgTable.title == main_table.ScheduleTable.title)
        .join(main_table.AnimeTable, main_table.AnimeTable.title == main_table.ScheduleTable.title)
        .join(subquery, main_table.ScheduleTable.title == subquery.c.title)
        .where(
            main_table.ScheduleTable.date == datetime.now().date()
            if schedule == "today"
            else
            main_table.ScheduleTable.date == (datetime.now().date() + timedelta(hours=24))
        )
    )
    result = await session.execute(query)
    items = result.mappings().all()
    return [schemas.ResponseSchedulesDTO.model_validate(item, from_attributes=True) for item in items]


@cache(expire=120, namespace="home-page")
@home_router.get("/franchises", status_code=status.HTTP_200_OK, summary="Получить франшизы")
async def get_franchise(session: AsyncSession = Depends(get_async_session)):
    query = (
        select(
            main_table.RelationAnime.title,
            main_table.ImgTable.poster,
            main_table.AnimeTable.alias
        )
        .join(main_table.ImgTable, main_table.RelationAnime.title == main_table.ImgTable.title)
        .join(main_table.AnimeTable, main_table.RelationAnime.title == main_table.AnimeTable.title)
        .order_by(func.random())
        .limit(3)
    )

    result = await session.execute(query)
    items = result.mappings().unique()
    return [schemas.FranchisesDTO.model_validate(item, from_attributes=True) for item in items]


@cache(expire=60, namespace="home-page")
@home_router.get("/genres", status_code=status.HTTP_200_OK, summary="Получить жанры")
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


@home_router.get("/random-title", summary="Получить случайный тайтл")
async def get_random_title(session: AsyncSession = Depends(get_async_session)):
    try:
        query = select(main_table.AnimeTable.alias).limit(1).order_by(func.random())
        result = await session.execute(query)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=schemas.RandomTitleDTO(**result.mappings().one()).model_dump()
        )
    except NoResultFound as e:
        anime_log.warning("При попытке получить случайный тайтл возникла ошибка: %s", e)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Не удалось найти тайтл."
        )


@home_router.get("/search-title", status_code=status.HTTP_200_OK, summary="Поиск аниме по названию")
async def search_title(
        title: ValidTitle,
        session: AsyncSession = Depends(get_async_session)
) -> Page[schemas.SearchTitleDTO]:
    query = (
        select(main_table.AnimeTable)
        .filter(main_table.AnimeTable.title.ilike(f"%{title}%"))
        .join(main_table.AnimeTable.img_rs)
        .options(selectinload(main_table.AnimeTable.img_rs))
        .join(main_table.AnimeTable.genres_rs)
        .options(selectinload(main_table.AnimeTable.genres_rs))
        .select_from(main_table.ImgTable)
        .distinct()
    )

    return await paginate(session, query)
