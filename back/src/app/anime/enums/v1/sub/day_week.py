from enum import Enum


class DayWeekValue(Enum):
    MONDAY = "monday"
    TUESDAY = "tuesday"
    WEDNESDAY = "wednesday"
    THURSDAY = "thursday"
    FRIDAY = "friday"
    SATURDAY = "saturday"
    SUNDAY = "sunday"
    COMPLETED = "completed"


class DayWeekLabel(Enum):
    MONDAY = "понедельник"
    TUESDAY = "вторник"
    WEDNESDAY = "среда"
    THURSDAY = "четверг"
    FRIDAY = "пятница"
    SATURDAY = "суббота"
    SUNDAY = "воскресенье"
    COMPLETED = "вышел"


class DayWeek(Enum):
    MONDAY = {"value": DayWeekValue.MONDAY.value, "label": DayWeekLabel.MONDAY.value}
    TUESDAY = {"value": DayWeekValue.TUESDAY.value, "label": DayWeekLabel.TUESDAY.value}
    WEDNESDAY = {"value": DayWeekValue.WEDNESDAY.value, "label": DayWeekLabel.WEDNESDAY.value}
    THURSDAY = {"value": DayWeekValue.THURSDAY.value, "label": DayWeekLabel.THURSDAY.value}
    FRIDAY = {"value": DayWeekValue.FRIDAY.value, "label": DayWeekLabel.FRIDAY.value}
    SATURDAY = {"value": DayWeekValue.SATURDAY.value, "label": DayWeekLabel.SATURDAY.value}
    SUNDAY = {"value": DayWeekValue.SUNDAY.value, "label": DayWeekLabel.SUNDAY.value}
    COMPLETED = {"value": DayWeekValue.COMPLETED.value, "label": DayWeekLabel.COMPLETED.value}
