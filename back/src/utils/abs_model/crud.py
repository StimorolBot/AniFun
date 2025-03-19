from abc import ABC


class CrudAbs(ABC):
    async def create(self, *args, **kwargs):
        pass

    async def read(self, *args, **kwargs):
        pass

    async def update(self, *args, **kwargs):
        pass

    async def delite(self, *args, **kwargs):
        pass
