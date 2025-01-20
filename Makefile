COMPOSE_DEV=docker-compose -f docker/dev/docker-compose.dev.yml
COMPOSE_PROD=docker-compose -f docker/prod/docker-compose.prod.yml

updev:
	$(COMPOSE_DEV) up --build

downdev:
	$(COMPOSE_DEV) down

upprod:
	$(COMPOSE_PROD) up --build

downprod:
	$(COMPOSE_PROD) down

logsdev:
	$(COMPOSE_DEV) logs -f

logsprod:
	$(COMPOSE_PROD) logs -f

rdev:
	downdev updev
rprod:
	downprod upprod

clean:
	docker system prune -af

status:
	docker ps -a