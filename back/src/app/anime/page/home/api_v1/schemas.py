from typing import List, Optional

from pydantic import AliasChoices, BaseModel, Field

from src.app.anime.enums.v1 import sub as sub_enum
from src.app.anime.schemas.api_v1 import schemas
from src.utils.valid import UUIDValid


class ExtRespBannerDTO(schemas.ResponseAnimeDTO):
    banner: schemas.BannerDTO = Field(
        validation_alias=AliasChoices("banner_rs", "banner")
    )
    description: schemas.ValidText[10, 1000]
    genres: List[schemas.GenresDTO] = Field(
        validation_alias=AliasChoices("genres_rs", "genres")
    )
    status: schemas.StatusDTO = Field(
        validation_alias=AliasChoices("status_rs", "status")
    )
    total_episode: schemas.ValidNumber[1, 1000]


class ResponseBannerDTO(BaseModel):
    anime: ExtRespBannerDTO = Field(
        validation_alias=AliasChoices("AnimeTable", "anime")
    )
    avg: float | None = None
    total_count: schemas.ValidNumber[1, 9999] | None = None


class ExtRespNewEpisodeDTO(schemas.ResponseAnimeDTO):
    poster: schemas.PosterDTO | None = Field(
        validation_alias=AliasChoices("poster_rs", "poster"),
        default=None
    )
    genres: List[schemas.GenresDTO] = Field(
        validation_alias=AliasChoices("genres_rs", "genres")
    )
    status: schemas.StatusDTO = Field(
        validation_alias=AliasChoices("status_rs", "status")
    )


class ResponseNewEpisodeDTO(BaseModel):
    anime: ExtRespNewEpisodeDTO = Field(
        validation_alias=AliasChoices("AnimeTable", "anime")
    )
    number: schemas.ValidNumber[1, 1000]
    uuid_episode: UUIDValid


class ExtRespScheduleDTO(schemas.ResponseAnimeDTO):
    genres: List[schemas.GenresDTO] = Field(
        validation_alias=AliasChoices("genres_rs", "genres")
    )
    poster: Optional[schemas.PosterDTO] = Field(
        validation_alias=AliasChoices("poster_rs", "poster"),
    )


class ResponseSchedulesDTO(BaseModel):
    anime: ExtRespScheduleDTO = Field(
        validation_alias=AliasChoices("AnimeTable", "anime")
    )
    episode_number: schemas.ValidNumber[1, 1000]


class FranchisesDTO(BaseModel):
    title_uuid: UUIDValid
    sequel_uuid: UUIDValid
    poster_uuid: UUIDValid | None = None
    title: schemas.ValidText[5, 150]
    start_year: schemas.ValidNumber[1970, 2050]
    end_year: schemas.ValidNumber[1970, 2050]
    seasons_count: schemas.ValidNumber[1, 999]
    total_episodes: schemas.ValidNumber[1, 9999]


class ResponseGenresDTO(BaseModel):
    genres_count: schemas.ValidNumber[1, 999]
    label: sub_enum.GenresLabel
    value: sub_enum.GenresValue
    poster_uuid: schemas.UUIDValid


class RandomTitleDTO(BaseModel):
    alias: schemas.ValidText[5, 150]


class SearchTitleDTO(BaseModel):
    uuid: UUIDValid
    alias: schemas.ValidText[5, 150]
    title: schemas.ValidText[5, 150]
    year: schemas.ValidNumber[1970, 2050]
    type: schemas.TypeDTO = Field(validation_alias=AliasChoices("type_rs", "type"))
    poster: schemas.PosterDTO = Field(
        validation_alias=AliasChoices("poster_rs", "poster")
    )
