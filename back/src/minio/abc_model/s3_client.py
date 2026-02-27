from abc import ABC


class S3ClientAbc(ABC):

    @staticmethod
    async def get_client(*args, **kwargs):
        pass

    @staticmethod
    async def get_url(*args, **kwargs):
        pass

    @staticmethod
    async def create_bucket(*args, **kwargs):
        pass

    @staticmethod
    async def delete_bucket(*args, **kwargs):
        pass

    @staticmethod
    async def upload_file(*args, **kwargs):
        pass

    @staticmethod
    async def delete_file(*args, **kwargs):
        pass

    @staticmethod
    async def delete_all_file(*args, **kwargs):
        pass

    @staticmethod
    async def copy_file(*args, **kwargs):
        pass
