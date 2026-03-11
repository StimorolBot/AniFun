from typing import List

from pydantic import AliasChoices, BaseModel, Field

from src.app.anime.enums.v1 import sub as sub_enums
from src.app.anime.page.home.api_v1.schemas import ExtRespNewEpisodeDTO
from src.utils.valid import ValidNumber, ValidText


class ExtRespReleaseDTO(ExtRespNewEpisodeDTO):
    description: ValidText[10, 1000]


class ResponseReleaseDTO(BaseModel):
    anime: ExtRespReleaseDTO = Field(
        validation_alias=AliasChoices("AnimeTable", "anime")
    )
    avg: float | None = None
    total_count: ValidNumber[1, 9999] | None = None


class FilterData(BaseModel):
    title: ValidText[5, 150] | None = None
    year: List[ValidNumber[1970, 2050]] | None = None
    type: List[sub_enums.TypeLabel] | None = None
    season: List[sub_enums.SeasonLabel] | None = None
    status: List[sub_enums.StatusLabel] | None = None
    age_restrict: List[sub_enums.RestrictLabel] | None = None
    genres: List[sub_enums.Genres] | None = None
