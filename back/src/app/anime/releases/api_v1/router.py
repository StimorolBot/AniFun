from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.responses import StreamingResponse
from fastapi_cache.decorator import cache

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.utils.logger import anime_log
from src.database.session import get_async_session

from src.app.admin.file_server import file_server
from src.app.anime.models.v1 import main as main_table
from src.app.anime.releases.api_v1 import schemas
from src.app.anime.home.api_v1.subquery import subquery_genres

releases_router = APIRouter(tags=["anime/releases"], prefix="/anime/releases")


@cache(expire=120, namespace="releases-page")
@releases_router.get("/release/{alias}/episodes", status_code=status.HTTP_200_OK, summary="Получить данные о тайте")
async def get_title(alias: str, session: AsyncSession = Depends(get_async_session)):
    sub_genres = subquery_genres()

    last_num_episode_subquery = (
        select(
            func.max(main_table.ScheduleTable.episode_number).label("last_episode"),
            main_table.ScheduleTable.title
        )
        .filter_by(uuid_episode=main_table.EpisodeTable.uuid)
        .group_by(main_table.ScheduleTable.title)
        .subquery("last_episode_subquery")
    )
    query = (
        select(
            main_table.AnimeTable,
            main_table.ImgTable.poster,
            main_table.ScheduleTable.day_week,
            sub_genres,
            last_num_episode_subquery,
        )
        .select_from(main_table.AnimeTable)
        .filter_by(alias=alias)
        .join(main_table.ImgTable, main_table.ImgTable.title == main_table.AnimeTable.title, isouter=True)
        .join(sub_genres, sub_genres.c.title == main_table.AnimeTable.title, isouter=True)
        .join(last_num_episode_subquery, last_num_episode_subquery.c.title == main_table.AnimeTable.title, isouter=True)
        .join(main_table.ScheduleTable, main_table.ScheduleTable.title == main_table.AnimeTable.title, isouter=True)
    )

    result = await session.execute(query)
    items = result.mappings().all()
    return [schemas.ResponseTitleDTO.model_validate(item, from_attributes=True) for item in items]


@cache(expire=120, namespace="releases-page")
@releases_router.get(
    "/release/{title}/episodes/videos", status_code=status.HTTP_200_OK,
    summary="Получить список эпизодов для тайтла"
)
async def get_videos(title: str, session: AsyncSession = Depends(get_async_session)):
    query = (
        select(
            main_table.ScheduleTable,
            main_table.EpisodeTable.preview
        )
        .select_from(main_table.ScheduleTable)
        .filter_by(
            title=title,
            uuid_episode=main_table.EpisodeTable.uuid
        )
        .join(main_table.EpisodeTable, main_table.EpisodeTable.title == main_table.ScheduleTable.title)
    )
    result = await session.execute(query.distinct())
    items = result.mappings().all()
    return [schemas.ResponseVideosDTO.model_validate(item, from_attributes=True) for item in items]


@releases_router.get("/release/{title}/rating", status_code=status.HTTP_200_OK, summary="Получить рейтинг")
async def get_rating(title: str, session: AsyncSession = Depends(get_async_session)):
    query = (
        select(
            func.count(main_table.RatingTable.title).label("total_count"),
            func.avg(main_table.RatingTable.star).label("avg"),
            main_table.RatingTable.title
        )
        .filter_by(title=title)
        .group_by(main_table.RatingTable.title)
    )

    result = await session.execute(query)
    items = result.mappings().all()
    return [schemas.ResponseRatingDTO.model_validate(item, from_attributes=True) for item in items]


@releases_router.get("/video/episode/{uuid}")
async def get_video_episode(uuid: str):
    return StreamingResponse(
        file_server.read(path=f"public/.videos/{uuid}.mp4"),
        media_type="video/mp4"
    )
