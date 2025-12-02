from fastapi import APIRouter, Depends, status
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from src.app.anime.models.v1 import main as main_table
from src.app.anime.page.releases.api_v1 import schemas
from src.app.anime.page.releases.mini_app.comment.api_v1.subquery import \
    count_response_comment
from src.app.auth.models.v1.main.auth import AuthTable
from src.app.user.models.v1.avatar import AvatarTable
from src.app.user.utils.utils import get_current_user
from src.database.session import get_async_session
from src.utils.crud import crud

comment_router = APIRouter(tags=["anime/releases/comment"], prefix="/anime/releases")


@comment_router.get("/release/{title}/comment", status_code=status.HTTP_200_OK, summary="Получить комментарии")
async def get_comment(
        title: str,
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
            AvatarTable.avatar,
            count_response
        )
        .select_from(main_table.CommentTable)
        .join(count_response, main_table.CommentTable.uuid == count_response.c.response_uuid_comment, isouter=True)
        .join(AuthTable, main_table.CommentTable.author_uuid == AuthTable.uuid)
        .join(AvatarTable, main_table.CommentTable.author_uuid == AvatarTable.uuid)
        .where(main_table.CommentTable.title == title)
        .order_by(main_table.CommentTable.date_add.asc())
    )

    return await paginate(session, query)


@comment_router.post("/release/{alias}/comment", summary="Оставить комментарий")
async def set_comment(
        data: schemas.SetComment,
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

    # .options(
    #     selectinload(main_table.CommentTable.response_rs)
    #     .subqueryload(main_table.ResponseCommentTable.auth_rs),
    #     selectinload(AuthTable.avatar_rs)
    # )
    # .join(AuthTable.avatar_rs)
