from abc import ABC


class RedisAbs(ABC):

    @staticmethod
    async def get_value(*args, **kwargs):
        pass

    @staticmethod
    async def set_value(*args, **kwargs):
        pass

    @staticmethod
    async def del_value(*args, **kwargs):
        pass
