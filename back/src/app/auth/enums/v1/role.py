from enum import Enum


class Role(Enum):
    SUPERUSER = "superuser"
    ADMIN = "admin"
    MODERATOR = "moderator"
    USER = "user"
