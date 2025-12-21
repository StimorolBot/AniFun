from pydantic import AliasChoices, BaseModel, ConfigDict, Field

from src.app.anime.enums.v1 import sub as sub_enum
from src.utils.valid import ValidEpisodes, ValidTitle, ValidYear


class BannerDTO(BaseModel):
    banner: str


class PosterDTO(BaseModel):
    poster: str


class GenresDTO(BaseModel):
    label: sub_enum.GenresLabel
    value: sub_enum.GenresValue


class Schedule(BaseModel):
    episode_number: ValidEpisodes


class TypeDTO(BaseModel):
    label: sub_enum.TypeLabel
    value: sub_enum.TypeValue


class SeasonDTO(BaseModel):
    label: sub_enum.SeasonLabel
    value: sub_enum.SeasonValue


class AgeRestrictDTO(BaseModel):
    label: sub_enum.RestrictLabel
    value: sub_enum.RestrictValue


class StatusDTO(BaseModel):
    label: sub_enum.StatusLabel
    value: sub_enum.StatusValue


class DayWeekDTO(BaseModel):
    label: sub_enum.DayWeekLabel
    value: sub_enum.DayWeekValue


class ResponseAnimeDTO(BaseModel):
    title: ValidTitle
    year: ValidYear
    alias: str
    type: TypeDTO = Field(validation_alias=AliasChoices("type_rs", "type"))
    season: SeasonDTO = Field(validation_alias=AliasChoices("season_rs", "season"))
    age_restrict: AgeRestrictDTO = Field(validation_alias=AliasChoices("age_restrict_rs", "age_restrict"))
    status: StatusDTO = Field(validation_alias=AliasChoices("status_rs", "status"))

    model_config = ConfigDict(from_attributes=True)
