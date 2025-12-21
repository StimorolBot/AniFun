from typing import List

from pydantic import AliasChoices, Field

from src.app.anime.schemas.api_v1.schemas import (DayWeekDTO, GenresDTO,
                                                  ResponseAnimeDTO)
from src.utils.valid import ValidDescription, ValidEpisodes


class ResponseTitleDTO(ResponseAnimeDTO):
    description: ValidDescription
    genres: List[GenresDTO] = Field(validation_alias=AliasChoices("genres_rs", "genres"))
    release_day: DayWeekDTO = Field(validation_alias=AliasChoices("release_day_rs", "release_day"), default=None)
    is_origin: bool
    total_episode: ValidEpisodes
    poster: str
