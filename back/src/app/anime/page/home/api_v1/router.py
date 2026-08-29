from datetime import datetime

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from fastapi_cache.decorator import cache
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.app import validation
from src.app.anime.enums.v1.sub.type import Type as AnimeType
from src.app.anime.models.v1 import main as main_table
from src.app.anime.models.v1 import sub as sub_table
from src.app.anime.page.home.api_v1 import schemas
from src.app.anime.page.home.api_v1.subqueries.franchise import \
    franchise_type_stats
from src.app.anime.page.title.mini_app.rating.api_v1.subqueries import rating
from src.database.session import get_async_session
from src.redis.name_space import Expire, RedisNameSpace

home_router = APIRouter(tags=["home"])


@cache(expire=Expire.TEN_MINUTES.value, namespace=RedisNameSpace.HOME_BANNER.value)
@home_router.get("/banner", status_code=status.HTTP_200_OK, summary="Получить баннер")
async def banner(session: AsyncSession = Depends(get_async_session)):
    rating_title = rating.rating_title()
    stmt = (
        select(rating_title, main_table.AnimeTable)
        .options(
            selectinload(main_table.AnimeTable.type_rs),
            selectinload(main_table.AnimeTable.age_restrict_rs),
            selectinload(main_table.AnimeTable.status_rs),
            selectinload(main_table.AnimeTable.season_rs),
            selectinload(main_table.AnimeTable.banner_rs),
            selectinload(main_table.AnimeTable.genres_rs).selectinload(main_table.GenresTable.genre_rs)
        )
        .join(main_table.BannerTable, main_table.BannerTable.title_uuid == main_table.AnimeTable.uuid)
        .join(rating_title, main_table.AnimeTable.uuid == rating_title.c.title_uuid, isouter=True)
        .where(main_table.BannerTable.is_active == True)
        .order_by(main_table.BannerTable.position)
    )
    result = await session.execute(stmt)
    items = result.mappings().all()

    return [schemas.BannerDTO.model_validate(item, from_attributes=True) for item in items]


@cache(expire=Expire.TEN_MINUTES.value, namespace=RedisNameSpace.HOME_EPISODE.value)
@home_router.get("/episodes", status_code=status.HTTP_200_OK, summary="Недавно вышедшие эпизоды")
async def episodes(session: AsyncSession = Depends(get_async_session)) -> Page[schemas.EpisodeDTO]:
    stmt = (
        select(
            main_table.AnimeTable.title.label("title"),
            main_table.AnimeTable.uuid.label("title_uuid"),
            main_table.AnimeTable.alias.label("alias"),
            main_table.EpisodeTable.number.label("episode_number"),
            main_table.EpisodeTable.uuid.label("episode_uuid"),
            main_table.PosterTable.poster_uuid.label("poster_uuid")
        )
        .join(
            main_table.EpisodeTable,
            main_table.EpisodeTable.title_uuid == main_table.AnimeTable.uuid,
        )
        .order_by(main_table.EpisodeTable.date_add.desc())
    )
    return await paginate(session, stmt)


@cache(expire=Expire.TEN_MINUTES.value, namespace=RedisNameSpace.HOME_SCHEDULE.value)
@home_router.get("/schedules", summary="Получить расписание релизов")
async def schedule(session: AsyncSession = Depends(get_async_session)) -> Page[schemas.SchedulesDTO]:
    stm = (
        select(
            main_table.AnimeTable.title.label("title"),
            main_table.AnimeTable.uuid.label("uuid"),
            main_table.AnimeTable.alias.label("alias"),
            main_table.ScheduleTable.episode_number.label("episode_number"),
            main_table.ScheduleTable.time_release.label("time_release"),
            main_table.ScheduleTable.date_release.label("date_release"),
            main_table.PosterTable.poster_uuid.label("poster_uuid"),
        )
        .select_from(main_table.AnimeTable)
        .join(main_table.ScheduleTable, main_table.AnimeTable.uuid == main_table.ScheduleTable.title_uuid)
        .join(main_table.PosterTable, main_table.AnimeTable.uuid == main_table.PosterTable.title_uuid, isouter=True)
        .where(main_table.ScheduleTable.date_release <= datetime.now().date())
        .order_by(main_table.ScheduleTable.date_release)
    )
    return await paginate(session, stm)


@cache(expire=Expire.TEN_MINUTES.value, namespace=RedisNameSpace.HOME_FRANCHISE.value)
@home_router.get("/franchises", status_code=status.HTTP_200_OK, summary="Получить франшизы")
async def franchise(session: AsyncSession = Depends(get_async_session)) -> Page[schemas.FranchisesDTO]:
    season_stats = franchise_type_stats(label="season_count", type_=AnimeType.TV)
    film_stats = franchise_type_stats(label="film_count", type_=AnimeType.FILM)

    stmt = (
        select(
            main_table.FranchiseTable.franchise_uuid.label("franchise_uuid"),
            main_table.FranchiseTable.franchise_name.label("franchise_name"),
            func.sum(main_table.AnimeTable.total_episode).label("episode_count"),
            season_stats.c.season_count,
            film_stats.c.film_count
        )
        .select_from(main_table.FranchiseTable)
        .join(main_table.AnimeTable, main_table.FranchiseTable.title_uuid == main_table.AnimeTable.uuid)
        .join(season_stats, main_table.FranchiseTable.franchise_uuid == season_stats.c.franchise_uuid)
        .join(film_stats, main_table.FranchiseTable.franchise_uuid == film_stats.c.franchise_uuid, isouter=True)
        .group_by(
            main_table.FranchiseTable.franchise_uuid,
            main_table.FranchiseTable.franchise_name,
            season_stats.c.season_count,
            film_stats.c.film_count,
        )
    )
    return await paginate(session, stmt)


@cache(expire=Expire.TEN_MINUTES.value, namespace=RedisNameSpace.HOME_GENRE.value)
@home_router.get("/genres", status_code=status.HTTP_200_OK, summary="Получить жанры")
async def genres(session: AsyncSession = Depends(get_async_session)) -> Page[schemas.GenresDTO]:
    stmt = (
        select(
            main_table.GenresTable.genre_id.label("genre_id"),
            sub_table.GenresSubTable.label.label("label"),
            sub_table.GenresSubTable.value.label("value"),
            func.count(main_table.GenresTable.genre_id).label("genres_count")
        )
        .select_from(main_table.GenresTable)
        .join(
            sub_table.GenresSubTable,
            main_table.GenresTable.genre_id == sub_table.GenresSubTable.id
        )
        .group_by(
            main_table.GenresTable.genre_id,
            sub_table.GenresSubTable.label,
            sub_table.GenresSubTable.value
        )
        .order_by(sub_table.GenresSubTable.value)
    )
    return await paginate(session, stmt)


@home_router.get("/titles/random", summary="Получить случайный тайтл")
async def random_title(session: AsyncSession = Depends(get_async_session)):
    stmt = select(main_table.AnimeTable.alias).limit(1).order_by(func.random())
    result = await session.execute(stmt)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=schemas.RandomTitleDTO(**result.mappings().one()).model_dump()
    )


@home_router.get("/titles/search", status_code=status.HTTP_200_OK, summary="Поиск аниме")
async def search_title(
        title: validation.ValidText[5, 150],
        session: AsyncSession = Depends(get_async_session)
) -> Page[schemas.SearchTitleDTO]:
    stmt = (
        select(
            main_table.AnimeTable.uuid.label("uuid"),
            main_table.AnimeTable.title.label("title"),
            main_table.AnimeTable.alias.label("alias"),
            main_table.AnimeTable.sub_title.label("sub_title"),
            main_table.AnimeTable.year.label("year"),
            main_table.PosterTable.poster_uuid.label("poster_uuid"),
            sub_table.TypeSubTable.label.label("type"),
            sub_table.SeasonSubTable.label.label("season")
        )
        .join(
            main_table.PosterTable,
            main_table.AnimeTable.uuid == main_table.PosterTable.title_uuid, isouter=True
        )
        .join(
            sub_table.TypeSubTable,
            main_table.AnimeTable.type == sub_table.TypeSubTable.value
        )
        .join(
            sub_table.SeasonSubTable,
            main_table.AnimeTable.season == sub_table.SeasonSubTable.value
        )
        .filter(main_table.AnimeTable.title.ilike(f"%{title}%"))
    )
    return await paginate(session, stmt)
