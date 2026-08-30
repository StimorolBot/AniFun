from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.anime.models.v1 import main as main_table
from src.app.anime.page.title.mini_app.rating.api_v1 import schemas
from src.app.anime.page.title.mini_app.rating.api_v1.subqueries import \
    rating as rating_sq
from src.app.auth.dependencies import get_current_user
from src.app.user.schemas.api_v1.schemas import DecodeAccessToken
from src.database.session import get_async_session
from src.utils.crud import crud
from src.utils.logger import anime_log

rating_router = APIRouter(tags=["rating"], prefix="/anime/titles")


@rating_router.get("/{title_uuid}/rating", status_code=status.HTTP_200_OK, summary="Рейтинг тайтла")
async def rating(
        title_uuid: UUID,
        session: AsyncSession = Depends(get_async_session),
        current_user: DecodeAccessToken = Depends(get_current_user)
):
    rating_title = rating_sq.rating_title(title_uuid=title_uuid)
    my_rating = None

    if current_user:
        my_rating = rating_sq.my_rating(
            user_uuid=current_user.sub,
            title_uuid=title_uuid
        ).label("my_rating")

    stmt = (
        select(
            rating_title.c.total_count,
            rating_title.c.avg,
            my_rating
        )
        .select_from(rating_title)
    )

    result = await session.execute(stmt)
    rating_stmt = result.mappings().one_or_none()

    if not rating_stmt:
        return Response(
            status_code=status.HTTP_204_NO_CONTENT
        )

    distribution_sq = rating_sq.rating_distribution(title_uuid=title_uuid)

    result = await session.execute(
        select(
            distribution_sq.c.star,
            distribution_sq.c.count,
            distribution_sq.c.percentage,
        )
    )

    distribution = result.mappings().all()

    return schemas.RatingDTO(
        total_count=rating_stmt["total_count"],
        avg=round(Decimal(rating_stmt["avg"]), 1),
        my_rating=rating_stmt.get("my_rating"),
        rating_per=distribution,
    )


@rating_router.post(
    "/rating",
    status_code=status.HTTP_201_CREATED,
    summary="Установить рейтинг"
)
async def set_rating(
        data: schemas.SetRating,
        current_user: DecodeAccessToken = Depends(get_current_user),
        session: AsyncSession = Depends(get_async_session),
):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    await crud.create(
        session=session,
        table=main_table.RatingTable,
        data={"user_uuid": current_user.sub, "title_uuid": data.title_uuid, "star": data.star}
    )
    await session.commit()
    anime_log.info("Добавление рейтинга %s -> %s", current_user.sub, data.title_uuid)


@rating_router.delete("/{title_uuid}/rating", summary="Удалить рейтинг")
async def delete_rating(
        title_uuid: UUID,
        current_user: DecodeAccessToken = Depends(get_current_user),
        session: AsyncSession = Depends(get_async_session),
):
    await crud.delite(
        session=session,
        table=main_table.RatingTable,
        title_uuid=title_uuid,
        user_uuid=current_user.sub
    )
    await session.commit()
    anime_log.info("Удаление рейтинга %s -> %s", current_user.sub, title_uuid)


@rating_router.patch(
    "/rating",
    status_code=status.HTTP_200_OK,
    summary="Обновить рейтинг"
)
async def update_rating(
        data: schemas.UpdateRating,
        current_user: DecodeAccessToken = Depends(get_current_user),
        session: AsyncSession = Depends(get_async_session),
):
    await crud.update(
        session=session,
        table=main_table.RatingTable,
        data={"star": data.star},
        user_uuid=current_user.sub,
        title_uuid=data.title_uuid
    )
    await session.commit()
    anime_log.info("Обновление рейтинга %s -> %s", current_user.sub, data.title_uuid)
