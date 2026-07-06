from enum import StrEnum


class Status(StrEnum):
    ONGOING = "ongoing"
    COMPLETED = "completed"

    @property
    def label(self):
        return {
            "ongoing": "онгоинг",
            "completed": "вышел",
        }[self.value]
