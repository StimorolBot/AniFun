from enum import Enum


class GenresValue(Enum):
    MADNESS = "madness"
    MARTIAL_ARTS = "martial-arts"
    VAMPIRES = "vampires"
    MILITARY = "military"
    HAREM = "harem"
    DEMONS = "demons"
    DETECTIVE = "detective"
    CHILDREN = "children"
    DRAMA = "drama"
    GAMES = "games"
    HISTORICAL = "historical"
    ISEKAI = "isekai"
    COMEDY = "comedy"
    MAGIC = "magic"
    CARS = "cars"
    MEXA = "mexa"
    MUSIC = "music"
    PARODY = "parody"
    EVERYDAY_LIFE = "everyday-life"
    ADVENTURES = "adventures"
    PSYCHOLOGICAL = "psychological"
    ROMANCE = "romance"
    SUPERNATURAL = "supernatural"
    SPORT = "sport"
    SUPER_POWER = "super-power"
    THRILLER = "thriller"
    HORRORS = "horrors"
    FANTASY = "fantasy"
    SCHOOL = "school"
    ACTION = "action"
    ETTY = "etty"


class GenresLabel(Enum):
    MADNESS = "безумие"
    MARTIAL_ARTS = "боевые искусства"
    VAMPIRES = "вампиры"
    MILITARY = "военное"
    HAREM = "гарем"
    DEMONS = "демоны"
    DETECTIVE = "детектив"
    CHILDREN = "детское"
    DRAMA = "драма"
    GAMES = "игры"
    HISTORICAL = "исторический"
    ISEKAI = "исекай"
    COMEDY = "комедия"
    MAGIC = "магия"
    CARS = "машины"
    MEXA = "меха"
    MUSIC = "музыка"
    PARODY = "пародия"
    EVERYDAY_LIFE = "повседневность"
    ADVENTURES = "приключения"
    PSYCHOLOGICAL = "психологическое"
    ROMANCE = "романтика"
    SUPERNATURAL = "сверхъестественное"
    SPORT = "спорт"
    SUPER_POWER = "супер сила"
    THRILLER = "триллер"
    HORRORS = "ужасы"
    FANTASY = "фэнтези"
    SCHOOL = "школа"
    ACTION = "экшен"
    ETTY = "этти"


class Genres(Enum):
    MADNESS = {"value": GenresValue.MADNESS.value, "label": GenresLabel.MADNESS.value}
    MARTIAL_ARTS = {"value": GenresValue.MARTIAL_ARTS.value, "label": GenresLabel.MARTIAL_ARTS.value}
    VAMPIRES = {"value": GenresValue.VAMPIRES.value, "label": GenresLabel.VAMPIRES.value}
    MILITARY = {"value": GenresValue.MILITARY.value, "label": GenresLabel.MILITARY.value}
    HAREM = {"value": GenresValue.HAREM.value, "label": GenresLabel.HAREM.value}
    DEMONS = {"value": GenresValue.DEMONS.value, "label": GenresLabel.DEMONS.value}
    DETECTIVE = {"value": GenresValue.DETECTIVE.value, "label": GenresLabel.DETECTIVE.value}
    CHILDREN = {"value": GenresValue.CHILDREN.value, "label": GenresLabel.CHILDREN.value}
    DRAMA = {"value": GenresValue.DRAMA.value, "label": GenresLabel.DRAMA.value}
    GAMES = {"value": GenresValue.GAMES.value, "label": GenresLabel.GAMES.value}
    HISTORICAL = {"value": GenresValue.HISTORICAL.value, "label": GenresLabel.HISTORICAL.value}
    ISEKAI = {"value": GenresValue.ISEKAI.value, "label": GenresLabel.ISEKAI.value}
    COMEDY = {"value": GenresValue.COMEDY.value, "label": GenresLabel.COMEDY.value}
    MAGIC = {"value": GenresValue.MAGIC.value, "label": GenresLabel.MAGIC.value}
    CARS = {"value": GenresValue.CARS.value, "label": GenresLabel.CARS.value}
    MEXA = {"value": GenresValue.MEXA.value, "label": GenresLabel.MEXA.value}
    MUSIC = {"value": GenresValue.MUSIC.value, "label": GenresLabel.MUSIC.value}
    PARODY = {"value": GenresValue.PARODY.value, "label": GenresLabel.PARODY.value}
    EVERYDAY_LIFE = {"value": GenresValue.EVERYDAY_LIFE.value, "label": GenresLabel.EVERYDAY_LIFE.value}
    ADVENTURES = {"value": GenresValue.ADVENTURES.value, "label": GenresLabel.ADVENTURES.value}
    PSYCHOLOGICAL = {"value": GenresValue.PSYCHOLOGICAL.value, "label": GenresLabel.PSYCHOLOGICAL.value}
    ROMANCE = {"value": GenresValue.ROMANCE.value, "label": GenresLabel.ROMANCE.value}
    SUPERNATURAL = {"value": GenresValue.SUPERNATURAL.value, "label": GenresLabel.SUPERNATURAL.value}
    SPORT = {"value": GenresValue.SPORT.value, "label": GenresLabel.SPORT.value}
    SUPER_POWER = {"value": GenresValue.SUPER_POWER.value, "label": GenresLabel.SUPER_POWER.value}
    THRILLER = {"value": GenresValue.THRILLER.value, "label": GenresLabel.THRILLER.value}
    HORRORS = {"value": GenresValue.HORRORS.value, "label": GenresLabel.HORRORS.value}
    FANTASY = {"value": GenresValue.FANTASY.value, "label": GenresLabel.FANTASY.value}
    SCHOOL = {"value": GenresValue.SCHOOL.value, "label": GenresLabel.SCHOOL.value}
    ACTION = {"value": GenresValue.ACTION.value, "label": GenresLabel.ACTION.value}
    ETTY = {"value": GenresValue.ETTY.value, "label": GenresLabel.ETTY.value}
