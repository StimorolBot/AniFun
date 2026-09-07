from abc import ABC


class S3ClientAbc(ABC):

    @staticmethod
    async def get_client(*args, **kwargs):
        pass

    @staticmethod
    async def get_object_metadata(*args, **kwargs):
        pass

    @staticmethod
    async def upload_object(*args, **kwargs):
        pass

    @staticmethod
    async def create_bucket(*args, **kwargs):
        pass

    @staticmethod
    async def copy_object(*args, **kwargs):
        pass

    @staticmethod
    async def delete_object(*args, **kwargs):
        pass

    @staticmethod
    async def delete_all_object(*args, **kwargs):
        pass

    @staticmethod
    async def delete_bucket(*args, **kwargs):
        pass
