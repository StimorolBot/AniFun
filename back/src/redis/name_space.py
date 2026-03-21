from enum import Enum, IntEnum


class RedisNameSpace(Enum):
    # home page
    SLIDER = "slider"
    NEW_EPISODE = "new_episode"
    SCHEDULES = "schedules"
    FRANCHISES = "franchises"
    GENRES = "genres"

    # title page
    ABOUT_TITLE = "about_title"
    RECOMMEND_TITLE = "recommend_title"
    EPISODE_TITLE = "episode_title"
    SEQUEL = "sequel"
    SCHEDULE = "schedule"


class Expire(IntEnum):
    TWO = 120
    THREE = 180
