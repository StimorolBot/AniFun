import json

from fastapi import APIRouter, Depends, status
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.app.anime.models.v1 import main as main_table
from src.app.anime.page.home.api_v1.query import query_main_info
from src.app.anime.page.release.api_v1 import schemas
from src.app.anime.subquery.v_1 import subquery
from src.database.session import get_async_session

release_router = APIRouter(prefix="/anime/releases", tags=["release"])


@release_router.get("/", status_code=status.HTTP_200_OK, summary="Получить список релизов")
async def get_releases(session: AsyncSession = Depends(get_async_session)) -> Page[schemas.ResponseReleaseDTO]:
    sq = subquery.subquery_rating_all_users()
    query = (
        query_main_info(sq)
        .join(sq, main_table.AnimeTable.title == sq.c.title, isouter=True)
        .options(selectinload(main_table.AnimeTable.poster_rs))
        .join(main_table.AnimeTable.genres_rs)
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
    valid_data: schemas.FilterData = schemas.FilterData.model_validate(json.loads(data))
    filter_query_list = []

    if valid_data.type:
        filter_query_list.append(
            main_table.AnimeTable.type.in_([i.value for i in valid_data.type])
        )

    if valid_data.age_restrict:
        filter_query_list.append(
            main_table.AnimeTable.age_restrict.in_(
                [i.value for i in valid_data.age_restrict]
            )
        )

    if valid_data.season:
        filter_query_list.append(
            main_table.AnimeTable.season.in_([i.value for i in valid_data.season])
        )

    if valid_data.status:
        filter_query_list.append(
            main_table.AnimeTable.status.in_([i.value for i in valid_data.status])
        )

    if valid_data.year:
        filter_query_list.append(
            main_table.AnimeTable.year.between(
                valid_data.year[0],
                valid_data.year[1],
            )
        )

    if valid_data.title and len(valid_data.title) > 5:
        filter_query_list.append(
            main_table.AnimeTable.title.ilike(f"%{valid_data.title}%")
        )

    sq = subquery.subquery_rating_all_users()

    query = (
        query_main_info(sq)
        .join(sq, main_table.AnimeTable.title == sq.c.title, isouter=True)
        .options(selectinload(main_table.AnimeTable.poster_rs))
        .join(main_table.AnimeTable.genres_rs)
        .filter(*filter_query_list)
        .order_by(main_table.AnimeTable.date_add.desc())
    )

    return await paginate(session, query)
