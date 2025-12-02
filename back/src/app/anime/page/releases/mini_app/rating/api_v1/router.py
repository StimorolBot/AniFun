from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from src.app.anime.models.v1 import main as main_table
from src.app.anime.page.releases.api_v1 import schemas
from src.app.anime.subquery.v_1 import subquery
from src.app.user.utils.utils import get_current_user
from src.database.session import get_async_session
from src.utils.crud import crud
from src.utils.logger import anime_log

rating_router = APIRouter(tags=["anime/releases/rating"], prefix="/anime/releases")


@rating_router.get("/release/rating", status_code=status.HTTP_200_OK, summary="Получить рейтинг")
async def get_rating(
        title: str,
        session: AsyncSession = Depends(get_async_session),
        current_user: dict = Depends(get_current_user)
) -> schemas.ResponseRatingDTO | None:
    rating_subquery = subquery.subquery_rating(current_user.get("sub"), title=title)
    query = (
        select(
            func.count(main_table.RatingTable.title).label("total_count"),
            func.avg(main_table.RatingTable.star).label("avg"),
            rating_subquery,
            main_table.RatingTable.title
        )
        .filter_by(title=title)
        .join(rating_subquery, rating_subquery.c.uuid == current_user.get("sub"), isouter=True)
        .group_by(main_table.RatingTable.title, rating_subquery)
    )

    result = await session.execute(query)
    return result.mappings().one_or_none()


@rating_router.post(
    "/release/set-rating",
    status_code=status.HTTP_201_CREATED,
    summary="Установить рейтинг"
)
async def set_rating(
        data: schemas.Rating,
        current_user: dict = Depends(get_current_user),
        session: AsyncSession = Depends(get_async_session),
):
    try:
        await crud.create(
            session=session,
            table=main_table.RatingTable,
            data={"uuid": current_user["sub"], "title": data.title, "star": data.star}
        )
        anime_log.info("Добавление рейтинга %s -> %s -> %s", current_user["sub"], data.title, data.star)
        await session.commit()

        query = subquery.subquery_rating_all_users(title=data.title)
        result = await session.execute(query)
        item = result.mappings().one()

        return schemas.ResponseRatingDTO.model_validate(
            {"my_rating": data.star, "avg": item.avg, "total_count": item.total_count}
        )
    except IntegrityError as e:
        anime_log.warning("При попытке установить рейтинг возникла ошибка: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Рейтинг уже установлен"
        ) from e


@rating_router.delete(
    "/release/delete-rating",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить рейтинг"
)
async def delete_rating(
        data: schemas.Rating,
        current_user: dict = Depends(get_current_user),
        session: AsyncSession = Depends(get_async_session),
):
    await crud.delite(
        session=session,
        table=main_table.RatingTable,
        title=data.title,
        uuid=current_user["sub"]
    )
    anime_log.info("Удаление рейтинга %s -> %s -> %s", current_user["sub"], data.title, data.star)
    await session.commit()

    query = subquery.subquery_rating_all_users(title=data.title)
    result = await session.execute(query)
    item = result.mappings().one_or_none()

    try:
        return {"my_rating": data.star, "avg": item.get("avg"), "total_count": item.total_count}
    except AttributeError as e:
        anime_log.warning(
            "При попытке пользователя %s удалить рейтинг у тайтла %s возникла ошибка: %s",
            current_user["sub"],
            data.title,
            e
        )
        return {"my_rating": data.star, "avg": 0, "total_count": 0}


@rating_router.patch("/release/update-rating", status_code=status.HTTP_200_OK, summary="Обновить рейтинг")
async def update_rating(
        data: schemas.Rating,
        current_user: dict = Depends(get_current_user),
        session: AsyncSession = Depends(get_async_session),
):
    await crud.update(
        session=session, table=main_table.RatingTable,
        data={"star": data.star},
        uuid=current_user["sub"], title=data.title
    )
    anime_log.info("Обновление рейтинга %s -> %s -> %s", current_user["sub"], data.title, data.star)
    await session.commit()

    query = subquery.subquery_rating_all_users(title=data.title)
    result = await session.execute(query)
    item = result.mappings().one()

    return schemas.ResponseRatingDTO.model_validate(
        {"my_rating": data.star, "avg": item.avg, "total_count": item.total_count}
    )
