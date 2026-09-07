from decimal import Decimal
from typing import List
from uuid import UUID

from pydantic import BaseModel

from src.app.validation.number import ValidNumber


class RatingPer(BaseModel):
    star: int
    count: int
    percentage: Decimal


class RatingDTO(BaseModel):
    total_count: ValidNumber[0, 9999] | None
    avg: Decimal
    my_rating: ValidNumber[0, 10] | None = None
    rating_per: List[RatingPer]


class SetRating(BaseModel):
    title_uuid: UUID
    star: ValidNumber[0, 10]


class UpdateRating(SetRating):
    ...
