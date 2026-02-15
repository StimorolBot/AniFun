from fastapi import HTTPException, status
from pydantic import BaseModel, field_validator

from src.app.admin.page.anime.api_v1 import schemas


def valid_episode_data(
        title: str,
        episode_number: int,
        is_schedule_exist: bool,
        episode_name: str
) -> dict:
    return schemas.AddEpisode(
        title=title,
        episode_number=episode_number,
        episode_name=episode_name,
        is_schedule_exist=is_schedule_exist
    ).model_dump()


class ValidVideo(BaseModel):
    content_type: str
    data: bytes

    @field_validator("content_type")
    @classmethod
    def validate_content_type(cls, v: str) -> str:
        allowed = {"video/mp4"}
        if v not in allowed:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Недопустимый тип файла: {v}"
            )
        return v

    @field_validator("data")
    @classmethod
    def validate_size(cls, v: bytes) -> bytes:
        max_size = 900 * 1024 * 1024
        if len(v) > max_size:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Превышен лимит размера файла в 900MB."
            )
        return v
