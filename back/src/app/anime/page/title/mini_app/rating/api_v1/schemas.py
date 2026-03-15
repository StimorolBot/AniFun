from pydantic import BaseModel, field_validator

from src.utils.valid import ValidNumber, ValidText


class Rating(BaseModel):
    star: ValidNumber[0, 10]
    title: ValidText[5, 150]


class ResponseRatingDTO(BaseModel):
    total_count: ValidNumber[0, 9999]
    avg: float
    my_rating: ValidNumber[0, 10] | None = None
