from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):

    @classmethod
    async def fill(cls, *args, **kwargs):
        raise BaseException("[!] Метод не переопределен")
