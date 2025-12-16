from fastapi import HTTPException, UploadFile, status
from pydantic_core._pydantic_core import ValidationError

from src.app.admin.page.anime.api_v1 import schemas
from src.app.admin.utils import get_base64


async def valid_img(img: UploadFile) -> str:
    try:
        schemas.Img(ext=img.filename.split(".")[-1], size=img.size)
        return get_base64(await img.read())
    except ValidationError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Некорректно указаны данные формы.\n"
                   "Изображение может иметь формат: '.webp' или '.jpeg'.\n"
                   "Так же размер файла должен быть в пределах от 1 до le=300 кБ"
        )


def valid_episode_data(title: str, episode_number: int) -> dict:
    return schemas.AddEpisode(title=title, episode_number=episode_number).model_dump()


def valid_video(video: UploadFile):
    try:
        schemas.Video(ext=video.filename.split(".")[-1], size=video.size)
        return video
    except ValidationError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Некорректно указаны данные формы.\n"
                   "Видео файл может иметь формат: '.mp4', '.mov', '.avi'.\n"
                   "Так же размер файла должен быть в пределах от 1кБ до le=500 мБ"
        )
