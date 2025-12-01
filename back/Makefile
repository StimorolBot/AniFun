runCelery:
	cd ./src && celery -A celery_task.config:celery worker --loglevel=INFO --pool=solo

runFlower:runCelery
	cd ./src && celery -A celery_task.config:celery flower --loglevel=INFO

runServer:
	uvicorn main:app --reload

runAuthTest:
	pytest -vv -s tests/test_auth/api_v1/base/test_auth.py

runMigration:
	cd src && alembic revision --autogenerate -m "create_table" && alembic upgrade head

runAdminAnimeTest:
	pytest -vv -s tests/test_admin/anime/api_v1/test_admin.py

runOAuthTest:
	pytest -vv -s tests/test_auth/api_v1/oauth2/test_oauth2.py

createPylint:
	pylint --generate-rcfile | out-file -encoding utf8 .pylintrc

runIsort:
	isort ./

runPylint:
	pylint ./

runVulture:
	vulture ./

createPrivateToken:
	openssl genrsa -out jwt-private.pem 2048

createPublishToken:
	openssl rsa -in jwt-private.pem -outform PEM -pubout -out jwt-public.pem
