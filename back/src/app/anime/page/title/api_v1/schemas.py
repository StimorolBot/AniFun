from datetime import date
from typing import List

from pydantic import AliasChoices, BaseModel, Field

from src.app.anime.enums.v1 import sub as sub_enum
from src.app.anime.schemas.api_v1 import schemas


class ExtResTitleDTO(schemas.ResponseAnimeDTO):
    genres: List[schemas.GenresDTO] = Field(
        validation_alias=AliasChoices("genres_rs", "genres")
    )
    description: schemas.ValidText[10, 1000]
    status: schemas.StatusDTO = Field(
        validation_alias=AliasChoices("status_rs", "status")
    )
    total_episode: schemas.ValidNumber[1, 1000]
    poster: schemas.PosterDTO | None = Field(
        validation_alias=AliasChoices("poster_rs", "poster"),
        default=None
    )
    release_day: schemas.DayWeekDTO | None = Field(
        validation_alias=AliasChoices("release_day_rs", "release_day"),
        default=None
    )
    is_origin: bool


class ResponseTitleDTO(BaseModel):
    anime: ExtResTitleDTO = Field(
        validation_alias=AliasChoices("AnimeTable", "anime")
    )


class ResponseEpisodeDTO(BaseModel):
    title_uuid: schemas.UUIDValid
    number: schemas.ValidNumber[1, 1000]
    name: schemas.ValidText[5, 50]
    preview_uuid: schemas.UUIDValid
    episode_uuid: schemas.UUIDValid


class ResponseRecTitleDTO(BaseModel):
    uuid: schemas.UUIDValid
    title: schemas.ValidText[5, 150]
    year: schemas.ValidNumber[1970, 2050]
    alias: schemas.ValidText[5, 150]
    type: sub_enum.TypeLabel
    season: sub_enum.SeasonLabel
    age_restrict: sub_enum.RestrictLabel
    poster_uuid: schemas.UUIDValid


class ResponseSequel(ResponseRecTitleDTO):
    total_episode: schemas.ValidNumber[1, 1000]


class ResponseScheduleDTO(BaseModel):
    episode_number: schemas.ValidNumber[1, 1000]
    episode_name: schemas.ValidText[5, 50]
    date_release: date
    episode_uuid: schemas.UUIDValid | None
