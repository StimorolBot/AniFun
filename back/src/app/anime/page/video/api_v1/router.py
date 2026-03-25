from uuid import UUID

from fastapi import APIRouter, Depends,  Request, status
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.anime.models.v1 import main as main_table
from src.app.anime.page.video.api_v1 import schemas
from src.database.session import get_async_session
from src.minio.s3_client import s3_client
from src.utils.valid import ValidText
from src.app.anime.page.video.api_v1.utils import read_file_chunk, get_headers_params

video_router = APIRouter(prefix="/anime/videos", tags=["videos"])


@video_router.get(
    "/episode/episode-info/{uuid}",
    status_code=status.HTTP_200_OK,
    summary="Получить информацию о эпизоде",
    response_model=schemas.ResponseVideoInfoDTO
)
async def get_episode_info(
        uuid: UUID,
        session: AsyncSession = Depends(get_async_session)
):
    query = (
        select(
            main_table.EpisodeTable.title,
            main_table.EpisodeTable.number,
            main_table.EpisodeTable.name,
            main_table.PosterTable.poster_uuid,
            main_table.AnimeTable.uuid.label("title_uuid"),
        )
        .join(main_table.AnimeTable, main_table.EpisodeTable.title == main_table.AnimeTable.title)
        .join(main_table.PosterTable, main_table.PosterTable.title == main_table.AnimeTable.title)
        .filter(main_table.EpisodeTable.uuid == uuid)
    )
    result = await session.execute(query)
    return result.mappings().one()


@video_router.get("/episode/{bucket_name}/{uuid}")
async def stream_episode(uuid: UUID, bucket_name: ValidText[5, 150], request: Request):
    file_data = await s3_client.get_file_metadata(bucket_name=f"anime-{bucket_name}", file_name=uuid.hex)
    start, end, content_range = await get_headers_params(request, file_data["Size"])

    async def content_iter():
        async with s3_client.get_client() as client:
            params: dict = {
                "Bucket": f"anime-{bucket_name}",
                "Key": file_data["Key"],
            }
            if content_range:
                params["Range"] = f"bytes={start}-{end}"
            file = await client.get_object(**params)
            async for chunk in read_file_chunk(file["Body"]):
                yield chunk

    headers = {
        "Accept-Ranges": "bytes",
        "Content-Length": str((end - start + 1) if content_range else file_data["Size"]),
    }

    if content_range:
        headers["Content-Range"] = f"bytes {start}-{end}/{file_data['Size']}"

    return StreamingResponse(
        content=content_iter(),
        media_type="video/mp4",
        status_code=status.HTTP_206_PARTIAL_CONTENT if content_range else status.HTTP_200_OK,
        headers=headers
    )
