from enum import StrEnum


class Restrict(StrEnum):
    G = "g"
    PG = "pg"
    PG_13 = "pg_13"
    NC_17 = "nc_17"
    R = "r"

    @property
    def label(self):
        return {
            "g": "0+",
            "pg": "6+",
            "pg_13": "12+",
            "nc_17": "16+",
            "r": "18+"
        }[self.value]
