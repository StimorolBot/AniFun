import os
import base64
import string
import secrets
from uuid import uuid4
from datetime import datetime, UTC

import aiofiles

from src.utils.file_manager import file_manager


def generate_uuid() -> str:
    return uuid4().hex


def get_unc_now(f: str = "%d-%m-%Y, %H:%M:%S") -> datetime:
    date_str = datetime.now(UTC).strftime(f)
    return datetime.strptime(date_str, f)


def generate_code(code_len: int = 8) -> str:
    letters_and_digits = string.ascii_letters + string.digits + "_" + "-"
    return ''.join(secrets.choice(letters_and_digits) for _ in range(code_len))


async def get_base64(path: str, is_save: bool = False) -> dict:
    data: dict = {}
    for dirpath, _, filenames in os.walk(path):
        for filename in filenames:
            try:
                async with aiofiles.open(f"{dirpath}\\{filename}", mode="rb") as file:
                    base64_file = base64.b64encode(await file.read())
                    data[filename.split(".")[0]] = base64_file.decode()
                    if is_save:
                        await file_manager.write(dirpath, "data.json", data)
            except FileNotFoundError:
                raise FileNotFoundError(f"Не удалось найти файл: '{filename}'")
    return data
