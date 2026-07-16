from enum import StrEnum


class Genres(StrEnum):
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

    @property
    def label(self):
        return {
            "madness": "безумие",
            "martial-arts": "боевые искусства",
            "vampires": "вампиры",
            "military": "военное",
            "harem": "гарем",
            "demons": "демоны",
            "detective": "детектив",
            "children": "детское",
            "drama": "драма",
            "games": "игры",
            "historical": "исторический",
            "isekai": "исекай",
            "comedy": "комедия",
            "magic": "магия",
            "cars": "машины",
            "mexa": "меха",
            "music": "музыка",
            "parody": "пародия",
            "everyday-life": "повседневность",
            "adventures": "приключения",
            "psychological": "психологическое",
            "romance": "романтика",
            "supernatural": "сверхъестественное",
            "sport": "спорт",
            "super-power": "супер сила",
            "thriller": "триллер",
            "horrors": "ужасы",
            "fantasy": "фэнтези",
            "school": "школа",
            "action": "экшен",
            "etty": "этти",
        }[self.value]
