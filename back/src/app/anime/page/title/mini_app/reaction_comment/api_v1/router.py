from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse, Response
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.anime.models.v1 import main as main_table
from src.app.anime.page.title.mini_app.reaction_comment.api_v1 import schemas
from src.app.user.utils.utils import get_current_user
from src.database.session import get_async_session
from src.utils.crud import crud
from src.utils.logger import anime_log

reaction_comment_router = APIRouter(tags=["reaction-comment"], prefix="/anime/comments/reaction")


@reaction_comment_router.post("/set-reaction", summary="Установить реакцию")
async def set_rating(
        data: schemas.Reaction,
        current_user: dict = Depends(get_current_user),
        session: AsyncSession = Depends(get_async_session),
):
    try:
        await crud.create(
            session=session,
            table=main_table.ReactionCommentTable,
            data={
                "author_uuid": current_user["sub"],
                "uuid": data.uuid.hex,
                "reaction_type": data.reaction_type.value,
                "title": data.title
            }
        )

        await session.commit()
        anime_log.info(
            "Добавление реакции %s -> %s -> %s",
            current_user["sub"], data.uuid.hex, data.reaction_type.value
        )
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content=data.reaction_type.value
        )
    except IntegrityError as e:
        anime_log.warning("При попытке установить реакцию на комментарий возникла ошибка: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Реакция уже установлена"
        ) from e


@reaction_comment_router.delete("/delete-reaction", summary="Удалить реакцию")
async def delete_rating(
        data: schemas.Reaction,
        current_user: dict = Depends(get_current_user),
        session: AsyncSession = Depends(get_async_session),
):
    await crud.delite(
        session=session,
        table=main_table.ReactionCommentTable,
        title=data.title,
        author_uuid=current_user["sub"],
        uuid=data.uuid
    )
    await session.commit()
    anime_log.info("Удаление реакции %s -> %s", current_user["sub"], data.title)

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@reaction_comment_router.patch("/update-reaction", summary="Обновить реакцию")
async def update_reaction(
        data: schemas.Reaction,
        current_user: dict = Depends(get_current_user),
        session: AsyncSession = Depends(get_async_session),
):
    await crud.update(
        session=session,
        table=main_table.ReactionCommentTable,
        data={"reaction_type": data.reaction_type.value},
        author_uuid=current_user["sub"],
        title=data.title,
        uuid=data.uuid
    )
    await session.commit()
    anime_log.info("Обновление реакции %s -> %s -> %s", current_user["sub"], data.title, data.reaction_type.value)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=data.reaction_type.value
    )
