from uuid import UUID

from pydantic import BaseModel

from src.app.anime.page.title.mini_app.reaction_comment.api_v1.enums import \
    ReactionType
from src.utils.valid import ValidText


class Reaction(BaseModel):
    uuid: UUID
    reaction_type: ReactionType
    title: ValidText[5, 150]
