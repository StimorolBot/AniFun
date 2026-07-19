from enum import StrEnum


class Season(StrEnum):
    WINTER = "winter"
    SPRING = "spring"
    SUMMER = "summer"
    AUTUMN = "autumn"

    @property
    def label(self):
        return {
            "winter": "зима",
            "spring": "весна",
            "summer": "лето",
            "autumn": "осень",

        }[self.value]
