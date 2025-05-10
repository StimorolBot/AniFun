from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config
from sqlalchemy import pool

# миграция таблиц
# cd src
# alembic revision --autogenerate -m "create_token_table"
# alembic upgrade head

from src.app.auth.models.v1.main.auth import AuthTable
from src.app.auth.models.v1.sub.auth_type import AuthTypeTable

from src.app.anime.models.v1.main.anime import AnimeTable
from src.app.anime.models.v1.sub.status import StatusTable

from src.database.config import setting

from src.model import Base

config = context.config
section = config.config_ini_section

config.set_section_option(section, "DB_HOST", setting.POSTGRES_HOST)
config.set_section_option(section, "DB_NAME", setting.POSTGRES_DB)
config.set_section_option(section, "DB_USER", setting.POSTGRES_USER)
config.set_section_option(section, "DB_PASS", setting.POSTGRES_PASSWORD)
config.set_section_option(section, "DB_PORT", setting.POSTGRES_PORT)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
