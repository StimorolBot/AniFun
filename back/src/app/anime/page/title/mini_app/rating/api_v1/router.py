from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse, Response
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.anime.models.v1 import main as main_table
from src.app.anime.page.title.mini_app.rating.api_v1 import schemas
from src.app.anime.subquery.v_1 import subquery
from src.app.user.utils.utils import get_current_user
from src.database.session import get_async_session
from src.utils.crud import crud
from src.utils.logger import anime_log
from src.utils.valid import ValidText

rating_router = APIRouter(tags=["rating"], prefix="/anime/rating")


@rating_router.get("/", status_code=status.HTTP_200_OK, summary="Получить рейтинг")
async def get_rating(
        title: ValidText[5, 150],
        session: AsyncSession = Depends(get_async_session),
        current_user: dict = Depends(get_current_user)
):
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
    data = result.mappings().one_or_none()
    return (
        schemas.ResponseRatingDTO.model_validate(
            data,
            from_attributes=True
        )
    ) \
        if data \
        else Response(status_code=status.HTTP_204_NO_CONTENT)


@rating_router.post("/set-rating", summary="Установить рейтинг")
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
        await session.commit()
        anime_log.info("Добавление рейтинга %s -> %s -> %s", current_user["sub"], data.title, data.star)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content=f"Рейтинг создан {data.star}"
        )
    except IntegrityError as e:
        anime_log.warning("При попытке установить рейтинг возникла ошибка: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Рейтинг уже установлен"
        ) from e


@rating_router.delete("/delete-rating", summary="Удалить рейтинг")
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
    await session.commit()
    anime_log.info("Удаление рейтинга %s -> %s -> %s", current_user["sub"], data.title, data.star)
    return JSONResponse(
        status_code=status.HTTP_204_NO_CONTENT,
        content="Рейтинг удален"
    )


@rating_router.patch("/update-rating", summary="Обновить рейтинг")
async def update_rating(
        data: schemas.Rating,
        current_user: dict = Depends(get_current_user),
        session: AsyncSession = Depends(get_async_session),
):
    await crud.update(
        session=session,
        table=main_table.RatingTable,
        data={"star": data.star},
        uuid=current_user["sub"],
        title=data.title
    )
    await session.commit()
    anime_log.info("Обновление рейтинга %s -> %s -> %s", current_user["sub"], data.title, data.star)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=f"Обновление рейтинга: {data.star}"
    )
