from enum import StrEnum


class DayWeek(StrEnum):
    MONDAY = "monday"
    TUESDAY = "tuesday"
    WEDNESDAY = "wednesday"
    THURSDAY = "thursday"
    FRIDAY = "friday"
    SATURDAY = "saturday"
    SUNDAY = "sunday"
    COMPLETED = "completed"

    @property
    def label(self):
        return {
            "monday": "понедельник",
            "tuesday": "вторник",
            "wednesday": "среда",
            "thursday": "четверг",
            "friday": "пятница",
            "saturday" : "суббота",
            "sunday": "воскресенье",
            "completed": "вышел"

        }[self.value]
