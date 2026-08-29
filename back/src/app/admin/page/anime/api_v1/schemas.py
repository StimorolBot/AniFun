import datetime
from io import BytesIO
from typing import List
from uuid import UUID

from PIL import Image
from pydantic import (AliasChoices, BaseModel, ConfigDict, Field,
                      field_validator)

from src.app import validation
from src.app.anime.enums.v1 import sub as sub_enum
from src.app.anime.schemas.api_v1 import schemas


class Title(BaseModel):
    title: validation.ValidText[5, 150]

    model_config = ConfigDict(arbitrary_types_allowed=True)


class TitleDTO(BaseModel):
    label: validation.ValidText[5, 150]
    value: UUID


class Episode(BaseModel):
    name: validation.ValidText[5, 150]
    number: validation.ValidNumber[1, 1000]

    model_config = ConfigDict(from_attributes=True)


class EpisodesDTO(Title, Episode):
    episode_uuid: UUID
    title_uuid: UUID
    date_add: datetime.datetime


class EpisodeDTO(Title, BaseModel):
    title_uuid: validation.ValidUUID
    episode: Episode = Field(
        validation_alias=AliasChoices("EpisodeTable", "episode")
    )
    preview: schemas.PreviewDTO | None = Field(
        validation_alias=AliasChoices("EpisodePreviewTable", "preview"),
        default=None
    )
    video: schemas.VideoDTO | None = Field(
        validation_alias=AliasChoices("EpisodeVideoTable", "video"),
        default=None
    )
    time_code: schemas.TimeCodeDTO | None = Field(
        validation_alias=AliasChoices("EpisodeTimeCodeTable", "time_code"),
        default=None
    )


class BannerDTO(Title):
    title_uuid: validation.ValidUUID
    banner_uuid: validation.ValidUUID
    is_active: bool
    position: validation.ValidNumber[0, 50] | None = None


class CreateTitle(Title):
    sub_title: validation.ValidText[5, 150] | None
    alias: validation.ValidAlias | None = None
    description: validation.ValidDescription
    year: validation.ValidNumber[1970, 2050] = 2026
    type: sub_enum.Type
    season: sub_enum.Season
    age_restrict: sub_enum.Restrict
    status: sub_enum.Status
    genres: List[int]
    is_origin: bool = True  # Удалить так как позицию можно регулировать в франшизах
    total_episode: validation.ValidNumber[1, 1000] = 12

    model_config = ConfigDict(use_enum_values=True)


class CreateTitleDTO(BaseModel):
    uuid: UUID
    alias: validation.ValidAlias


class ValidImg(BaseModel):
    data: bytes

    @field_validator("data")
    @classmethod
    def validate_content_type(cls, v: bytes) -> bytes:
        try:
            Image.open(BytesIO(v)).verify()
        except Exception:
            raise ValueError(f"Недопустимый тип файла: {v}")
        return v

    @field_validator("data")
    @classmethod
    def validate_size(cls, v: bytes) -> bytes:
        max_size = 5 * 1024 * 1024
        if len(v) > max_size:
            raise ValueError("Превышен лимит размера файла в 5MB.")
        return v

    # ratio: validation.ValidRatioImg[3, 2]


class UpdateTitle(CreateTitle):
    alias: validation.ValidAlias


class CreateEpisode(BaseModel):
    name: validation.ValidText[5, 50]
    number: validation.ValidNumber[1, 1000]
    is_schedule_exist: bool = False


class CreateEpisodeDTO(BaseModel):
    uuid: UUID
    episode_uuid: UUID


class UpdateBanner(BaseModel):
    banner_uuid: UUID
    is_active: bool
    position: validation.ValidNumber[0, 50]


class ScheduleItem(BaseModel):
    time_release: datetime.time
    date: datetime.date
    episode_number: validation.ValidNumber[1, 1000]
    episode_name: validation.ValidText[5, 50]


class Schedules(BaseModel):
    title_uuid: UUID
    items: List[ScheduleItem]


class UpdateSchedules(Schedules):
    ...


class UpdateScheduleStatus(BaseModel):
    is_released: bool


####
####
####
####
####
####
####
####
####
####
####
########
####
####
# class AddPreview(BaseModel):
#   episode_number: validation.ValidNumber[1, 1000]


class AddSequel(Title):
    sequel_title: validation.ValidText[3, 150]
