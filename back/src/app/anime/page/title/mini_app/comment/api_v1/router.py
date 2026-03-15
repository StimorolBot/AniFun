from uuid import UUID

from fastapi import APIRouter, Depends, status
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from src.app.anime.models.v1 import main as main_table
from src.app.anime.page.title.mini_app.comment.api_v1 import schemas
from src.app.anime.page.title.mini_app.comment.api_v1.subquery import (
    count_response_comment, response_author_name_subquery)
from src.app.auth.models.v1.main.auth import AuthTable
from src.app.user.models.v1.avatar import AvatarTable
from src.app.user.utils.utils import get_current_user
from src.database.session import get_async_session
from src.utils.crud import crud
from src.utils.valid import ValidText

comment_router = APIRouter(tags=["comment"], prefix="/anime/comments")


@comment_router.get("/{title}", status_code=status.HTTP_200_OK, summary="Получить комментарии")
async def get_comment(
        title: ValidText[5, 150],
        session: AsyncSession = Depends(get_async_session)
) -> Page[schemas.ResponseCommentDTO]:
    count_response = count_response_comment()
    query = (
        select(
            main_table.CommentTable.uuid,
            main_table.CommentTable.content,
            main_table.CommentTable.date_add,
            main_table.CommentTable.author_uuid,
            AuthTable.user_name,
            AvatarTable.avatar_uuid,
            count_response
        )
        .select_from(main_table.CommentTable)
        .join(count_response, main_table.CommentTable.uuid == count_response.c.response_uuid_comment, isouter=True)
        .join(AuthTable, main_table.CommentTable.author_uuid == AuthTable.uuid)
        .join(AvatarTable, main_table.CommentTable.author_uuid == AvatarTable.uuid)
        .where(main_table.CommentTable.title == title)
        .order_by(main_table.CommentTable.date_add)
    )

    return await paginate(session, query)


@comment_router.get(
    "/response/{comment_uuid}",
    status_code=status.HTTP_200_OK,
    summary="Загрузить ответы на комментарий"
)
async def get_response_comment(
        comment_uuid: UUID,
        session: AsyncSession = Depends(get_async_session)
) -> Page[schemas.ResponseLoadCommentDTO]:
    author_name_subquery = response_author_name_subquery()

    query = (
        select(
            main_table.ResponseCommentTable.uuid,
            main_table.ResponseCommentTable.content,
            main_table.ResponseCommentTable.date_add,
            main_table.ResponseCommentTable.author_uuid,
            AvatarTable.avatar_uuid,
            AuthTable.user_name,
            author_name_subquery
        )
        .select_from(main_table.ResponseCommentTable)
        .join(AvatarTable, main_table.ResponseCommentTable.author_uuid == AvatarTable.uuid)
        .join(AuthTable, main_table.ResponseCommentTable.author_uuid == AuthTable.uuid)
        .join(author_name_subquery, main_table.ResponseCommentTable.author_uuid == author_name_subquery.c.uuid)
        .where(main_table.ResponseCommentTable.response_uuid_comment == comment_uuid)
        .order_by(main_table.ResponseCommentTable.date_add)
    )

    return await paginate(session, query)


@comment_router.post("/create", summary="Создать комментарий")
async def set_comment(
        data: schemas.CreateComment,
        session: AsyncSession = Depends(get_async_session),
        current_user: dict = Depends(get_current_user)
) -> JSONResponse:
    if not data.response_uuid_comment:
        await crud.create(
            session=session,
            table=main_table.CommentTable,
            data={"author_uuid": current_user["sub"], "title": data.title, "content": data.content}
        )

    elif data.response_uuid_comment:
        await crud.create(
            session=session,
            table=main_table.ResponseCommentTable,
            data={"author_uuid": current_user["sub"], **data.model_dump()}
        )
    await session.commit()
    return JSONResponse(status_code=status.HTTP_201_CREATED, content="Комментарий успешно создан")
