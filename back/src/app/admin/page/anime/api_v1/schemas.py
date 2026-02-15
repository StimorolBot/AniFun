import datetime
from typing import List, Literal, TypeVar

from fastapi import HTTPException, status
from pydantic import BaseModel, ConfigDict, Field, field_validator

from src.app.anime.enums.v1 import sub as sub_enum
from src.utils.valid import ValidNumber, ValidText

T = TypeVar("T")


class Title(BaseModel):
    title: ValidText[3, 150]

    model_config = ConfigDict(arbitrary_types_allowed=True)


class AddTitle(Title):
    description: ValidText[10, 1000]
    alias: ValidText[3, 150] | None = None
    year: ValidNumber[1970, 2050] = 2026
    type: sub_enum.TypeLabel
    season: sub_enum.SeasonLabel
    age_restrict: sub_enum.RestrictLabel
    status: sub_enum.StatusLabel
    genres: List[sub_enum.Genres] = Field(alias="genres")
    is_origin: bool = True
    total_episode: ValidNumber[1, 1000] = 12

    model_config = ConfigDict(use_enum_values=True, arbitrary_types_allowed=True)


class UpdateTitle(BaseModel):
    old_title_name: ValidText
    new_title_name: ValidText | None = None
    alias: ValidText | None = None
    description: ValidText[10, 1000] | None = None
    year: ValidNumber[1970, 2050] | None = None
    type: sub_enum.TypeLabel | None = None
    season: sub_enum.SeasonLabel | None = None
    age_restrict: sub_enum.RestrictLabel | None = None
    status: sub_enum.StatusLabel | None = None
    genres: List[sub_enum.GenresLabel] | None = None
    is_origin: bool | None = None
    total_episode: ValidNumber | None = None

    model_config = ConfigDict(
        use_enum_values=True,
        arbitrary_types_allowed=True
    )


class ValidImg(BaseModel):
    content_type: str
    data: bytes

    @field_validator("content_type")
    @classmethod
    def validate_content_type(cls, v: str) -> str:
        allowed = {"image/webp", "image/png", "image/jpeg"}
        if v not in allowed:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Недопустимый тип файла: {v}"
            )
        return v

    @field_validator("data")
    @classmethod
    def validate_size(cls, v: bytes) -> bytes:
        max_size = 5 * 1024 * 1024
        if len(v) > max_size:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Превышен лимит размера файла в 5MB."
            )
        return v


class AddEpisode(Title):
    episode_name: ValidText[5, 50]
    episode_number: ValidNumber[1, 1000]
    is_schedule_exist: bool = False


class DeleteEpisode(Title):
    episode_number: ValidNumber[1, 1000]


class AddSequel(Title):
    sequel_title: ValidText[3, 150]


class ScheduleItem(BaseModel):
    date: datetime.date
    episode_number: ValidNumber[1, 1000]
    episode_name: ValidText[5, 50]


class SetSchedules(Title):
    day_week: sub_enum.DayWeek = Field(..., alias="day_week")
    item: List[ScheduleItem]
    is_extend: bool = False

    model_config = ConfigDict(
        str_to_lower=True,
        use_enum_values=True,
        arbitrary_types_allowed=True
    )


class UpdateSchedules(Title):
    update_field: Literal["day_week", "date_release", "episode_number", "episode_name"]
    old_value: T
    day_week: sub_enum.DayWeek | None = Field(alias="day_week", default=None)
    date_release: datetime.date | None = None
    episode_number: ValidNumber[1, 1000] | None = None
    episode_name: ValidText[5, 50] | None = None

    model_config = ConfigDict(
        str_to_lower=True,
        use_enum_values=True,
    )

    @field_validator("old_value")
    @classmethod
    def validate_old_value(cls, v: T) -> T:
        if isinstance(v, int):
            v: ValidNumber[1, 1000]
            return v
        elif isinstance(v, str):
            v: ValidText[5, 50]
            return v
        elif isinstance(v, datetime.date):
            return v


class DeleteSchedules(Title):
    ...


class DeleteSchedulesItem(Title):
    episode_number: ValidNumber[1, 1000]
