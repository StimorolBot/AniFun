from src.app.anime.models.v1.main.anime import AnimeTable
from src.app.anime.models.v1.main.comment import (CommentTable,
                                                  ResponseCommentTable)
from src.app.anime.models.v1.main.episode import EpisodeTable
from src.app.anime.models.v1.main.genres_anime import GenresTable
from src.app.anime.models.v1.main.img import ImgTable
from src.app.anime.models.v1.main.rating import RatingTable
from src.app.anime.models.v1.main.relation_anime import RelationAnime
from src.app.anime.models.v1.main.release_day import ReleaseDayTable
from src.app.anime.models.v1.main.schedule import ScheduleTable

__all__ = (
    AnimeTable, ImgTable,
    EpisodeTable, GenresTable,
    ScheduleTable, RelationAnime,
    RatingTable, CommentTable,
    ResponseCommentTable,
    ReleaseDayTable
)
