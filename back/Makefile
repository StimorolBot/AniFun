runCelery:
	cd ./src && celery -A celery_task.config:celery worker --loglevel=INFO --pool=solo

runFlower:runCelery
	cd ./src && celery -A celery_task.config:celery flower --loglevel=INFO

runServer:
	uvicorn main:app --reload

runAuthTest:
	pytest -vv -s tests/test_auth/api_v1/base/test_auth.py
