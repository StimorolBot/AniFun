from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config
from sqlalchemy import pool


from src.database.config import setting
from src.app.auth.api_v1.models.auth import AuthTable
from src.app.auth.api_v1.jwt.models.token import TokenTable
from src.model import Base

config = context.config
section = config.config_ini_section

config.set_section_option(section, "DB_HOST", setting.POSTGRES_HOST)
config.set_section_option(section, "DB_NAME", setting.POSTGRES_DB)
config.set_section_option(section, "DB_USER", setting.POSTGRES_USER)
config.set_section_option(section, "DB_PASS", setting.POSTGRES_PASSWORD)
config.set_section_option(section, "DB_PORT", setting.POSTGRES_PORT)

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
target_metadata = Base.metadata


# target_metadata = None

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


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
