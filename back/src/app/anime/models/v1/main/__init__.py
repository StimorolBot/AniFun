from src.app.anime.models.v1.main.anime import AnimeTable
from src.app.anime.models.v1.main.comment import (CommentTable,
                                                  ResponseCommentTable)
from src.app.anime.models.v1.main.episode import EpisodeTable
from src.app.anime.models.v1.main.genres_anime import GenresTable
from src.app.anime.models.v1.main.img import BannerTable, PosterTable
from src.app.anime.models.v1.main.rating import RatingTable
from src.app.anime.models.v1.main.release_day import ReleaseDayTable
from src.app.anime.models.v1.main.schedule import ScheduleTable
from src.app.anime.models.v1.main.sequel_anime import SequelTable

__all__ = (
    AnimeTable, PosterTable,
    EpisodeTable, GenresTable,
    ScheduleTable, SequelTable,
    RatingTable, CommentTable,
    ResponseCommentTable,
    ReleaseDayTable, BannerTable
)
