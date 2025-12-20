from enum import Enum


class StatusValue(Enum):
    ONGOING = "ongoing"
    COMPLETED = "completed"


class StatusLabel(Enum):
    ONGOING = "онгоинг"
    COMPLETED = "вышел"


class Status(Enum):
    ONGOING = {"value": StatusValue.ONGOING.value, "label": StatusLabel.ONGOING.value}
    COMPLETED = {"value": StatusValue.COMPLETED.value, "label": StatusLabel.COMPLETED.value}
