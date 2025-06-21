from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile

from src.utils.crud import crud
from src.utils.utils import get_alias
from src.utils.logger import anime_log
from src.database.session import get_async_session

from src.app.admin.anime.api_v1 import schemas
from src.app.anime.models.v1 import main as main_table
from src.app.admin.anime.api_v1.valid import valid_img, valid_episode_data, valid_video

from src.app.admin.file_server import file_server
from src.app.user.utils.utils import check_access

admin_router = APIRouter(prefix="/admin/anime", tags=["admin"])


@admin_router.post("/add-new-title", status_code=status.HTTP_201_CREATED, description="Добавить новое аниме")
async def add_title(data: schemas.AddTitle, session: AsyncSession = Depends(get_async_session)):
    try:
        await crud.create(
            session=session,
            table=main_table.AnimeTable,
            data={
                "alias": get_alias(data.title),
                "title": data.title,
                "year": data.year,
                "description": data.description,
                "is_origin": data.is_origin,
                "type": data.type.value,
                "season": data.season.value,
                "age_restrict": data.age_restrict.value,
                "status": data.status.value
            }
        )
        await session.flush()

        for genre in data.genres:
            await crud.create(
                session=session, table=main_table.GenresAnimeTable,
                data={"title": data.title, "genres": genre.value}
            )
        await session.commit()

        anime_log.info(f"Тайтл '{data.title}' добавлен")
        return schemas.ResponseTitleDTO(**data.model_dump())
    except IntegrityError as e:
        anime_log.warning("При попытке добавить новое аниме произошла ошибка: %s", e)
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Тайтл с таким именем уже существует")


@admin_router.post("/add-poster", status_code=status.HTTP_201_CREATED, description="Добавить постер для аниме")
async def add_poster(
        title: str, img_base64: str = Depends(valid_img),
        session: AsyncSession = Depends(get_async_session)
):
    await crud.create(session=session, table=main_table.ImgTable, data={"title": title, "poster": img_base64})
    await session.commit()
    anime_log.info("Добавлен постер для '%s'", title)


@admin_router.post("/add-relation-title", description="Связать продолжение с аниме")
async def add_relation_title(data: schemas.RelationTitle, session: AsyncSession = Depends(get_async_session)):
    title = await crud.read(session=session, table=main_table.AnimeTable, title=data.title)
    relation_title = await crud.read(session=session, table=main_table.AnimeTable, title=data.relation_title)

    try:
        if relation_title.is_origin or title.year > relation_title.year:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Не удалось добавить продолжение f'{relation_title.title}' для '{title.title}'"
            )

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
    except AttributeError as e:
        anime_log.warning("При попытке добавить продолжение возникла ошибка %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Не удалось добавить продолжение {relation_title} для {title}"
        )


@admin_router.post("/add-episode", description="Добавить новый эпизод")
async def add_episode(
        video: UploadFile = Depends(valid_video),
        preview_base64: str = Depends(valid_img),
        episode_data: dict = Depends(valid_episode_data),
        session: AsyncSession = Depends(get_async_session)
):
    try:
        stmt = await crud.create(
            session=session, table=main_table.EpisodeTable,
            data={"preview": preview_base64, "title": episode_data["title"]}
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
            detail="При попытке добавить новый эпизод произошла ошибка.\n"
                   "Пожалуйста, проверьте название аниме, а так же наличие расписания выхода эпизодов."
        )


@admin_router.post("/set-schedules", description="Установить расписание выхода эпизодов")
async def set_schedules(data: schemas.Schedules, session: AsyncSession = Depends(get_async_session)):
    day_week = data.day_week.name.title()
    for item in data.schedule_item:
        if day_week != item.date.strftime("%A"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=
                f"Для эпизода {item.episode_name} ожидалось {day_week}={day_week}.\n"
                f"Получено {day_week}!={item.date.strftime("%A")}"
            )
        try:
            await crud.create(
                session=session, table=main_table.ScheduleTable,
                data={
                    "title": data.title,
                    "day_week": data.day_week.value,
                    "date": item.date,
                    "episode_number": item.episode_number,
                    "episode_name": item.episode_name
                }
            )
            await session.commit()
            anime_log.info("Создано расписание выхода серий для %s", data.title)
        except IntegrityError as e:
            anime_log.warning(
                "При при попытке установить расписание выхода серий для '%s' возникла ошибка: %s",
                data.title, e
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="При попытке установить расписание произошла ошибка.\n"
                        "Пожалуйста, проверьте название аниме, а так же не было ли добавлено расписание до этого."
            )
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "title": data.title, "day_week": data.day_week.value,
            **{"schedules": [{
                "date": d.date.strftime("%Y-%m-%d"), "episode_number": d.episode_number, "episode_name": d.episode_name
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


@admin_router.patch("/delete-slide", description="Удалить аниме из слайдера")
async def delete_slide(title: schemas.Title, session: AsyncSession = Depends(get_async_session)):
    await crud.update(session, main_table.ImgTable, title=title.title, data={"banner": None})
    await session.commit()
    anime_log.info("Аниме '%s' удалено из слайдера", title.title)
    return JSONResponse(status_code=status.HTTP_200_OK, content=f"Аниме '{title.title}' удалено из слайдера")


@admin_router.patch("/update-title")
async def update_title(session: AsyncSession = Depends(get_async_session)):
    anime_log.info("")


@admin_router.patch("update-schedules")
async def update_schedules(session: AsyncSession = Depends(get_async_session)):
    anime_log.info("")


@admin_router.delete("/delete-title", description="Удалить аниме")
async def delete_title(title: schemas.Title, session: AsyncSession = Depends(get_async_session)):
    await crud.delite(session=session, table=main_table.ImgTable, title=title.title)
    await session.commit()
    anime_log.info("Тайтл '%s' удален", title.title)
    return JSONResponse(status_code=status.HTTP_200_OK, content=f"Аниме '{title.title}' удалено")


@admin_router.delete("/delete-relation-title", description="удалить связать продолжения с аниме")
async def delete_relation_title(session: AsyncSession = Depends(get_async_session)):
    anime_log.info("")


@admin_router.delete("/delete-episode", description="Удалить эпизод")
async def delete_episode(session: AsyncSession = Depends(get_async_session)):
    anime_log.info("")


@admin_router.delete("/delete-schedules", description="Удалить расписание")
async def delete_schedules(session: AsyncSession = Depends(get_async_session)):
    anime_log.info("")
