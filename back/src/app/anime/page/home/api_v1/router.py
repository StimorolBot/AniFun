from datetime import datetime, timedelta
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi_cache.decorator import cache
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from pydantic_core._pydantic_core import ValidationError
from sqlalchemy import distinct, func, select
from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from starlette.responses import JSONResponse

from src.app.anime.enums.v1.sub.limit_episode import LimitEpisode
from src.app.anime.models.v1 import main as main_table
from src.app.anime.models.v1.main.genres_anime import GenresTable
from src.app.anime.models.v1.sub.genres import GenresSubTable
from src.app.anime.page.home.api_v1 import schemas
from src.app.anime.schemas.api_v1.schemas import ValidText
from src.app.anime.subquery.v_1 import subquery
from src.database.session import get_async_session
from src.redis.name_space import RadisNameSpace
from src.utils.logger import anime_log

home_router = APIRouter(tags=["home"])


@cache(expire=180, namespace=RadisNameSpace.HOME_PAGE.value)
@home_router.get("/slides", status_code=status.HTTP_200_OK, summary="Получить слайды с аниме")
async def get_slide(session: AsyncSession = Depends(get_async_session)):
    sq = subquery.subquery_rating_all_users()
    query = (
        select(main_table.AnimeTable, sq)
        .join(sq, main_table.AnimeTable.title == sq.c.title, isouter=True)
        .options(selectinload(main_table.AnimeTable.type_rs))
        .join(main_table.AnimeTable.type_rs)
        .options(selectinload(main_table.AnimeTable.age_restrict_rs))
        .join(main_table.AnimeTable.age_restrict_rs)
        .options(selectinload(main_table.AnimeTable.status_rs))
        .join(main_table.AnimeTable.status_rs)
        .options(selectinload(main_table.AnimeTable.season_rs))
        .join(main_table.AnimeTable.season_rs)
        .options(selectinload(main_table.AnimeTable.genres_rs))
        .join(main_table.AnimeTable.genres_rs)
        .options(selectinload(main_table.AnimeTable.banner_rs))
        .join(main_table.AnimeTable.banner_rs)
    )
    result = await session.execute(query.distinct())
    items = result.mappings().all()
    try:
        return [schemas.ResponseBannerDTO.model_validate(item, from_attributes=True) for item in items]
    except ValidationError as e:
        anime_log.warning("При попытке получить слайд возникла ошибка: %s", e)
        return Response(status_code=status.HTTP_204_NO_CONTENT)


@cache(expire=180, namespace=RadisNameSpace.HOME_PAGE.value)
@home_router.get("/new-episode", status_code=status.HTTP_200_OK, summary="Получить новые эпизоды")
async def get_new_episode(limit: LimitEpisode, session: AsyncSession = Depends(get_async_session)):
    query = (
        select(
            main_table.EpisodeTable.number,
            main_table.EpisodeTable.uuid.label("uuid_episode"),
            main_table.AnimeTable
        )
        .select_from(main_table.AnimeTable)
        .options(selectinload(main_table.AnimeTable.type_rs))
        .join(main_table.AnimeTable.type_rs)
        .options(selectinload(main_table.AnimeTable.age_restrict_rs))
        .join(main_table.AnimeTable.age_restrict_rs)
        .options(selectinload(main_table.AnimeTable.status_rs))
        .join(main_table.AnimeTable.status_rs)
        .options(selectinload(main_table.AnimeTable.season_rs))
        .join(main_table.AnimeTable.season_rs)
        .options(selectinload(main_table.AnimeTable.genres_rs))
        .join(main_table.AnimeTable.genres_rs)
        .options(selectinload(main_table.AnimeTable.poster_rs))
        .join(main_table.AnimeTable.poster_rs, isouter=True)
        .join(
            main_table.EpisodeTable,
            main_table.EpisodeTable.title == main_table.AnimeTable.title
        )
        .order_by(main_table.EpisodeTable.date_add.desc())
        .limit(limit.value)
    )
    result = await session.execute(query)
    items = result.mappings().all()
    return [schemas.ResponseNewEpisodeDTO.model_validate(item, from_attributes=True) for item in items]


@cache(expire=180, namespace=RadisNameSpace.HOME_PAGE.value)
@home_router.get(
    "/schedules",
    status_code=status.HTTP_200_OK,
    summary="Получить расписание релизов"
)
async def get_release_schedule(
        schedule: Literal["today", "tomorrow"] = "today",
        session: AsyncSession = Depends(get_async_session)
):
    query = (
        select(
            main_table.AnimeTable,
            main_table.ScheduleTable.episode_number,
            main_table.ScheduleTable.title
        )
        .select_from(main_table.AnimeTable)
        .options(selectinload(main_table.AnimeTable.type_rs))
        .join(main_table.AnimeTable.type_rs)
        .options(selectinload(main_table.AnimeTable.age_restrict_rs))
        .join(main_table.AnimeTable.age_restrict_rs)
        .options(selectinload(main_table.AnimeTable.season_rs))
        .join(main_table.AnimeTable.season_rs)
        .options(selectinload(main_table.AnimeTable.genres_rs))
        .join(main_table.AnimeTable.genres_rs)
        .options(selectinload(main_table.AnimeTable.poster_rs))
        .join(main_table.AnimeTable.poster_rs)
        .join(main_table.ScheduleTable, main_table.AnimeTable.title == main_table.ScheduleTable.title)
        .where(
            main_table.ScheduleTable.date_release == datetime.now().date()
            if schedule == "today"
            else
            main_table.ScheduleTable.date_release == (datetime.now().date() + timedelta(hours=24))
        )
    )
    result = await session.execute(query)
    items = result.mappings().all()
    return [schemas.ResponseSchedulesDTO.model_validate(item, from_attributes=True) for item in items]


@cache(expire=180, namespace=RadisNameSpace.HOME_PAGE.value)
@home_router.get("/franchises", status_code=status.HTTP_200_OK, summary="Получить франшизы")
async def get_franchise(session: AsyncSession = Depends(get_async_session)):
    title_query = (
        select(
            main_table.SequelTable.uuid.label("sequel_uuid"),
            main_table.AnimeTable.title,
            main_table.AnimeTable.year,
            main_table.AnimeTable.total_episode,
            main_table.AnimeTable.uuid.label("title_uuid")
        )
        .select_from(main_table.SequelTable)
        .join(main_table.AnimeTable, main_table.SequelTable.title == main_table.AnimeTable.title)
    )

    sequel_query = (
        select(
            main_table.SequelTable.uuid.label("sequel_uuid"),
            main_table.AnimeTable.title,
            main_table.AnimeTable.year,
            main_table.AnimeTable.total_episode,
            main_table.AnimeTable.uuid.label("title_uuid")
        )
        .select_from(main_table.SequelTable)
        .join(main_table.AnimeTable, main_table.SequelTable.sequel_title == main_table.AnimeTable.title)
    )

    union_subquery = (title_query.union_all(sequel_query).subquery("union_subquery"))

    sequel_stats = (
        select(
            union_subquery.c.sequel_uuid.label("sequel_uuid"),
            func.min(union_subquery.c.year).label("start_year"),
            func.max(union_subquery.c.year).label("end_year"),
            func.count(distinct(union_subquery.c.title)).label("seasons_count"),
            func.sum(union_subquery.c.total_episode).label("total_episodes")
        )
        .group_by(union_subquery.c.sequel_uuid)
        .subquery("sequel_stats_subquery")
    )

    query = (
        select(
            main_table.SequelTable.uuid.label("sequel_uuid"),
            main_table.SequelTable.title,
            main_table.PosterTable.poster_uuid,
            main_table.AnimeTable.uuid.label("title_uuid"),
            sequel_stats.c.start_year,
            sequel_stats.c.end_year,
            sequel_stats.c.seasons_count,
            sequel_stats.c.total_episodes
        )
        .select_from(main_table.SequelTable)
        .join(main_table.AnimeTable, main_table.SequelTable.title == main_table.AnimeTable.title)
        .join(main_table.PosterTable, main_table.SequelTable.title == main_table.PosterTable.title)
        .join(sequel_stats, main_table.SequelTable.uuid == sequel_stats.c.sequel_uuid)
        .group_by(
            main_table.SequelTable.uuid,
            main_table.SequelTable.title,
            main_table.PosterTable.poster_uuid,
            main_table.AnimeTable.uuid,
            sequel_stats.c.start_year,
            sequel_stats.c.end_year,
            sequel_stats.c.seasons_count,
            sequel_stats.c.total_episodes
        )
        .order_by(func.random())
        .limit(3)
    )

    result = await session.execute(query)
    items = result.mappings().unique()
    return [schemas.FranchisesDTO.model_validate(item, from_attributes=True) for item in items]


@cache(expire=180, namespace=RadisNameSpace.HOME_PAGE.value)
@home_router.get("/genres", status_code=status.HTTP_200_OK, summary="Получить жанры")
async def get_genres(session: AsyncSession = Depends(get_async_session)):
    query = (
        select(
            GenresTable.label,
            GenresTable.value,
            GenresSubTable.uuid_poster.label("poster_uuid"),
            func.count(GenresTable.label).label("genres_count")
        )
        .select_from(GenresTable)
        .join(GenresSubTable, GenresTable.value == GenresSubTable.value)
        .group_by(GenresTable.label, GenresTable.value, GenresSubTable.uuid_poster)
        .order_by(func.random())
        .limit(6)
    )

    result = await session.execute(query)
    items = result.mappings().all()
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
        title: ValidText[5, 150],
        session: AsyncSession = Depends(get_async_session)
) -> Page[schemas.SearchTitleDTO]:
    query = (
        select(main_table.AnimeTable)
        .filter(main_table.AnimeTable.title.ilike(f"%{title}%"))
        .join(main_table.AnimeTable.poster_rs)
        .options(selectinload(main_table.AnimeTable.poster_rs))
        .distinct()
    )
    return await paginate(session, query)
