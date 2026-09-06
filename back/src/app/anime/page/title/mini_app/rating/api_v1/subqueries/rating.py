from uuid import UUID

from sqlalchemy import (Numeric, ScalarSelect, Subquery, and_, cast, func,
                        select)

from src.app.anime.models.v1 import main as main_table


def my_rating(user_uuid: UUID | None, title_uuid: UUID) -> ScalarSelect:
    """Получить мою оценку тайтла"""
    return (
        select(
            main_table.RatingTable.star,
        )
        .where(
            and_(
                main_table.RatingTable.user_uuid == user_uuid,
                main_table.RatingTable.title_uuid == title_uuid
            )
        )
        .scalar_subquery()
    )


def rating_title(**kwargs) -> Subquery:
    """Получить общую статистику рейтинга тайтла."""
    return (
        select(
            main_table.RatingTable.title_uuid,
            func.count(main_table.RatingTable.title_uuid).label("total_count"),
            func.round(func.avg(main_table.RatingTable.star), 1).label("avg")
        )

        .filter_by(**kwargs)
        .group_by(main_table.RatingTable.title_uuid)
        .subquery("rating_title")
    )


def rating_distribution(title_uuid: UUID) -> Subquery:
    """Получить распределение оценок тайтла."""
    stmt = (
        select(
            main_table.RatingTable.star,
            func.count().label("count"),
            main_table.RatingTable.title_uuid,
            func.round(
                cast(
                    func.count() * 100.0
                    / func.sum(func.count()).over(),
                    Numeric,
                ),
                1,
            ).label("percentage"),
        )
        .where(
            main_table.RatingTable.title_uuid == title_uuid
        )
        .group_by(
            main_table.RatingTable.star,
            main_table.RatingTable.title_uuid,
        )
        .order_by(
            main_table.RatingTable.star.desc()
        )
    )

    return stmt.subquery("rating_distribution")
