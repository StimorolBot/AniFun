from enum import Enum, IntEnum


class RedisNameSpace(Enum):
    HOME_BANNER = "home:banner"
    HOME_EPISODE = "home:episode"
    HOME_SCHEDULE = "home:schedule"
    HOME_FRANCHISE = "home:franchise"
    HOME_GENRE = "home:genre"

    TITLE = "title"
    TITLE_EPISODE = "title:episode"
    TITLE_RECOMMEND = "title:recommend"
    TITLE_FRANCHISE = "title:franchise"
    TITLE_SCHEDULE = "title:schedule"
    TITLE_VOICE_TEAM = "title:voice_team"


class Expire(IntEnum):
    TWO_MINUTES = 120
    TEN_MINUTES = 600
    THIRTY_MINUTES = 1800
    ONE_HOUR = 3600
    THREE_HOURS = 10800
    ONE_DAY = 86400
