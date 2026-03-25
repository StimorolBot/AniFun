import json
from contextlib import asynccontextmanager

from aiobotocore.session import get_session
from botocore.exceptions import ClientError
from fastapi import HTTPException, UploadFile, status

from src.minio.abc_model.s3_client import S3ClientAbc
from src.minio.config import settings
from src.utils.logger import s3_log


class S3Client(S3ClientAbc):
    def __init__(
            self,
            access_key: str,
            secret_key: str,
            endpoint_url: str,
    ):
        self.config = {
            "aws_access_key_id": access_key,
            "aws_secret_access_key": secret_key,
            "endpoint_url": endpoint_url,
            "region_name": "us-west-2"
        }
        self.session = get_session()

    @asynccontextmanager
    async def get_client(self):
        async with self.session.create_client("s3", **self.config) as client:
            yield client

    async def upload_file(
            self,
            file: UploadFile,
            file_name: str,
            bucket_name: str,
            content_type: str,
    ):
        try:
            async with self.get_client() as client:
                await client.put_object(
                    Bucket=bucket_name,
                    Key=file_name,
                    Body=file,
                    ContentType=content_type,

                )
        except ClientError as e:
            s3_log.error("При попытке загрузить файл возникла ошибка: %s", e)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Проверьте правильность написания имени бакета."
            ) from e

    async def get_file_metadata(self, bucket_name: str, file_name: str) -> dict:
        try:
            async with self.get_client() as client:
                file_data = await client.list_objects_v2(
                    Bucket=bucket_name,
                    Prefix=file_name
                )
                return file_data["Contents"][0]

        except ClientError as e:
            s3_log.error("При попытке прочитать файл возникла ошибка: %s", e)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Не удалось найти файл."
            ) from e

    async def get_url(self, bucket_name: str, file_name: str) -> str:
        async with self.get_client() as client:
            try:
                file_data = await client.list_objects_v2(
                    Bucket=bucket_name,
                    Prefix=file_name
                )
                return f"{settings.ENDPOINT_URL}/{bucket_name}/{file_data["Contents"][0]["Key"]}"
            except (ClientError, KeyError) as e:
                s3_log.warning("При попытке получить url возникла ошибка", e)
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Не удалось найти файл."
                )

    async def delete_file(self, bucket_name: str, uuid):
        async with self.get_client() as client:
            await client.delete_file(Bucket=bucket_name, Key=uuid)

    async def create_bucket(self, bucket_name: str):
        async with self.get_client() as client:
            await client.create_bucket(
                Bucket=bucket_name,
                CreateBucketConfiguration={
                    "LocationConstraint": "us-west-2"
                }
            )
            policy = {
                "Version": "2012-10-17",
                "Statement": [{
                    "Effect": "Allow",
                    "Principal": {"AWS": ["*"]},
                    "Action": ["s3:GetObject"],
                    "Resource": [f"arn:aws:s3:::{bucket_name}/*"]
                }]
            }
            await client.put_bucket_policy(
                Bucket=bucket_name,
                Policy=json.dumps(policy)
            )
        s3_log.info("Создание нового публичного бакета '%s'", bucket_name)

    async def copy_file(self, source_bucket: str, source_file_name: str, copy_bucket: str, copy_file_name: str):
        async with self.get_client() as client:
            await client.copy_object(
                Bucket=copy_bucket,
                Key=copy_file_name,
                CopySource={
                    "Bucket": source_bucket,
                    "Key": source_file_name
                }
            )
        s3_log.info(
            "Копирование файлов %s/%s -> %s/%s" %
            (source_bucket, source_file_name, copy_bucket, copy_file_name)
        )


s3_client = S3Client(
    access_key=settings.ACCESS_KEY,
    secret_key=settings.SECRET_KEY,
    endpoint_url=settings.ENDPOINT_URL,
)
