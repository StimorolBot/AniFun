import datetime
from typing import List
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File

from src.utils.crud import crud
from src.utils.utils import get_alias
from src.utils.logger import anime_log
from src.database.session import get_async_session

from src.app.anime.enums.v1 import sub as sub_enums
from src.app.admin.anime.api_v1 import schemas

from src.app.anime.models.v1 import main as main_table
from src.app.admin.anime.api_v1.valid import valid_content, valid_img, valid_episode_data, valid_video

from src.app.admin.file_server import file_server

admin_router = APIRouter(prefix="/admin/anime", tags=["admin"])


@admin_router.post("/add-new-title", status_code=status.HTTP_201_CREATED, description="Добавить новое аниме")
async def add_title(
        genres: List[sub_enums.Genres],
        data_content: dict = Depends(valid_content),
        img: str = Depends(valid_img),
        session: AsyncSession = Depends(get_async_session),
):
    try:
        create_data = await crud.create(
            session=session, table=main_table.AnimeTable,
            data={"alias": get_alias(data_content["title"]), **data_content})
        await session.flush()

        await crud.create(
            session=session, table=main_table.ImgTable,
            data={"title": create_data.title, "poster": img}
        )

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
async def add_episode(
        video: UploadFile = Depends(valid_video),
        preview: str = Depends(valid_img),
        episode_data: dict = Depends(valid_episode_data),
        session: AsyncSession = Depends(get_async_session)
):
    try:
        stmt = await crud.create(
            session=session, table=main_table.EpisodeTable,
            data={"preview": preview, "title": episode_data["title"]}
        )
        await session.flush()

        await crud.update(
            session=session, table=main_table.ScheduleTable,
            episode_number=episode_data["episode"],
            title=episode_data["title"],
            data={"uuid_episode": stmt.uuid}
        )
        await session.commit()

        await file_server.save(file=video, path="./public/.videos", title=stmt.uuid)

        anime_log.info("Эпизод №%s добавлен для '%s'", episode_data["episode"], episode_data["title"])
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content=f"Эпизод номер {episode_data["episode"]} добавлен для тайтла '{episode_data["title"]}'"
        )
    except IntegrityError as e:
        anime_log.warning("При попытке добавить новый эпизод произошла ошибка: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Серия №{episode_data["episode"]} уже была добавлена для '{episode_data["title"]}' "
        )


@admin_router.post("/set-schedules", description="Установить расписание выхода эпизодов")
async def set_schedules(data: schemas.Schedules, session: AsyncSession = Depends(get_async_session)):
    for item in data.schedule_item:
        await crud.create(
            session=session, table=main_table.ScheduleTable,
            data={
                "title": data.title, "day_week": data.day_week.value,
                "date": datetime.datetime.strptime(item.get_date, "%d-%m-%Y"), "episode_number": item.episode_number,
                "episode_name": item.episode_name
            }
        )
    await session.commit()
    anime_log.info("Создано расписание выхода серий для %s", data.title)

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "title": data.title, "day_week": data.day_week.value,
            **{"schedules": [{
                "date": d.get_date, "episode_number": d.episode_number, "episode_name": d.episode_name
            } for d in data.schedule_item]}
        }
    )


@admin_router.patch("/add-slide", description="Добавить аниме в слайдер")
async def add_slide(
        title: str, img: str = Depends(valid_img),
        session: AsyncSession = Depends(get_async_session)
):
    await crud.update(session=session, table=main_table.ImgTable, data={"banner": img}, title=title)
    await session.commit()
    anime_log.info("Аниме '%s' добавлено в слайдер", title)
    return JSONResponse(status_code=status.HTTP_200_OK, content=f"Аниме '{title}' добавлено в слайдер")


@admin_router.patch("/delite-slide", description="Удалить аниме из слайдера")
async def delite_slide(title: str, session: AsyncSession = Depends(get_async_session)):
    await crud.update(session, main_table.ImgTable, title=title, data={"banner": None})
    await session.commit()
    return JSONResponse(status_code=status.HTTP_200_OK, content=f"Аниме '{title}' удалено из слайдера")


@admin_router.delete("/delite-title", description="Удалить аниме")
async def delite_title(title: str, session: AsyncSession = Depends(get_async_session)):
    await crud.delite(session=session, table=main_table.ImgTable, title=title)
    await session.commit()
    return JSONResponse(status_code=status.HTTP_200_OK, content=f"Аниме '{title}' удалено")


@admin_router.delete("/delite-relation-title", description="удалить связать продолжения с аниме")
async def delite_relation_title(session: AsyncSession = Depends(get_async_session)):
    ...


@admin_router.delete("/delite-episode", description="Удалить эпизод")
async def delite_episode(session: AsyncSession = Depends(get_async_session)):
    ...


@admin_router.delete("/delite-schedules", description="Удалить расписание")
async def delite_schedules(session: AsyncSession = Depends(get_async_session)):
    ...
