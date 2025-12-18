from enum import Enum


class TypeLabel(Enum):
    TV = "тв сериал"
    OVA = "ova"
    ONA = "ona"
    FILM = "фильм"
    SPECIAL = "спешл"


class TypeValue(Enum):
    TV = "tv"
    OVA = "ova"
    ONA = "ona"
    FILM = "film"
    SPECIAL = "special"


class Type(Enum):
    TV = {"value": TypeValue.TV.value, "label": TypeLabel.TV.value}
    OVA = {"value": TypeValue.OVA.value, "label": TypeLabel.OVA.value}
    ONA = {"value": TypeValue.ONA.value, "label": TypeLabel.ONA.value}
    FILM = {"value": TypeValue.FILM.value, "label": TypeLabel.FILM.value}
    SPECIAL = {"value": TypeValue.SPECIAL.value, "label": TypeLabel.SPECIAL.value}
