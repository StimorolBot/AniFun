from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]


def add_middleware(app: FastAPI):
    app.add_middleware(SessionMiddleware, secret_key="some-random-string")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PATCH", "PUT"],
        allow_headers=[
            "Content-Type", "Set-Cookie", "Access-Control-Allow-Headers",
            "Access-Control-Allow-Origin", "Authorization", "Content-Length",
            "Range", "Content-Range", "Accept-Range", "Content-Encoding",
        ],
        expose_headers=[
            "Content-Type", "Range", "Content-Range", "Accept-Range",
            "Content-Encoding", "Content-Length", "Content-Encoding",
        ]
    )
