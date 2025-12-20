from enum import Enum


class SeasonValue(Enum):
    WINTER = "winter"
    SPRING = "spring"
    SUMMER = "summer"
    AUTUMN = "autumn"


class SeasonLabel(Enum):
    WINTER = "зима"
    SPRING = "весна"
    SUMMER = "лето"
    AUTUMN = "осень"


class Season(Enum):
    WINTER = {"value": SeasonValue.WINTER.value, "label": SeasonLabel.WINTER.value}
    SPRING = {"value": SeasonValue.SPRING.value, "label": SeasonLabel.SPRING.value}
    SUMMER = {"value": SeasonValue.SUMMER.value, "label": SeasonLabel.SUMMER.value}
    AUTUMN = {"value": SeasonValue.AUTUMN.value, "label": SeasonLabel.AUTUMN.value}
