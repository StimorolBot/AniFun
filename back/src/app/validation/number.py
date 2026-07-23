from pydantic import WrapValidator
from pydantic_core.core_schema import ValidatorFunctionWrapHandler
from typing_extensions import Annotated


def number_validator(min_val: int, max_val: int):
    def validator(
            value: int,
            _: ValidatorFunctionWrapHandler,
    ) -> int:
        if min_val > int(value) or max_val < int(value):
            raise ValueError(f"Поле должно быть в пределах от {min_val} до {max_val}")
        return value

    return validator


class ValidNumber:

    @classmethod
    def __class_getitem__(cls, item):
        min_val, max_val = item
        return Annotated[int, WrapValidator(number_validator(min_val, max_val))]
