import json

from src.redis.config import redis
from src.redis.abs_model.redis import RedisAbs


class RedisManager(RedisAbs):

    @staticmethod
    async def get_value(key) -> dict | None:
        data_dict = await redis.get(key)
        if data_dict:
            return json.loads(data_dict)

    @staticmethod
    async def set_value(name, value: dict, ex: int | None = 30):
        value_str = json.dumps(value)
        await redis.set(name=name, value=value_str, ex=ex, nx=True)

    @staticmethod
    async def del_value(name: str):
        await redis.delete(name)


redis_manager = RedisManager()
