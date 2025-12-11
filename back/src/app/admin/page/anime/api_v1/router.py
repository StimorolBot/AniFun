from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.admin.file_server import file_server
from src.app.admin.page.anime.api_v1 import schemas
from src.app.admin.page.anime.api_v1.valid import (valid_episode_data,
                                                   valid_img, valid_video)
from src.app.admin.utils import (check_access, generate_alias,
                                 is_equals_day_week, is_exist_title)
from src.app.anime.models.v1 import main as main_table
from src.database.session import get_async_session
from src.utils.crud import crud
from src.utils.logger import admin_log

admin_anime_router = APIRouter(prefix="/admin/anime", tags=["admin-anime"], dependencies=[Depends(check_access)])


@admin_anime_router.post("/create-title", summary="Создать тайтл")
async def create_title(
        data: schemas.AddTitle,
        session: AsyncSession = Depends(get_async_session),
):
    try:
        data_dict = data.model_dump()
        genres = data_dict.pop("genres")
        data_dict["alias"] = generate_alias(data_dict.get("alias")) \
            if data_dict.get("alias") \
            else generate_alias(data_dict.get("title"))

        await crud.create(
            session=session,
            table=main_table.AnimeTable,
            data=data_dict
        )
        await session.flush()

        for genre in genres:
            await crud.create(
                session=session, table=main_table.GenresTable,
                data={"title": data.title, "genres": genre}
            )
        await session.commit()

        admin_log.info("Тайтл '%s' создан", data.title)
        return JSONResponse(status_code=status.HTTP_201_CREATED, content=f"Тайтл '{data.title}' создан.")
    except IntegrityError as e:
        admin_log.warning("При попытке создать тайтл произошла ошибка: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не удалось создать тайтл. Возможно, тайтл с таким именем уже существует."
        ) from e


@admin_anime_router.post("/add-poster", summary="Добавить постер")
async def add_poster(
        title: str, img_base64: str = Depends(valid_img),
        session: AsyncSession = Depends(get_async_session)
):
    try:
        await crud.create(session=session, table=main_table.ImgTable, data={"title": title, "poster": img_base64})
        await session.commit()
        admin_log.info("Добавлен постер для '%s'", title)
        return JSONResponse(status_code=status.HTTP_201_CREATED, content="Постер добавлен.")
    except IntegrityError as e:
        admin_log.warning("Попытка добавить постер к несуществующему тайталу, %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Не удалось добавить постер. Пожалуйста, проверьте название тайтла."
        ) from e


@admin_anime_router.post("/add-relation-title", description="Связать продолжение с тайтлом")
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

        admin_log.info("Добавлено продолжение '%s' для '%s'", data.relation_title, data.title)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content=f"Добавлено продолжение '{data.relation_title}' для '{data.title}'"
        )
    except IntegrityError as e:
        admin_log.warning("Попытка добавить существующую запись: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{data.relation_title}' и '{data.title}' уже связаны"
        ) from e
    except AttributeError as e:
        admin_log.warning("При попытке добавить продолжение возникла ошибка %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Не удалось добавить продолжение '{data.title}' для '{data.relation_title}'"
        ) from e
    except UnicodeDecodeError as e:
        admin_log.warning("Ошибка чтения data: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Не удалось добавить продолжение {relation_title} для {title}."
                   f"Пожалуйста, перезагрузите страницу и попробуйте еще раз"
        ) from e


@admin_anime_router.post("/add-episode", summary="Добавить новый эпизод")
async def add_episode(
        video: UploadFile = Depends(valid_video),
        preview_base64: str = Depends(valid_img),
        episode_data: dict = Depends(valid_episode_data),
        session: AsyncSession = Depends(get_async_session)
):
    try:
        stmt = await crud.create(
            session=session, table=main_table.EpisodeTable,
            data={
                "preview": preview_base64,
                "title": episode_data["title"],
                "episode_number": episode_data["episode_number"]
            }
        )
        await session.flush()

        await crud.update(
            session=session,
            table=main_table.ScheduleTable,
            episode_number=episode_data["episode_number"],
            title=episode_data["title"],
            data={"is_add": True}
        )
        await session.commit()

        await file_server.save(file=video, path="./public/.videos", title=stmt.uuid)

        admin_log.info("Эпизод №%s добавлен для '%s'", episode_data["episode_number"], episode_data["title"])
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content=f"Эпизод {episode_data["episode_number"]} добавлен для '{episode_data["title"]}'"
        )
    except IntegrityError as e:
        admin_log.warning("При попытке добавить новый эпизод произошла ошибка: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="При попытке добавить новый эпизод произошла ошибка.\n"
                   "Пожалуйста, проверьте название тайтла, а так же наличие расписания выхода эпизодов."
        ) from e


@admin_anime_router.post("/set-schedules", summary="Установить расписание выхода эпизодов")
async def set_schedules(data: schemas.SetSchedules, session: AsyncSession = Depends(get_async_session)):
    day_week = data.day_week.name.title()
    for item in data.item:
        is_equals_day_week(day_week, item.date.strftime("%A"))
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
        except IntegrityError as e:
            admin_log.error(
                "При при попытке установить расписание для '%s' возникла ошибка: %s",
                data.title, e
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="При попытке установить расписание произошла ошибка.\n"
                       "Пожалуйста, проверьте названия тайтла или повторите попытку позже"
            ) from e
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=f"Установлено расписание выхода серий для '{data.title}'."
    )


@admin_anime_router.patch("/add-slide", summary="Добавить тайтл в слайдер")
async def add_slide(
        title: str, img: str = Depends(valid_img),
        session: AsyncSession = Depends(get_async_session)
):
    await crud.update(session=session, table=main_table.ImgTable, data={"banner": img}, title=title)
    await session.commit()
    admin_log.info("Тайтл '%s' добавлено в слайдер", title)
    return JSONResponse(status_code=status.HTTP_200_OK, content=f"Тайтл '{title}' добавлено в слайдер")


@admin_anime_router.patch("/delete-slide", summary="Удалить тайтл из слайдера")
async def delete_slide(title: schemas.Title, session: AsyncSession = Depends(get_async_session)):
    await crud.update(session, main_table.ImgTable, title=title.title, data={"banner": None})
    await session.commit()
    admin_log.info("Тайтл '%s' удалено из слайдера", title.title)
    return JSONResponse(status_code=status.HTTP_200_OK, content=f"Тайтл '{title.title}' удален из слайдера.")


@admin_anime_router.patch("/update-title", summary="Обновить информацию о тайтле")
async def update_title(
        data: schemas.UpdateTitle,
        session: AsyncSession = Depends(get_async_session)
):
    await is_exist_title(table=main_table.AnimeTable, session=session, title=data.title_prev)
    data_dict = data.model_dump(exclude_none=True)

    if len(data_dict) <= 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Недостаточно данных для обновления."
        )

    genres = data_dict.pop("genres", None)

    if genres:
        for genre in genres:
            await crud.update(
                session=session,
                table=main_table.GenresTable,
                title=data_dict["title"],
                data={"title": data.title_prev, "genres": genre}
            )
    await session.flush()

    await crud.update(
        session=session,
        table=main_table.AnimeTable,
        title=data_dict.pop("title_prev"),
        data=data_dict
    )

    await session.commit()
    admin_log.info("Для '%s' были обновлены следующие поля: %s", data.title_prev, data_dict)
    return JSONResponse(status_code=status.HTTP_200_OK, content="Данные обновлены.")


@admin_anime_router.patch("/update-schedules", summary="Обновить расписание выхода эпизодов")
async def update_schedules(
        data: schemas.UpdateSchedules,
        session: AsyncSession = Depends(get_async_session)
):
    await is_exist_title(table=main_table.ScheduleTable, session=session, title=data.title)
    data_dict = data.model_dump(exclude_none=True)
    title = data_dict.pop("title")
    day_week = data_dict.get("day_week")

    query = select(main_table.ScheduleTable.day_week).filter_by(title=data.title)
    query_result = await session.execute(query)
    query_data = query_result.first()

    if day_week:
        is_equals_day_week(day_week, query_data.day_week)
        await crud.update(
            session=session,
            table=main_table.ScheduleTable,
            title=title,
            data={"day_week": day_week}
        )
        admin_log.info("Для '%s' был обновлен день недели", title)

    for item in data_dict["item"]:
        update_fild = item.pop("update_fild")
        if item.get("date"):
            is_equals_day_week(day_week if day_week else query_data.day_week, item.get("date").strftime("%A"))

        await crud.update(
            session=session,
            table=main_table.ScheduleTable,
            title=title,
            data=item,
            **{update_fild: item[update_fild]}
        )

    await session.commit()

    admin_log.info("Для '%s' обновлено расписание выхода серий.", data.title)
    return JSONResponse(status_code=status.HTTP_200_OK, content="Расписание обновлено.")


@admin_anime_router.delete("/delete-title", summary="Удалить тайтл")
async def delete_title(data: schemas.Title, session: AsyncSession = Depends(get_async_session)):
    await is_exist_title(table=main_table.AnimeTable, session=session, title=data.title)
    await crud.delite(session=session, table=main_table.AnimeTable, title=data.title)
    await session.commit()
    admin_log.info("Тайтл '%s' удален", data.title)
    return JSONResponse(status_code=status.HTTP_200_OK, content=f"Тайтл '{data.title}' удален.")


@admin_anime_router.delete("/delete-relation-title", summary="Удалить связать продолжения с тайтлом")
async def delete_relation_title(
        data: schemas.RelationTitle,
        session: AsyncSession = Depends(get_async_session)
):
    await is_exist_title(
        table=main_table.RelationAnime,
        session=session,
        title=data.title,
        relation_title=data.relation_title
    )
    await crud.delite(
        session=session,
        table=main_table.RelationAnime,
        title=data.title,
        relation_title=data.relation_title
    )
    await session.commit()
    admin_log.info("Удаление связи между %s и %s", data.title, data.relation_title)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=f"Связь между '{data.title}' и '{data.relation_title}' разрушена."
    )


@admin_anime_router.delete("/delete-episode", summary="Удалить эпизод")
async def delete_episode(
        data: schemas.DeleteEpisode,
        session: AsyncSession = Depends(get_async_session)
):
    await is_exist_title(table=main_table.EpisodeTable, session=session, title=data.title)
    for episode in data.item:
        await crud.delite(
            session=session,
            table=main_table.EpisodeTable,
            title=data.title,
            episode_number=episode.episode_number
        )
    await session.commit()
    admin_log.info("Удаление эпизода(ов): %s для %s", [i.episode_number for i in data.item], data.title)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=f"Удаление эпизода(ов): {[i.episode_number for i in data.item]} для {data.title}"
    )


@admin_anime_router.delete("/delete-schedules", summary="Удалить расписание")
async def delete_schedules(data: schemas.DeleteSchedules, session: AsyncSession = Depends(get_async_session)):
    await is_exist_title(table=main_table.ScheduleTable, session=session, title=data.title)
    await crud.delite(session=session, table=main_table.ScheduleTable, title=data.title)
    admin_log.info("Удаление расписания для %s", data.title)
    return JSONResponse(status_code=status.HTTP_200_OK, content="Расписание удалено")


@admin_anime_router.get("/api-list", summary="Получить список api")
async def get_api_list():
    try:
        return FileResponse("./src/app/admin/page/anime/api_v1/admin_api.json")
    except FileNotFoundError as e:
        admin_log.error("Не удалось найти файл admin_api.json. %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Не удалось найти список api route."
        ) from e
