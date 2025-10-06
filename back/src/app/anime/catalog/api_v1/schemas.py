from typing import List

from pydantic import BaseModel

from src.app.anime.enums.v1 import sub as sub_enums
from src.app.anime.schemas.api_v1 import schemas
from src.utils.valid import ValidDescription


class ResponseCatalogDTO(schemas.ResponseAnimeDTO):
    genres_rs: List[schemas.GenresDTO]
    img_rs: schemas.PosterDTO
    description: ValidDescription


class FilterData(BaseModel):
    year: List[int] | None = None
    type: List[sub_enums.Type] | None = None
    season: List[sub_enums.Season] | None = None
    status: List[sub_enums.Status] | None = None
    age_restrict: List[sub_enums.Restrict] | None = None
    genres: List[sub_enums.Genres] | None = None
