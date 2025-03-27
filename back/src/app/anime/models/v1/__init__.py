from src.app.anime.models.v1.anime import AnimeTable
from src.app.anime.models.v1.studio import StudioTable
from src.app.anime.models.v1.type import TypeTable
from src.app.anime.models.v1.rating import RatingTable
from src.app.anime.models.v1.genres import GenresTable
from src.app.anime.models.v1.age_restrictions import AgeRestrictionsTable
from src.app.anime.models.v1.schedule import ScheduleTable
from src.app.anime.models.v1.season import SeasonTable
from src.app.anime.models.v1.status import StatusTable
from src.app.anime.models.v1.img import ImgTable

__all__ = [
    "AnimeTable", "StudioTable", "TypeTable",
    "ScheduleTable", "RatingTable", "GenresTable",
    "AgeRestrictionsTable", "SeasonTable", "StatusTable"
]
