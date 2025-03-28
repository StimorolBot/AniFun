import string
import secrets
from uuid import uuid4
from datetime import datetime, UTC


def generate_uuid() -> str:
    return uuid4().hex


def get_unc_now(f: str = "%d-%m-%Y, %H:%M:%S") -> datetime:
    date_str = datetime.now(UTC).strftime(f)
    return datetime.strptime(date_str, f)


def generate_code(code_len: int = 8) -> str:
    letters_and_digits = string.ascii_letters + string.digits + "_" + "-"
    return ''.join(secrets.choice(letters_and_digits) for _ in range(code_len))
