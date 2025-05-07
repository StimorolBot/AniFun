import datetime
from typing import Literal
from pydantic import BaseModel, Field
from fastapi import HTTPException, status

from src.app.anime.enums.v1 import sub as sub_enums
from src.utils.valid import ValidDescription, ValidEpisodes, ValidTitle


class AddTitle(BaseModel):
    title: ValidTitle
    description: ValidDescription
    year: int = Field(default=2025, ge=1970, le=2500)
    episodes: ValidEpisodes
    type: sub_enums.Type
    season: sub_enums.Season
    age_restrict: sub_enums.Restrict
    status: sub_enums.Status
    is_origin: bool = True


class AddImg(BaseModel):
    content_type: Literal["image/webp", "image/jpeg"]
    extension: Literal["webp", "jpeg"]
    size: int = Field(ge=1_000, le=500_000)


class AddEpisode(BaseModel):
    title: ValidTitle
    episode: ValidEpisodes


class ResponseTitleDTO(AddTitle):
    ...


class Schedules(BaseModel):
    day: int
    month: int
    year: int
    episode_number: ValidEpisodes

    @property
    def get_date(self):
        try:
            return datetime.date(self.year, self.month, self.day).strftime("%d-%m-%Y")
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Введен неверный формат даты")


class RelationTitle(BaseModel):
    title: ValidTitle
    relation_title: ValidTitle
