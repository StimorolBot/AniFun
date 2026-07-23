import re

import regex
from pydantic import ValidatorFunctionWrapHandler, WrapValidator
from typing_extensions import Annotated


def valid_pattern_text(text: str, _: ValidatorFunctionWrapHandler):
    pattern = regex.compile(
        r"^[\p{L}\p{N}][\p{L}\p{N}\p{M} .,'"":;!?()&+\-/☆★×ー・―]*$"
    )

    if not pattern.fullmatch(text):
        raise ValueError("Поле содержит недопустимые символы")

    return text


def valid_len(val: str, min_val: int, max_val: int, field: str | None = None):
    if len(val) < min_val or len(val) > max_val:
        raise ValueError(
            f"Поле {f"'{field}'" if field else ""} должно быть в пределах "
            f"от {min_val} до {max_val} символов."
        )


def text_validator(min_val: int, max_val: int):
    def validator(
            value: str,
            handler: ValidatorFunctionWrapHandler,
    ) -> str:
        text = value.strip()
        valid_len(text, min_val, max_val)
        valid_pattern_text(text, handler)
        return value

    return validator


def valid_alias(alias: str, _: ValidatorFunctionWrapHandler):
    valid_len(alias, 5, 150)

    if not re.match("^[a-zA-Z0-9][a-zA-Z0-9_-]*$", alias):
        raise ValueError("Некорректный алиас.")
    return alias


def description_validator(
    description: str,
    _: ValidatorFunctionWrapHandler,
) -> str:
    description = description.strip()

    valid_len(description, 10, 1000)
    pattern = regex.compile(
        r'^[\p{L}\p{N}][\p{L}\p{N}\p{M} .,\'":;!?()&+\-/☆★×ー・―]*$'
    )

    for line in description.splitlines():
        line = line.strip()

        if not line:
            continue

        if not pattern.fullmatch(line):
            raise ValueError("Поле содержит недопустимые символы")

    return description

# pylint: disable=too-few-public-methods
class ValidText:

    @classmethod
    def __class_getitem__(cls, item):
        min_val, max_val = item
        return Annotated[str, WrapValidator(text_validator(min_val, max_val))]


ValidAlias = Annotated[str, WrapValidator(valid_alias)]
ValidDescription = Annotated[str, WrapValidator(description_validator)]
