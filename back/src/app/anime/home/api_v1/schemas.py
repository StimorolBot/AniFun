from typing import List

from pydantic import AliasChoices, BaseModel, Field

from src.app.anime.enums.v1 import sub as sub_enum
from src.app.anime.schemas.api_v1 import schemas
from src.utils.valid import (ValidDescription, ValidEpisodes, ValidTitle,
                             ValidYear)


class ResponseBannerDTO(schemas.ResponseAnimeDTO):
    img_rs: schemas.BannerDTO
    description: ValidDescription
    genres_rs: List[schemas.GenresDTO]
    total_episode: int = Field(ge=0, le=500)


class ResponseGenresDTO(schemas.PosterDTO):
    genres_count: int = Field(ge=1, le=20)
    genres: sub_enum.Genres
    alias: str


class TitleDTO(BaseModel):
    episode_number: int = Field(ge=1, le=500)
    anime_data: schemas.ResponseAnimeDTO = Field(validation_alias=AliasChoices("anime_data", "anime_rs"))


class ResponseTitleDTO(schemas.PosterDTO):
    episode_data: TitleDTO = Field(validation_alias=AliasChoices("episode_data", "EpisodeTable"))
    genres: List[sub_enum.Genres]


class SchedulesDTO(BaseModel):
    title: ValidTitle
    episode_number: ValidEpisodes


class ResponseSchedulesDTO(schemas.PosterDTO):
    schedule_data: SchedulesDTO = Field(validation_alias=AliasChoices("schedule_data", "ScheduleTable"))
    year: ValidYear
    alias: str
    season: sub_enum.Season
    age_restrict: sub_enum.Restrict
    genres: List[sub_enum.Genres]
    type: sub_enum.Type


class FranchisesDTO(BaseModel):
    title: ValidTitle
    poster: str
    alias: str


class SearchTitleDTO(schemas.ResponseAnimeDTO):
    genres_rs: List[schemas.GenresDTO]
    img_rs: schemas.PosterDTO
    description: ValidDescription


class RandomTitleDTO(BaseModel):
    alias: str
