from enum import StrEnum


class VoiceTeam(StrEnum):
    SUBTITLES = "subtitles"
    ANILIBERTY = "AniLiberty"
    STUDIO_BAND = "Studio Band"
    ANIME_VOST = "AnimeVost"
    DEEP = "DEEP"
    ANI_DUB = "AniDub"
    JAM_CLUB = "Jam Club"
    DREAM_CAST = "Dream Cast"
    ANI_FILM = "AniFilm"
    AMAZING_DUBBING = "Amazing Dubbing"
    SHIZA_PROJECT = "SHIZA Project"


    @property
    def label(self):
        return {
            "subtitles": "субтитры",
            "AniLiberty": "AniLiberty",
            "Studio Band": "Studio Band",
            "AnimeVost": "AnimeVost",
            "DEEP": "DEEP",
            "AniDub": "AniDub",
            "Jam Club": "Jam Club",
            "Dream Cast": "Dream Cast",
            "AniFilm": "AniFilm",
            "Amazing Dubbing": "Amazing Dubbing",
            "SHIZA Project": "SHIZA Project"
        }[self.value]
