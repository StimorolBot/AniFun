from enum import StrEnum


class Type(StrEnum):
    TV = "tv"
    OVA = "ova"
    ONA = "ona"
    FILM = "film"
    SPECIAL = "special"

    @property
    def label(self):
        return {
            "tv": "тв сериал",
            "ova": "ova",
            "ona": "ona",
            "film": "фильм",
            "special": "спешл"
        }[self.value]
