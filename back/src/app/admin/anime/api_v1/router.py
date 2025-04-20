from typing import List
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends, HTTPException, status

from src.utils.crud import crud
from src.utils.logger import anime_log
from src.database.session import get_async_session

from src.app.anime.enums.v1 import sub as sub_enums
from src.app.admin.anime.api_v1.schemas import AddEpisode, ResponseTitleDTO, Schedules

from src.app.anime.models.v1 import main as main_table
from src.app.admin.anime.api_v1.depends import content, img

admin_router = APIRouter(prefix="/admin/anime/add", tags=["admin"])


@admin_router.post("/title", status_code=status.HTTP_201_CREATED, description="Добавить новое аниме")
async def add_title(
        genres: List[sub_enums.Genres],
        data_content: dict = Depends(content), img_data: dict = Depends(img),
        session: AsyncSession = Depends(get_async_session),
):
    try:
        create_data = await crud.create(session=session, table=main_table.AnimeTable, data=data_content)
        await session.flush()

        await crud.create(session=session, table=main_table.ImgTable, data={"title": create_data.title, **img_data})

        for genre in genres:
            await crud.create(
                session=session, table=main_table.GenresAnimeTable,
                data={"title": create_data.title, "genres": genre.value}
            )
        await session.commit()

        anime_log.info(f"Тайтл '{data_content["title"]}' добавлен")
        return ResponseTitleDTO(**data_content)
    except IntegrityError:
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Тайтл с таким именем уже существует")


@admin_router.post("/episode", description="Добавить новый эпизод")
async def add_episode(data: AddEpisode, session: AsyncSession = Depends(get_async_session)):
    # from fastapi import UploadFile, File
    await crud.create(session=session, table=main_table.EpisodeTable, data=data.model_dump())
    await session.commit()

    anime_log.info(f"Эпизод номер {data.episode} добавлен для тайтла '{data.title}'")
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=f"Эпизод номер {data.episode} добавлен для тайтла '{data.title}'"
    )


@admin_router.post("/schedules", description="Установить расписание выхода эпизодов")
async def set_schedules(
        date_list: List[Schedules],
        title: str,
        day_week: sub_enums.DayWeek,
        session: AsyncSession = Depends(get_async_session)
):
    for d in date_list:
        await crud.create(
            session=session, table=main_table.ScheduleTable,
            data={
                "title": title, "day_week": day_week.value,
                "date": d.get_date, "episode_number": d.episode_number
            }
        )
    await session.commit()
    anime_log.info("Создано расписание выхода серий для %s", title)

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "title": title, "day_week": day_week.value,
            **{"schedules": [{
                "date": d.get_date, "episode_number": d.episode_number
            } for d in date_list]}
        }
    )
