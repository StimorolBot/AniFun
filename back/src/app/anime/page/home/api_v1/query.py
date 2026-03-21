from sqlalchemy import Select, select
from sqlalchemy.orm import selectinload

from src.app.anime.models.v1 import main as main_table


def query_main_info(*args) -> Select:
    return (
        select(main_table.AnimeTable, *args)
        .options(selectinload(main_table.AnimeTable.type_rs))
        .join(main_table.AnimeTable.type_rs)
        .options(selectinload(main_table.AnimeTable.age_restrict_rs))
        .join(main_table.AnimeTable.age_restrict_rs)
        .options(selectinload(main_table.AnimeTable.status_rs))
        .join(main_table.AnimeTable.status_rs)
        .options(selectinload(main_table.AnimeTable.season_rs))
        .join(main_table.AnimeTable.season_rs)
        .options(selectinload(main_table.AnimeTable.genres_rs))
        .join(main_table.AnimeTable.genres_rs)
    )
