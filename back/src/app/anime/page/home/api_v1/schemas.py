import datetime
from decimal import Decimal

from pydantic import AliasChoices, BaseModel, Field

from src.app import validation
from src.app.anime.schemas.api_v1 import schemas


class BannerDTO(BaseModel):
    anime: schemas.ExtAnimeDTO = Field(
        validation_alias=AliasChoices("AnimeTable", "anime")
    )
    avg: Decimal | None = None
    total_count: validation.ValidNumber[1, 9999] | None = None


class EpisodeDTO(BaseModel):
    title: validation.ValidText[5, 100]
    title_uuid: validation.ValidUUID
    alias: validation.ValidAlias
    poster_uuid: validation.ValidUUID | None
    episode_number: validation.ValidNumber[1, 1000]
    episode_uuid: validation.ValidUUID


class SchedulesDTO(BaseModel):
    title: validation.ValidText[5, 150]
    uuid: validation.ValidUUID
    alias: validation.ValidAlias
    time_release: datetime.time
    date_release: datetime.date
    poster_uuid: validation.ValidUUID | None
    episode_number: validation.ValidNumber[1, 1000]


class FranchisesDTO(BaseModel):
    franchise_uuid: validation.ValidUUID
    franchise_name: validation.ValidText[5, 150]
    episode_count: validation.ValidNumber[1, 9999]
    season_count: validation.ValidNumber[1, 999]
    film_count: validation.ValidNumber[1, 999] | None = None


class GenresDTO(BaseModel):
    genres_count: validation.ValidNumber[1, 100]
    label: str
    value: str


class RandomTitleDTO(BaseModel):
    alias: validation.ValidAlias


class SearchTitleDTO(schemas.AnimeDTO):
    type: str
    season: str
    poster_uuid: validation.ValidUUID | None
