from typing import List
from uuid import UUID

from pydantic import BaseModel, Field

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


class ResponseTitleDTO(schemas.PosterDTO):
    uuid_episode: UUID
    alias: str
    title: ValidTitle
    year: ValidYear
    type: sub_enum.TypeLabel
    season: sub_enum.SeasonLabel
    age_restrict: sub_enum.RestrictLabel
    episode_number: int = Field(ge=1, le=500)
    genres: List[schemas.GenresDTO]


class ResponseSchedulesDTO(schemas.PosterDTO):
    title: ValidTitle
    episode_number: ValidEpisodes
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
