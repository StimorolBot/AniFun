from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from src.utils.valid import ValidEpisodes, ValidTitle


class Rating(BaseModel):
    #  ge, le больше/меньше или равно
    star: int = Field(ge=1, le=10)
    title: ValidTitle


class ResponseVideosDTO(BaseModel):
    uuid: UUID
    date_add: datetime
    episode_number: ValidEpisodes
    episode_name: ValidTitle | None = None
    preview: str


class ResponseRatingDTO(BaseModel):
    total_count: int = Field(ge=0, le=9999)
    avg: int = Field(ge=0, le=9999)
    my_rating: int = Field(ge=0, le=10, default=None)
