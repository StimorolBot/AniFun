from enum import Enum


class RestrictValue(Enum):
    G = "g"
    PG = "pg"
    PG_13 = "pg-13"
    NC_17 = "nc-17"
    R = "r"


class RestrictLabel(Enum):
    G = "0+"
    PG = "6+"
    PG_13 = "12+"
    NC_17 = "16+"
    R = "18+"


class Restrict(Enum):
    G = {"value": RestrictValue.G.value, "label": RestrictLabel.G.value}
    PG = {"value": RestrictValue.PG.value, "label": RestrictLabel.PG.value}
    PG_13 = {"value": RestrictValue.PG_13.value, "label": RestrictLabel.PG_13.value}
    NC_17 = {"value": RestrictValue.NC_17.value, "label": RestrictLabel.NC_17.value}
    R = {"value": RestrictValue.R.value, "label": RestrictLabel.R.value}
