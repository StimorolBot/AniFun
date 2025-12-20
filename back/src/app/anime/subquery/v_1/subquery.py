from uuid import UUID

from sqlalchemy import Select, Subquery, func, select

from src.app.anime.models.v1 import main as main_table


def subquery_rating(uuid: UUID | None, title: str) -> Subquery:
    """Получить рейтинг аниме, оставленный пользователем"""
    return (
        select(
            main_table.RatingTable.star.label("my_rating"),
            main_table.RatingTable.uuid
        )
        .filter_by(uuid=uuid, title=title)
        .subquery("my_rating_subquery")
    )


def subquery_rating_all_users(title: str) -> Select:
    """Получить рейтинг аниме"""
    return (
        select(
            func.count(main_table.RatingTable.title).label("total_count"),
            func.avg(main_table.RatingTable.star).label("avg"),
            main_table.RatingTable.title
        )
        .filter_by(title=title)
        .group_by(main_table.RatingTable.title)
    )


def subquery_get_avg_title():
    """Получить среднюю оценку аниме"""
    return (
        select(
            func.avg(main_table.RatingTable.star).label("avg"),
            main_table.RatingTable.title
        )
        .group_by(main_table.RatingTable.title)
        .subquery("subquery_get_avg_title")
    )
