from fastapi import FastAPI

from src.app.admin.page.anime.api_v1.router import admin_anime_router
from src.app.admin.page.user.api_v1.router import admin_user_router
from src.app.anime.page.home.api_v1.router import home_router
from src.app.anime.page.release.api_v1.router import release_router
from src.app.anime.page.releases.api_v1.router import releases_router
from src.app.anime.page.releases.mini_app.comment.api_v1.router import \
    comment_router
from src.app.anime.page.releases.mini_app.rating.api_v1.router import \
    rating_router
from src.app.anime.page.video.api_v1.router import video_router
from src.app.auth.base.api_v1.router import auth_router
from src.app.auth.oauth.api_v1.router import oauth_router
from src.app.user.api_v1.router import user_router


def include_router(app: FastAPI):
    app.include_router(admin_anime_router)
    app.include_router(admin_user_router)

    app.include_router(auth_router)
    app.include_router(oauth_router)

    app.include_router(home_router)
    app.include_router(release_router)
    app.include_router(releases_router)

    app.include_router(comment_router)
    app.include_router(rating_router)

    app.include_router(video_router)

    app.include_router(user_router)
