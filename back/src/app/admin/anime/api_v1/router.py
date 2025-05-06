from typing import List
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends, HTTPException, status

from src.utils.crud import crud
from src.utils.utils import get_alias
from src.utils.logger import anime_log
from src.database.session import get_async_session

from src.app.anime.enums.v1 import sub as sub_enums
from src.app.admin.anime.api_v1 import schemas

from src.app.anime.models.v1 import main as main_table
from src.app.admin.anime.api_v1.depends import content, poster, slide

admin_router = APIRouter(prefix="/admin/anime", tags=["admin"])


@admin_router.post("/add-new-title", status_code=status.HTTP_201_CREATED, description="Добавить новое аниме")
async def add_title(
        genres: List[sub_enums.Genres],
        data_content: dict = Depends(content), img_data: dict = Depends(poster),
        session: AsyncSession = Depends(get_async_session),
):
    try:
        create_data = await crud.create(
            session=session, table=main_table.AnimeTable,
            data={"alias": get_alias(data_content["title"]), **data_content})
        await session.flush()

        await crud.create(session=session, table=main_table.ImgTable, data={"title": create_data.title, **img_data})

        for genre in genres:
            await crud.create(
                session=session, table=main_table.GenresAnimeTable,
                data={"title": create_data.title, "genres": genre.value}
            )
        await session.commit()

        anime_log.info(f"Тайтл '{data_content["title"]}' добавлен")
        return schemas.ResponseTitleDTO(**data_content)
    except IntegrityError as e:
        anime_log.warning("При попытке добавить новое аниме произошла ошибка: %s", e)
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Тайтл с таким именем уже существует")


@admin_router.post("/add-relation-title", description="Связать продолжение с аниме")
async def add_relation_title(data: schemas.RelationTitle, session: AsyncSession = Depends(get_async_session)):
    title = await crud.read(session=session, table=main_table.AnimeTable, title=data.title)
    relation_title = await crud.read(session=session, table=main_table.AnimeTable, title=data.relation_title)

    if relation_title.is_origin or title.year > relation_title.year:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Не удалось добавить продолжение f'{relation_title.title}' для '{title.title}'"
        )

    try:
        await crud.create(session=session, table=main_table.RelationAnime, data=data.model_dump())
        await session.commit()

        anime_log.info("Добавлено продолжение '%s' для '%s'", data.relation_title, data.title)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content=f"Добавлено продолжение '{data.relation_title}' для '{data.title}'"
        )
    except IntegrityError as e:
        anime_log.warning("Попытка добавить существующую запись: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{data.relation_title}' и '{data.title}' уже связаны"
        )


@admin_router.post("/add-episode", description="Добавить новый эпизод")
async def add_episode(data: schemas.AddEpisode, session: AsyncSession = Depends(get_async_session)):
    # from fastapi import UploadFile, File
    await crud.create(session=session, table=main_table.EpisodeTable, data=data.model_dump())
    await session.commit()

    anime_log.info(f"Эпизод номер {data.episode} добавлен для тайтла '{data.title}'")
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=f"Эпизод номер {data.episode} добавлен для тайтла '{data.title}'"
    )


@admin_router.post("/set-schedules", description="Установить расписание выхода эпизодов")
async def set_schedules(
        date_list: List[schemas.Schedules],
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


@admin_router.patch("/add-slide", description="Добавить аниме в слайдер")
async def set_slide(title: str, img_base64: str = Depends(slide), session: AsyncSession = Depends(get_async_session)):
    await crud.update(session=session, table=main_table.ImgTable, data=img_base64, title=title)
    await session.commit()
    anime_log.info("Аниме '%s' добавлено в слайдер", title)
    return JSONResponse(status_code=status.HTTP_200_OK, content=f"Аниме '{title}' добавлено в слайдер")


@admin_router.delete("/delite-slide", status_code=status.HTTP_204_NO_CONTENT, description="Удалить аниме из слайдера")
async def delite_slide(img_data: dict = Depends(slide)):
    ...


@admin_router.delete("/delite-title", status_code=status.HTTP_204_NO_CONTENT, description="Удалить аниме")
async def delite_title():
    ...
