from pydantic import AliasChoices, BaseModel, ConfigDict, Field

from src.app.anime.enums.v1 import sub as sub_enum
from src.utils.valid import UUIDValid, ValidNumber, ValidText


class BannerDTO(BaseModel):
    uuid_banner: UUIDValid


class PosterDTO(BaseModel):
    poster_uuid: UUIDValid


class GenresDTO(BaseModel):
    label: sub_enum.GenresLabel
    value: sub_enum.GenresValue


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
    uuid: UUIDValid
    title: ValidText[5, 150]
    year: ValidNumber[1970, 2050]
    alias: ValidText[5, 150]
    type: TypeDTO = Field(validation_alias=AliasChoices("type_rs", "type"))
    season: SeasonDTO = Field(validation_alias=AliasChoices("season_rs", "season"))
    age_restrict: AgeRestrictDTO = Field(
        validation_alias=AliasChoices("age_restrict_rs", "age_restrict")
    )

    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True
    )
