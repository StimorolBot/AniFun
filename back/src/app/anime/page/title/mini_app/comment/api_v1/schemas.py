from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from src.app.auth.base.api_v1.schemas import ValidName
from src.utils.valid import UUIDValid, ValidText


class Comment(BaseModel):
    uuid: UUIDValid
    content: ValidText[3, 500]
    date_add: datetime
    author_uuid: UUIDValid | None = None
    avatar_uuid: UUIDValid
    user_name: ValidName


class CreateComment(BaseModel):
    title: ValidText[5, 150]
    content: ValidText[3, 500]
    response_uuid_comment: UUID | None = None
    response_uuid_author: UUID | None = None


class ResponseCommentDTO(Comment):
    count_response: int | None = None


class ResponseLoadCommentDTO(Comment):
    response_author_name: ValidName
