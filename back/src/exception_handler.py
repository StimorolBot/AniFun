from authlib.integrations.base_client.errors import OAuthError
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from src.utils.logger import server_log


def exception_handler(app: FastAPI):
    @app.exception_handler(status.HTTP_404_NOT_FOUND)
    def handler_page_not_found(request: Request, exp):
        server_log.debug("Не удалось найти страницу %s", request.url)
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content="Не удалось найти страницу."
        )

    @app.exception_handler(RequestValidationError)
    def handler_unprocessable_entity(request: Request, exc: RequestValidationError):
        server_log.warning("Необрабатываемая сущность: %s", exc)
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content="Не удалось обработать запрос."
        )

    @app.exception_handler(status.HTTP_405_METHOD_NOT_ALLOWED)
    def handler_method_not_allowed(request: Request, exp):
        server_log.warning("Метод не разрешен: %s", exp)
        return JSONResponse(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            content="Метод неразрешен."
        )

    @app.exception_handler(status.HTTP_500_INTERNAL_SERVER_ERROR)
    def handler_server_error(request: Request, exp):
        server_log.error("Ошибка сервера %s", exp)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content="Сервер временно недоступен, пожалуйста, повторите попытку позже."
        )

    @app.exception_handler(status.HTTP_503_SERVICE_UNAVAILABLE)
    def handler_service_unavailable(request: Request, exp):
        server_log.warning("Сервис временно недоступен: %s", exp)
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content="Сервис временно недоступен.\n"
                    "Пожалуйста, повторите попытку позже."
        )

    @app.exception_handler(OAuthError)
    def handler_oauth_error(request: Request, exp):
        server_log.warning("oauth error: %s", exp)
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content="Невалидный токен."
        )
