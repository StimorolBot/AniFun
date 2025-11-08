from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from src.app.admin.anime.api_v1 import schemas
from src.app.admin.anime.api_v1.valid import (valid_episode_data, valid_img,
                                              valid_video)
from src.app.admin.file_server import file_server
from src.app.anime.models.v1 import main as main_table
from src.app.user.utils.utils import check_access
from src.database.session import get_async_session
from src.utils.crud import crud
from src.utils.logger import anime_log
from src.utils.utils import get_alias

admin_router = APIRouter(prefix="/admin/anime", tags=["admin"])


@admin_router.post("/create-title", summary="Создать тайтл")
async def create_title(
        data: schemas.AddTitle,
        session: AsyncSession = Depends(get_async_session),
):
    try:
        data_dict = data.model_dump()
        genres = data_dict.pop("genres")
        data_dict["alias"] = get_alias(data_dict.get("alias")) \
            if data_dict.get("alias") \
            else get_alias(data_dict.get("title"))

        await crud.create(
            session=session,
            table=main_table.AnimeTable,
            data=data_dict
        )
        await session.flush()

        for genre in genres:
            await crud.create(
                session=session, table=main_table.GenresAnimeTable,
                data={"title": data.title, "genres": genre}
            )
        await session.commit()

        anime_log.info("Тайтл '%s' создан", data.title)
        return JSONResponse(status_code=status.HTTP_201_CREATED, content=f"Тайтл '{data.title}' создан.")
    except IntegrityError as e:
        anime_log.warning("При попытке создать тайтл произошла ошибка: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не удалось создать тайтл. Возможно, тайтл с таким именем уже существует."
        ) from e


@admin_router.post("/add-poster", summary="Добавить постер")
async def add_poster(
        title: str, img_base64: str = Depends(valid_img),
        session: AsyncSession = Depends(get_async_session)
):
    try:
        await crud.create(session=session, table=main_table.ImgTable, data={"title": title, "poster": img_base64})
        await session.commit()
        anime_log.info("Добавлен постер для '%s'", title)
        return JSONResponse(status_code=status.HTTP_201_CREATED, content="Постер добавлен.")
    except IntegrityError as e:
        anime_log.warning("Попытка добавить постер к несуществующему тайталу, %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Не удалось добавить постер. Пожалуйста, проверьте название тайтла."
        ) from e


@admin_router.post("/add-relation-title", description="Связать продолжение с тайтлом")
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
        ) from e
    except AttributeError as e:
        anime_log.warning("При попытке добавить продолжение возникла ошибка %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Не удалось добавить продолжение '{data.title}' для '{data.relation_title}'"
        ) from e
    except UnicodeDecodeError as e:
        anime_log.warning("Ошибка чтения data: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Не удалось добавить продолжение {relation_title} для {title}."
                   f"Пожалуйста, перезагрузите страницу и попробуйте еще раз"
        ) from e


@admin_router.post("/add-episode", summary="Добавить новый эпизод")
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

        anime_log.info("Эпизод №%s добавлен для '%s'", episode_data["episode_number"], episode_data["title"])
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content=f"Эпизод {episode_data["episode_number"]} добавлен для '{episode_data["title"]}'"
        )
    except IntegrityError as e:
        anime_log.warning("При попытке добавить новый эпизод произошла ошибка: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="При попытке добавить новый эпизод произошла ошибка.\n"
                   "Пожалуйста, проверьте название тайтла, а так же наличие расписания выхода эпизодов."
        ) from e


@admin_router.post("/set-schedules", summary="Установить расписание выхода эпизодов")
async def set_schedules(data: schemas.SetSchedules, session: AsyncSession = Depends(get_async_session)):
    day_week = data.day_week.name.title()
    for item in data.item:
        if day_week != item.date.strftime("%A"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Для эпизода '{item.episode_name}' не совпадает день недели."
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
        except IntegrityError as e:
            anime_log.error(
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


@admin_router.patch("/add-slide", summary="Добавить тайтл в слайдер")
async def add_slide(
        title: str, img: str = Depends(valid_img),
        session: AsyncSession = Depends(get_async_session)
):
    await crud.update(session=session, table=main_table.ImgTable, data={"banner": img}, title=title)
    await session.commit()
    anime_log.info("Тайтл '%s' добавлено в слайдер", title)
    return JSONResponse(status_code=status.HTTP_200_OK, content=f"Тайтл '{title}' добавлено в слайдер")


@admin_router.patch("/delete-slide", summary="Удалить тайтл из слайдера")
async def delete_slide(title: schemas.Title, session: AsyncSession = Depends(get_async_session)):
    await crud.update(session, main_table.ImgTable, title=title.title, data={"banner": None})
    await session.commit()
    anime_log.info("Тайтл '%s' удалено из слайдера", title.title)
    return JSONResponse(status_code=status.HTTP_200_OK, content=f"Тайтл '{title.title}' удален из слайдера.")


@admin_router.patch("/update-title", summary="Обновить информацию о тайтле")
async def update_title(
        data: schemas.UpdateTitle,
        session: AsyncSession = Depends(get_async_session)
):
    data_dict = data.model_dump(exclude_none=True)
    genres = data_dict.pop("genres")

    if genres:
        for genre in genres:
            await crud.update(
                session=session,
                table=main_table.GenresAnimeTable,
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
    anime_log.info("Для '%s' были обновлены следующие поля: %s", data.title, data_dict)
    return JSONResponse(status_code=status.HTTP_200_OK, content="Данные обновлены.")


@admin_router.patch("/update-schedules", summary="Обновить расписание выхода эпизодов")
async def update_schedules(
        data: schemas.UpdateSchedules,
        session: AsyncSession = Depends(get_async_session)
):
    data_dict = data.model_dump(exclude_none=True)
    title = data_dict.pop("title")

    if data_dict.get("day_week"):
        print("Проверка на день недели")

    for item in data_dict["item"]:
        update_fild = item.pop("update_fild")
        await crud.update(
            session=session,
            table=main_table.ScheduleTable,
            title=title,
            data=item,
            **{update_fild: item[update_fild]}
        )

    anime_log.info("Для '%s' обновлено расписание выхода серий.", data.title)
    return JSONResponse(status_code=status.HTTP_200_OK, content="Расписание обновлено.")


@admin_router.delete("/delete-title", summary="Удалить тайтл")
async def delete_title(title: schemas.Title, session: AsyncSession = Depends(get_async_session)):
    await crud.delite(session=session, table=main_table.ImgTable, title=title.title)
    await session.commit()
    anime_log.info("Тайтл '%s' удален", title.title)
    return JSONResponse(status_code=status.HTTP_200_OK, content=f"Тайтл '{title.title}' удален.")


@admin_router.delete("/delete-relation-title", summary="Удалить связать продолжения с тайтлом")
async def delete_relation_title(
        data: schemas.RelationTitle,
        session: AsyncSession = Depends(get_async_session)
):
    await crud.delite(
        session=session,
        table=main_table.RelationAnime,
        title=data.title,
        relation_title=data.relation_title
    )
    await session.commit()
    anime_log.info("Удаление связи между %s и %s", data.title, data.relation_title)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=f"Связь между '{data.title}' и '{data.relation_title}' разрушена."
    )


@admin_router.delete("/delete-episode", summary="Удалить эпизод")
async def delete_episode(
        data: schemas.DeleteEpisode,
        session: AsyncSession = Depends(get_async_session)
):
    for episode in data.episode_list:
        await crud.delite(
            session=session,
            table=main_table.EpisodeTable,
            title=data.title,
            episode_number=episode.episode_number
        )
    await session.commit()
    anime_log.info("Удаление эпизода(ов): %s для %s", data.episode_list, data.title)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=f"Удаление эпизода(ов): {data.episode_list} для {data.title}"
    )


@admin_router.delete("/delete-schedules", summary="Удалить расписание")
async def delete_schedules(data: schemas.DeleteSchedules, session: AsyncSession = Depends(get_async_session)):
    await crud.delite(session=session, table=main_table.ScheduleTable, title=data.title)
    anime_log.info("Удаление расписания для %s", data.title)
    return JSONResponse(status_code=status.HTTP_200_OK, content="Расписание удалено")


@admin_router.get("/api-list", summary="Получить список api")
async def get_api_list():
    return FileResponse("./src/app/admin/admin_api.json")
