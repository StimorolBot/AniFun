from fastapi import Request
from asyncio import CancelledError
from aiobotocore.httpchecksum import StreamingChecksumBody


async def read_file_chunk(stream: StreamingChecksumBody, chunk_size: int = 4 * 1024 * 1024):
    try:
        async with stream:
            async for chunk in stream.iter_chunks(chunk_size=chunk_size):
                if chunk:
                    yield chunk
    except (CancelledError, RuntimeError):
        return


async def get_headers_params(request: Request, file_size: int) -> type:
    content_range = request.headers.get("range")
    start = 0
    end = file_size - 1

    if content_range:
        content_range = content_range.strip().lower().split("=")[-1]
        start_range, end_range = content_range.split("-")
        start = int(start_range) if start_range else 0
        end = int(end_range) if end_range else file_size - 1
        end = min(end, file_size - 1)

    return start, end, content_range
