from sqlalchemy import select, func, Subquery

from src.app.anime.models.v1.main.genres_anime import GenresAnimeTable


def subquery_genres() -> Subquery:
    """Подзапрос для создания списка с жанрами и группировкой их по title"""
    return (
        select(func.array_agg(GenresAnimeTable.genres).label("genres"), GenresAnimeTable.title)
        .group_by(GenresAnimeTable.title)
        .subquery("subquery_genres")
    )
