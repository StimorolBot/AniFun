from typing import List
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends, HTTPException, status

from src.utils.crud import crud
from src.utils.logger import anime_log
from src.database.session import get_async_session

from src.app.admin.anime.api_v1.enums import anime
from src.app.admin.anime.api_v1.schemas import AddEpisode

from src.app.anime.models.v1 import main as main_table
from src.app.admin.anime.api_v1.depends import content, img

admin_router = APIRouter(prefix="/admin/anime/add", tags=["admin"])


@admin_router.post("/title", description="Добавить новое аниме")
async def add_title(
        genres: List[anime.Genres],
        data_content: dict = Depends(content), img_data: dict = Depends(img),
        session: AsyncSession = Depends(get_async_session),
):
    try:
        create_data = await crud.create(session=session, table=main_table.AnimeTable, data=data_content)
        await session.flush()

        await crud.create(session=session, table=main_table.ImgTable, data={"uuid": create_data.uuid, **img_data})

        for genre in genres:
            await crud.create(
                session=session, table=main_table.GenresAnimeTable,
                data={"uuid": create_data.uuid, "genres": genre.value}
            )
        await session.commit()
        anime_log.info(f"Тайтл '{data_content["title"]}' добавлен")
        return JSONResponse(status_code=status.HTTP_201_CREATED, content=f"Тайтл '{data_content["title"]}' добавлен")
    except IntegrityError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Тайтл с таким именем уже существует")


@admin_router.post("/episode", description="Добавить новый эпизод")
async def add_episode(data: AddEpisode, session: AsyncSession = Depends(get_async_session)):
    await crud.create(session=session, table=main_table.EpisodeTable, data=data.model_dump())
    await session.commit()

    anime_log.info(f"Эпизод номер {data.episode} добавлен для тайтла '{data.title}'")
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=f"Эпизод номер {data.episode} добавлен для тайтла '{data.title}'"
    )
