runCelery:
	cd ./src && celery -A celery_task.config:celery worker --loglevel=INFO --pool=solo

runFlower:runCelery
	cd ./src && celery -A celery_task.config:celery flower --loglevel=INFO
