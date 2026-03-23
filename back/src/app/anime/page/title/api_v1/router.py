from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_cache.decorator import cache
from sqlalchemy import or_, select
from sqlalchemy.exc import MultipleResultsFound, NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.app.anime.models.v1 import main as main_table
from src.app.anime.page.title.api_v1 import schemas
from src.app.anime.page.title.api_v1.subquery import sequel_title_subquery
from src.app.anime.schemas.api_v1.schemas import ValidText
from src.app.anime.subquery.v_1 import subquery
from src.database.session import get_async_session
from src.redis.name_space import RedisNameSpace, Expire
from src.utils.logger import anime_log

title_router = APIRouter(tags=["title"], prefix="/anime")


@cache(expire=Expire.THREE.value, namespace=RedisNameSpace.ABOUT_TITLE.value)
@title_router.get(
    "/about/{alias}",
    status_code=status.HTTP_200_OK,
    summary="Получить данные о тайте",
    response_model=schemas.ResponseTitleDTO
)
async def get_title(
        alias: ValidText[5, 150],
        session: AsyncSession = Depends(get_async_session)
):
    try:
        query = (
            select(main_table.AnimeTable)
            .options(selectinload(main_table.AnimeTable.poster_rs))
            .join(main_table.AnimeTable.poster_rs)
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
            .options(selectinload(main_table.AnimeTable.release_day_rs))
            .join(main_table.AnimeTable.release_day_rs, isouter=True)
            .where(main_table.AnimeTable.alias == alias)
        )
        result = await session.execute(query.distinct())
        return result.mappings().one()
    except NoResultFound as e:
        anime_log.warning("Не удалось найти страницу %s", alias)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Не удалось найти страницу."
        ) from e
    except MultipleResultsFound as e:
        anime_log.warning("При попытке получения данных о тайтле возникла ошибка: %s.", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Внутрення ошибка сервера :(\nПожалуйста, повторите попытке позже."
        ) from e


@cache(expire=Expire.THREE, namespace=RedisNameSpace.RECOMMEND_TITLE.value)
@title_router.get(
    "/recommend-title",
    status_code=status.HTTP_200_OK,
    summary="Получить случайны список аниме с рейтингом выше 8.5"
)
async def get_recommend_title(session: AsyncSession = Depends(get_async_session)):
    avg_rating_title = subquery.subquery_avg_rating_title()
    query = (
        select(
            main_table.AnimeTable.uuid,
            main_table.AnimeTable.title,
            main_table.AnimeTable.alias,
            main_table.AnimeTable.year,
            main_table.AnimeTable.type,
            main_table.AnimeTable.season,
            main_table.AnimeTable.age_restrict,
            main_table.PosterTable.poster_uuid,
            avg_rating_title,
        )
        .select_from(main_table.AnimeTable)
        .where(avg_rating_title.c.avg >= 8.5)
        .join(main_table.PosterTable, main_table.PosterTable.title == main_table.AnimeTable.title)
        .join(avg_rating_title, main_table.AnimeTable.title == avg_rating_title.c.title)
        .group_by(
            main_table.AnimeTable.title,
            main_table.AnimeTable.alias,
            main_table.AnimeTable.year,
            main_table.AnimeTable.type,
            main_table.AnimeTable.season,
            main_table.AnimeTable.age_restrict,
            main_table.PosterTable.poster_uuid,
            main_table.AnimeTable.uuid,
            avg_rating_title
        )
        .limit(6)
    )

    result = await session.execute(query)
    items = result.mappings().all()
    return [schemas.ResponseRecTitleDTO.model_validate(i, from_attributes=True) for i in items]


@cache(expire=Expire.THREE.value, namespace=RedisNameSpace.EPISODE_TITLE.value)
@title_router.get("/episodes/{title}", status_code=status.HTTP_200_OK, summary="Получить эпизоды")
async def get_episodes(title: ValidText[5, 150], session: AsyncSession = Depends(get_async_session)):
    query = (
        select(
            main_table.AnimeTable.uuid.label("title_uuid"),
            main_table.EpisodeTable.uuid.label("episode_uuid"),
            main_table.EpisodeTable.number,
            main_table.EpisodeTable.name,
            main_table.EpisodePreviewTable.preview_uuid
        )
        .select_from(main_table.EpisodeTable)
        .join(
            main_table.EpisodePreviewTable,
            main_table.EpisodeTable.uuid == main_table.EpisodePreviewTable.episode_uuid
        )
        .join(
            main_table.AnimeTable,
            main_table.AnimeTable.title == main_table.EpisodeTable.title
        )
        .where(main_table.EpisodeTable.title == title)
        .order_by(main_table.EpisodeTable.number.desc())
    )
    result = await session.execute(query)
    items = result.mappings().all()
    return [schemas.ResponseEpisodeDTO.model_validate(item, from_attributes=True) for item in items]


@cache(expire=Expire.THREE.value, namespace=RedisNameSpace.SEQUEL.value)
@title_router.get(
    "/sequel/{title}",
    status_code=status.HTTP_200_OK,
    summary="Получить продолжения"
)
async def get_sequel(
        title: ValidText[5, 150],
        is_origin: bool,
        session: AsyncSession = Depends(get_async_session)
):
    title_subquery = sequel_title_subquery(title=title) \
        if is_origin \
        else sequel_title_subquery(sequel_title=title)

    query_continuation_title = (
        select(
            main_table.AnimeTable.uuid,
            main_table.AnimeTable.title,
            main_table.AnimeTable.year,
            main_table.AnimeTable.type,
            main_table.AnimeTable.season,
            main_table.AnimeTable.total_episode,
            main_table.PosterTable.poster_uuid,
            main_table.AnimeTable.alias,
            main_table.AnimeTable.date_add,
            main_table.AnimeTable.age_restrict,
        )
        .join(main_table.PosterTable, main_table.AnimeTable.title == main_table.PosterTable.title)
        .filter(
            or_(
                main_table.AnimeTable.title == title_subquery.c.sequel_title,
                main_table.AnimeTable.title == title_subquery.c.title,
            )
        )
    )
    result = await session.execute(
        query_continuation_title
        .distinct()
        .order_by(main_table.AnimeTable.date_add.desc())
    )
    items = result.mappings().all()
    return [schemas.ResponseSequel.model_validate(item, from_attributes=True) for item in items]


@cache(expire=Expire.THREE.value, namespace=RedisNameSpace.SCHEDULE.value)
@title_router.get(
    "/schedule/{title}",
    status_code=status.HTTP_200_OK,
    summary="Получить расписание выхода эпизодов"
)
async def get_schedule(title: ValidText[5, 150], session: AsyncSession = Depends(get_async_session)):
    query = select(
        main_table.ScheduleTable.episode_number,
        main_table.ScheduleTable.episode_name,
        main_table.ScheduleTable.date_release,
        main_table.ScheduleTable.episode_uuid
    ).filter_by(title=title)

    result = await session.execute(query.order_by(main_table.ScheduleTable.episode_number.desc()))
    items = result.mappings().all()
    return [schemas.ResponseScheduleDTO.model_validate(i, from_attributes=True) for i in items]
