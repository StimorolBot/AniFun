from uuid import UUID

from pydantic import WrapValidator
from pydantic_core.core_schema import ValidatorFunctionWrapHandler
from typing_extensions import Annotated


def valid_uuid(value: UUID, _: ValidatorFunctionWrapHandler):
    return value.hex


ValidUUID = Annotated[UUID, WrapValidator(valid_uuid)]
