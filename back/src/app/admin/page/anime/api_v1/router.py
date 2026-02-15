from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.admin.page.anime.api_v1 import schemas
from src.app.admin.page.anime.api_v1.query import (is_exist_record,
                                                   is_exist_title)
from src.app.admin.page.anime.api_v1.valid import (ValidVideo,
                                                   valid_episode_data)
from src.app.admin.utils import check_access, generate_alias, is_equals_day
from src.app.anime.enums.v1 import sub as sub_enum
from src.app.anime.models.v1 import main as main_table
from src.app.anime.models.v1.sub.genres import GenresSubTable
from src.database.session import get_async_session
from src.minio.s3_client import s3_client
from src.minio.s3_wrapper import delete_bucket, delete_file
from src.utils.crud import crud
from src.utils.logger import admin_log
from src.utils.utils import generate_uuid
from src.utils.valid import ValidText

admin_anime_router = APIRouter(
    prefix="/admin/anime",
    tags=["admin-anime"],
    dependencies=[Depends(check_access)]
)


@admin_anime_router.post("/create-title", summary="Создать тайтл")
async def create_title(
        data: schemas.AddTitle,
        session: AsyncSession = Depends(get_async_session),
):
    try:
        data_dict = data.model_dump()

        genres = data_dict.pop("genres")
        alias = generate_alias(data_dict["alias"]) \
            if data_dict.get("alias") \
            else generate_alias(data_dict.get("title"))

        stmt = await crud.create(
            session=session,
            table=main_table.AnimeTable,
            data={
                "title": data_dict["title"],
                "alias": alias,
                "year": data_dict["year"],
                "description": data_dict["description"],
                "total_episode": data_dict["total_episode"],
                "is_origin": data_dict["is_origin"],
                "type": data_dict["type"],
                "season": data_dict["season"],
                "age_restrict": data_dict["age_restrict"],
                "status": data_dict["status"]
            }
        )
        await session.flush()

        for genre in genres:
            await crud.create(
                session=session, table=main_table.GenresTable,
                data={
                    "title": data.title,
                    "label": genre["label"],
                    "value": genre["value"],
                    "alias": alias
                }
            )
        await s3_client.create_bucket(bucket_name=f"anime-{stmt.uuid.hex}")
        await session.commit()

        admin_log.info("Тайтл '%s' создан", data.title)

        return JSONResponse(status_code=status.HTTP_201_CREATED, content=f"Тайтл '{data.title}' создан.")
    except IntegrityError as e:
        await session.rollback()
        admin_log.warning("При попытке создать тайтл произошла ошибка: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не удалось создать тайтл. Возможно, тайтл с таким именем уже существует."
        ) from e


@admin_anime_router.patch("/update-title", summary="Обновить информацию о тайтле")
async def update_title(
        data: schemas.UpdateTitle,
        session: AsyncSession = Depends(get_async_session)
):
    try:
        data_dict = data.model_dump(exclude_none=True)
        if len(data_dict) <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Недостаточно данных для обновления."
            )

        title = data_dict.pop("old_title_name")
        old_data = await is_exist_title(
            table=main_table.AnimeTable,
            session=session,
            title=title
        )

        genres = data_dict.pop("genres", None)
        if genres:
            for genre in genres:
                await crud.update(
                    session=session,
                    table=main_table.GenresTable,
                    title=old_data.title,
                    data=genre
                )
        await session.flush()

        if data_dict.get("new_title_name"):
            data_dict["alias"] = generate_alias(data_dict["alias"]) \
                if data_dict.get("alias") \
                else generate_alias(data_dict.get("new_title_name"))

        await crud.update(
            session=session,
            table=main_table.AnimeTable,
            title=data_dict.pop("new_title_name")
            if data_dict.pop("new_title_name", None) is not None
            else title,
            data=data_dict
        )
        await session.commit()
        admin_log.info("Для '%s' были обновлены следующие поля: %s", data.old_title_name, data_dict)
        return JSONResponse(status_code=status.HTTP_200_OK, content="Данные обновлены.")
    except IntegrityError as e:
        admin_log.warning("Не удалось обновить тайтл: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не удалось обновить тайтл так как имеются повторяющееся значения."
        )


@admin_anime_router.delete("/delete-title", summary="Удалить тайтл")
async def delete_title(
        title: ValidText[3, 150],
        session: AsyncSession = Depends(get_async_session)
):
    data = await is_exist_title(table=main_table.AnimeTable, session=session, title=title)

    await delete_bucket(
        bucket_name=data.uuid.hex,
        session=session,
        table=main_table.AnimeTable,
        title=title
    )
    admin_log.info("Тайтл '%s' удален", title)
    return JSONResponse(status_code=status.HTTP_200_OK, content=f"Тайтл '{title}' удален.")


@admin_anime_router.post("/add-banner", summary="Добавить банер")
async def add_banner(
        title: ValidText[3, 150],
        file: UploadFile = File(...),
        session: AsyncSession = Depends(get_async_session)
):
    try:
        file_data = file.file.read()
        schemas.ValidImg(
            content_type=file.content_type,
            data=file_data
        )
        exist_title = await is_exist_title(table=main_table.AnimeTable, session=session, title=title)
        if await crud.read(session=session, table=main_table.BannerTable, title=title):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Для тайтла '{title}' уже установлен баннер."
            )

        uuid_banner = generate_uuid()

        await s3_client.upload_file(
            file=file_data,
            file_name=f"{uuid_banner}.{file.filename.split(".")[-1]}",
            bucket_name=f"anime-{exist_title.uuid.hex}",
            content_type=file.content_type,
        )

        await crud.create(
            session=session,
            table=main_table.BannerTable,
            data={"uuid_banner": uuid_banner, "title": title}
        )
        await session.commit()
        admin_log.info("Добавлен банер '%s,' для '%s'", uuid_banner, title)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content=f"Добавлен банер '{uuid_banner}' для {title}"
        )
    except IntegrityError as e:
        admin_log.warning("При попытке добавить баннер возникла ошибка: '%s'", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не удалось добавить баннер. Пожалуйста, проверьте название тайтла."
        ) from e


@admin_anime_router.patch("/update-banner", summary="Обновить банер")
async def update_banner(
        title: ValidText[3, 150],
        file: UploadFile = File(...),
        session: AsyncSession = Depends(get_async_session)
):
    try:
        file_data = file.file.read()
        schemas.ValidImg(
            content_type=file.content_type,
            data=file_data
        )
        exist_banner = await is_exist_record(
            session=session,
            table_join=main_table.BannerTable,
            second_feld=main_table.BannerTable.uuid_banner.label("uuid_banner"),
            title=title
        )

        uuid_banner = exist_banner.uuid_banner.hex
        await s3_client.upload_file(
            file=file_data,
            file_name=f"{uuid_banner}.{file.filename.split(".")[-1]}",
            bucket_name=f"anime-{exist_banner.uuid_title.hex}",
            content_type=file.content_type,
        )

        admin_log.info("Обновлен банер '%s,' для '%s'", uuid_banner, title)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=f"Добавлен банер {uuid_banner},' для {title}"
        )
    except AttributeError as e:
        admin_log.warning("Попытка обновить банер у несуществующего тайла: '%s'", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Не удалось обновить банер для '{title}'. Пожалуйста, проверьте название тайтал."
        ) from e


@admin_anime_router.delete("/delete-banner", summary="Удалить баннер")
async def delete_banner(
        title: ValidText[3, 150],
        session: AsyncSession = Depends(get_async_session)
):
    try:
        exist_banner = await is_exist_record(
            session=session,
            table_join=main_table.BannerTable,
            second_feld=main_table.BannerTable.uuid_banner.label("uuid_banner"),
            title=title
        )
        uuid_banner = exist_banner.uuid_banner.hex

        await delete_file(
            bucket_name=f"anime-{exist_banner.uuid_title.hex}",
            session=session,
            table=main_table.BannerTable,
            file_name=uuid_banner,
            uuid_banner=uuid_banner
        )
        admin_log.info("Удаление банера '%s', для '%s'", uuid_banner, title)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=f"Удаление банера '{uuid_banner}' для '{title}'"
        )
    except AttributeError as e:
        admin_log.warning("Не удалось удалить баннер: '%e'", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Не удалось удалить банер для '{title}'. Пожалуйста, проверьте название тайтал."
        ) from e


@admin_anime_router.post(
    "/add-poster-title",
    summary="Добавить постер к тайтлу"
)
async def add_poster_title(
        title: ValidText[3, 150],
        file: UploadFile = File(...),
        session: AsyncSession = Depends(get_async_session),
        poster_uuid: str = Depends(generate_uuid)
):
    file_data = file.file.read()
    schemas.ValidImg(
        content_type=file.content_type,
        data=file_data
    )

    exist_title = await is_exist_title(table=main_table.AnimeTable, session=session, title=title)
    if await crud.read(session=session, table=main_table.PosterTable, title=title):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Для тайтла '{title}' уже установлен постер."
        )

    await s3_client.upload_file(
        file=file_data,
        file_name=f"{poster_uuid}.{file.filename.split(".")[-1]}",
        bucket_name=f"anime-{exist_title.uuid.hex}",
        content_type=file.content_type,
    )
    await crud.create(
        session=session,
        table=main_table.PosterTable,
        data={"poster_uuid": poster_uuid, "title": title}
    )
    await session.commit()

    admin_log.info("Для тайтла '%s' был добавлен постер '%s' " % (title, poster_uuid))
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content="Постер добавлен."
    )


@admin_anime_router.patch(
    "/update-poster-title",
    summary="Обновить постер к тайтлу"
)
async def update_poster_title(
        title: ValidText[3, 150],
        file: UploadFile = File(...),
        session: AsyncSession = Depends(get_async_session)
):
    file_data = file.file.read()
    schemas.ValidImg(
        content_type=file.content_type,
        data=file_data
    )
    exist_poster = await is_exist_record(
        session=session,
        table_join=main_table.PosterTable,
        second_feld=main_table.PosterTable.poster_uuid.label("poster_uuid"),
        title=title
    )
    uuid_poster = exist_poster.poster_uuid.hex
    await s3_client.upload_file(
        file=file_data,
        file_name=f"{uuid_poster}.{file.filename.split(".")[-1]}",
        bucket_name=f"anime-{exist_poster.uuid_title.hex}",
        content_type=file.content_type,
    )

    admin_log.info("Для тайтла '%s' был обновлен постер '%s' " % (title, uuid_poster))
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content="Постер обновлен."
    )


@admin_anime_router.post(
    "/add-poster-genres",
    summary="Добавить постер для жанра"
)
async def add_poster_genres(
        genres: sub_enum.genres.GenresLabel,
        file: UploadFile = File(...),
        session: AsyncSession = Depends(get_async_session),
):
    file_data = file.file.read()
    schemas.ValidImg(
        content_type=file.content_type,
        data=file_data
    )
    poster_data = await crud.read(
        session=session,
        table=GenresSubTable,
        label=genres.value
    )
    uuid_poster = poster_data.uuid_poster.hex \
        if poster_data.uuid_poster \
        else \
        generate_uuid()

    await s3_client.upload_file(
        file=file_data,
        file_name=f"{uuid_poster}.{file.filename.split(".")[-1]}",
        bucket_name="img-genres-poster",
        content_type=file.content_type,
    )
    await crud.update(
        session=session,
        table=GenresSubTable,
        data={"uuid_poster": uuid_poster},
        label=genres.value
    )
    await session.commit()

    admin_log.info("Добавлен постер '%s' для '%s'", uuid_poster, genres.value)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=f"Добавлен постер '{uuid_poster}' для {genres.value}"
    )


@admin_anime_router.post("/add-episode", summary="Добавить новый эпизод")
async def add_episode(
        file: UploadFile = File(...),
        data: dict = Depends(valid_episode_data),
        session: AsyncSession = Depends(get_async_session),
        uuid_episode: str = Depends(generate_uuid)
):
    try:
        file_data = file.file.read()
        ValidVideo(
            content_type=file.content_type,
            data=file_data
        )
        title = await is_exist_title(
            table=main_table.AnimeTable,
            session=session,
            title=data["title"]
        )
        await s3_client.upload_file(
            file=file_data,
            file_name=f"{uuid_episode}.{file.filename.split(".")[-1]}",
            bucket_name=f"anime-{title.uuid.hex}",
            content_type=file.content_type,
        )
        await crud.create(
            session=session,
            table=main_table.EpisodeTable,
            data={
                "title": data["title"],
                "uuid": uuid_episode,
                "number": data["episode_number"],
                "name": data["episode_name"]
            }
        )
        if data["is_schedule_exist"]:
            await crud.update(
                session=session,
                table=main_table.ScheduleTable,
                title=data["title"],
                episode_number=data["episode_number"],
                data={"episode_uuid": uuid_episode}
            )

        await session.commit()

        admin_log.info("Эпизод №%s добавлен для '%s'", data["episode_number"], data["title"])
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content=f"Эпизод {data["episode_number"]} добавлен для '{data["title"]}'"
        )
    except IntegrityError as e:
        admin_log.warning("При попытке добавить эпизод произошла ошибка: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="При попытке добавить новый эпизод произошла ошибка."
                   "Пожалуйста, проверьте название тайтла, "
                   "а так же наличие расписания выхода эпизодов."
        ) from e


@admin_anime_router.delete("/delete-episode", summary="Удалить эпизод")
async def delete_episode(
        data: schemas.DeleteEpisode,
        session: AsyncSession = Depends(get_async_session)
):
    episode_data = await is_exist_record(
        session=session,
        table_join=main_table.EpisodeTable,
        second_feld=main_table.EpisodeTable.uuid.label("uuid_episode"),
        number=data.episode_number,
        title=data.title
    )

    await delete_file(
        bucket_name=episode_data.uuid_title.hex,
        session=session,
        table=main_table.EpisodeTable,
        file_name=episode_data.uuid_episode,
        uuid=episode_data.uuid_episode,
    )

    admin_log.info("Эпизод №%s '%s'удален ", data.episode_number, data.title)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=f"Эпизод № {data.episode_number} '{data.title}' удален."
    )


@admin_anime_router.post("/add-sequel-title", summary="Указать продолжение для тайтла")
async def add_sequel_title(
        data: schemas.AddSequel,
        session: AsyncSession = Depends(get_async_session)
):
    title = await crud.read(session=session, table=main_table.AnimeTable, title=data.title)
    sequel_title = await crud.read(
        session=session,
        table=main_table.AnimeTable,
        title=data.sequel_title
    )
    try:
        if sequel_title.is_origin is True or title.is_origin is False or title.year > sequel_title.year:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Не удалось добавить продолжение f'{sequel_title.title}' для '{title.title}'"
            )
        await crud.create(session=session, table=main_table.SequelTable, data=data.model_dump())
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
            detail=f"'{data.sequel_title}' и '{data.title}' уже связаны"
        ) from e
    except AttributeError as e:
        admin_log.warning("При попытке добавить продолжение возникла ошибка %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Не удалось добавить продолжение '{data.title}' для '{data.sequel_title}'"
        ) from e


@admin_anime_router.delete("/delete-relation-title", summary="Удалить связать продолжения с тайтлом")
async def delete_relation_title(
        data: schemas.AddSequel,
        session: AsyncSession = Depends(get_async_session)
):
    await is_exist_title(
        table=main_table.SequelTable,
        session=session,
        title=data.title,
        sequel_title=data.sequel_title
    )
    await crud.delite(
        session=session,
        table=main_table.SequelTable,
        title=data.title,
        sequel_title=data.sequel_title
    )
    await session.commit()
    admin_log.info("Удаление связи между %s и %s", data.title, data.sequel_title)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=f"Связь между '{data.title}' и '{data.sequel_title}' разрушена."
    )


@admin_anime_router.post("/set-schedules", summary="Установить расписание выхода эпизодов")
async def set_schedules(data: schemas.SetSchedules, session: AsyncSession = Depends(get_async_session)):
    await is_exist_title(session=session, table=main_table.AnimeTable, title=data.title)
    try:
        for item in data.item:
            is_equals_day(data.day_week["value"], item.date.strftime("%A").lower())
            await crud.create(
                session=session,
                table=main_table.ScheduleTable,
                data={
                    "title": data.title,
                    "date_release": item.date,
                    "episode_number": item.episode_number,
                    "episode_name": item.episode_name
                }
            )

        if data.is_extend is False:
            await crud.create(
                session=session,
                table=main_table.ReleaseDayTable,
                data={
                    "title": data.title,
                    "value": data.day_week["value"],
                    "label": data.day_week["label"]
                }
            )
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content=f"Установлено расписание выхода серий для '{data.title}'."
        )
    except IntegrityError as e:
        admin_log.warning(
            "При при попытке установить расписание для '%s' возникла ошибка: %s",
            data.title, e
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="При попытке установить расписание произошла ошибка.\n"
                   "Пожалуйста, проверьте название и номер эпизода или повторите попытку позже"
        ) from e


@admin_anime_router.patch("/update-schedules", summary="Обновить расписание выхода эпизодов")
async def update_schedules(
        data: schemas.UpdateSchedules,
        session: AsyncSession = Depends(get_async_session)
):
    try:
        data_dict = data.model_dump(exclude_none=True)
        if len(data_dict) < 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Недостаточно данных для обновления расписания."
            )

        title = data_dict.pop("title")
        update_field = data_dict.pop("update_field")
        day_week = data_dict.pop("day_week", None)
        old_value = data_dict.pop("old_value")

        if update_field == "day_week":
            await is_exist_title(session=session, table=main_table.ReleaseDayTable, title=title)
            await crud.update(
                session=session,
                table=main_table.ReleaseDayTable,
                data={
                    "label": day_week["label"],
                    "value": day_week["value"]
                },
                title=title,
                label=old_value
            )
        else:
            await crud.update(
                session=session,
                table=main_table.ScheduleTable,
                title=title,
                data=data_dict,
                **{update_field: old_value}
            )
        await session.commit()
        admin_log.info("Для '%s' обновлено расписание выхода серий.", data.title)
        return JSONResponse(status_code=status.HTTP_200_OK, content="Расписание обновлено.")

    except AttributeError as e:
        admin_log.warning("Не удалось обновить расписание для '%s': %s" % (data.title, e))
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Не удалось найти татйл с именем {data.title}"
        ) from e
    except IntegrityError as e:
        admin_log.warning(
            "Не удалось обновить расписание так как поле %s имеет повторяющиеся значение: %s" % (data.update_field, e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Не удалось обновить расписание так как поле {data.update_field} имеет повторяющиеся значение."
        ) from e


@admin_anime_router.delete("/delete-schedules", summary="Удалить расписание")
async def delete_schedules(data: schemas.DeleteSchedules, session: AsyncSession = Depends(get_async_session)):
    await is_exist_title(table=main_table.ReleaseDayTable, session=session, title=data.title)
    await crud.delite(session=session, table=main_table.ScheduleTable, title=data.title)
    await crud.delite(session=session, table=main_table.ReleaseDayTable, title=data.title)
    await session.commit()
    admin_log.info("Удаление расписания для %s", data.title)
    return JSONResponse(status_code=status.HTTP_200_OK, content="Расписание удалено")


@admin_anime_router.delete("/delete-schedules-item", summary="Удалить эпизод из расписания")
async def delete_schedules_item(data: schemas.DeleteSchedulesItem, session: AsyncSession = Depends(get_async_session)):
    await is_exist_title(table=main_table.ReleaseDayTable, session=session, title=data.title)
    await crud.delite(
        session=session,
        table=main_table.ScheduleTable,
        title=data.title,
        episode_number=data.episode_number
    )
    await session.commit()
    admin_log.info("Эпизод № %s был удален из расписания для %s" % (data.episode_number, data.title))
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=f"Эпизод № {data.episode_number} был удален из расписания для '{data.title}'"
    )
