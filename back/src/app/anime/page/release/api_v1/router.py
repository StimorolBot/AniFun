import json

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import or_, select
from sqlalchemy.exc import ArgumentError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.app.anime.models.v1 import main as main_table
from src.app.anime.page.release.api_v1 import schemas
from src.database.session import get_async_session
from src.utils.logger import anime_log

release_router = APIRouter(prefix="/anime/release", tags=["release"])


@release_router.get("/", status_code=status.HTTP_200_OK, summary="Получить список релизов")
async def get_catalog(session: AsyncSession = Depends(get_async_session)) -> Page[schemas.ResponseReleaseDTO]:
    query = (
        select(main_table.AnimeTable)
        .join(main_table.AnimeTable.img_rs)
        .options(selectinload(main_table.AnimeTable.img_rs))
        .join(main_table.AnimeTable.genres_rs)
        .options(selectinload(main_table.AnimeTable.genres_rs))
        .select_from(main_table.ImgTable)
        .distinct()
        .order_by(main_table.AnimeTable.date_add.desc())
    )
    return await paginate(session, query)



@release_router.get(
    "/filter-title",
    status_code=status.HTTP_200_OK,
    summary="Получить отфильтрованный список релизов"
)
async def get_filter_title(
        data: str,
        session: AsyncSession = Depends(get_async_session)
) -> Page[schemas.ResponseReleaseDTO]:
    valid_data = schemas.FilterData.model_validate(json.loads(data))
    try:
        query = (
            select(main_table.AnimeTable)
            .filter(or_(
                main_table.AnimeTable.type.in_([i.value for i in valid_data.type])
                if valid_data.type
                else None,
                main_table.AnimeTable.age_restrict.in_([i.value for i in valid_data.age_restrict])
                if valid_data.age_restrict
                else None,
                main_table.AnimeTable.season.in_([i.value for i in valid_data.season])
                if valid_data.season
                else None,
                main_table.AnimeTable.status.in_([i.value for i in valid_data.status])
                if valid_data.status
                else None,
                main_table.AnimeTable.year.between(valid_data.year[0], valid_data.year[1])
                if valid_data.year
                else None,
                main_table.GenresAnimeTable.genres.in_([i.value for i in valid_data.genres])
                if valid_data.genres
                else None
            ))
            .join(main_table.AnimeTable.img_rs)
            .options(selectinload(main_table.AnimeTable.img_rs))
            .join(main_table.AnimeTable.genres_rs)
            .options(selectinload(main_table.AnimeTable.genres_rs))
            .select_from(main_table.ImgTable)
            .distinct()
            .order_by(main_table.AnimeTable.date_add.desc())
        )
        return await paginate(session, query)
    except ArgumentError as e:
        anime_log.warning("При попытке получить отфильтрованный список релизов произошла ошибка: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не удалось получить список релизов, пожалуйста, повторите попытку позже."
        ) from e
