from sqlalchemy import Subquery, func, select

from src.app.anime.models.v1.main.comment import (CommentTable,
                                                  ResponseCommentTable)
from src.app.auth.models.v1.main.auth import AuthTable


def count_response_comment() -> Subquery:
    return (
        select(
            func.count(ResponseCommentTable.uuid).label("count_response"),
            ResponseCommentTable.response_uuid_comment
        )
        .filter_by(response_uuid_comment=CommentTable.uuid)
        .group_by(ResponseCommentTable.response_uuid_comment)
        .subquery("count_response_subquery")
    )


def response_author_name_subquery() -> Subquery:
    return (
        select(
            AuthTable.user_name.label("response_author_name"),
            AuthTable.uuid
        )
        .where(AuthTable.uuid == ResponseCommentTable.response_uuid_author)
    ).subquery("response_author_name_subquery")
