import datetime
from typing import List, Literal

from pydantic import BaseModel, ConfigDict, Field
from src.app.anime.enums.v1 import sub as sub_enums
from src.utils.valid import (ValidDescription, ValidEpisodes, ValidTitle,
                             ValidYear)


class Title(BaseModel):
    title: ValidTitle


class AddTitle(Title):
    description: ValidDescription
    alias: str | None = None
    year: ValidYear
    type: sub_enums.Type
    season: sub_enums.Season
    age_restrict: sub_enums.Restrict
    status: sub_enums.Status
    genres: List[sub_enums.Genres]
    is_origin: bool = True
    total_episode: int = Field(ge=1, le=1_000)

    model_config = ConfigDict(use_enum_values=True)


class Img(BaseModel):
    ext: Literal["webp", "jpeg"]
    size: int = Field(ge=1_000, le=300_000)


class AddEpisode(Title):
    episode_number: ValidEpisodes


class Video(BaseModel):
    ext: Literal["mp4", "mov", "avi"]
    size: int = Field(ge=1_000, le=500_000_000)


class ScheduleItem(BaseModel):
    date: datetime.date
    episode_number: ValidEpisodes
    episode_name: ValidTitle


class SetSchedules(Title):
    day_week: sub_enums.DayWeek
    item: List[ScheduleItem]


class RelationTitle(Title):
    relation_title: ValidTitle


class EpisodeNumber(BaseModel):
    episode_number: ValidEpisodes


class DeleteEpisode(Title):
    episode_list: List[EpisodeNumber]


class DeleteSchedules(Title):
    ...


class UpdateTitle(Title):
    title_prev: ValidTitle
    alias: str | None = None
    description: ValidDescription | None = None
    year: ValidYear | None = None
    type: sub_enums.Type | None = None
    season: sub_enums.Season | None = None
    age_restrict: sub_enums.Restrict | None = None
    status: sub_enums.Status | None = None
    genres: List[sub_enums.Genres] | None = None
    is_origin: bool | None = None
    total_episode: int | None = Field(ge=1, le=1_000, default=None)

    model_config = ConfigDict(use_enum_values=True)


class UpdateScheduleItem(BaseModel):
    update_fild: Literal["day_week", "date", "episode_number", "episode_name"]
    date: datetime.date | None
    episode_number: ValidEpisodes | None
    episode_name: ValidTitle | None


class UpdateSchedules(Title):
    day_week: sub_enums.DayWeek | None
    item: List[UpdateScheduleItem]

    model_config = ConfigDict(use_enum_values=True)
