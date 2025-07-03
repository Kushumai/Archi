.PHONY: dev docker-dev staging prod down logs exec

dev:
	@echo "Démarrage de tous les services en mode DEV local (npm run dev)"
	cd frontend && npm run dev &
	cd auth-service && npm run start:dev &
	cd user-service && npm run start:dev &
	cd bff-service && npm run start:dev &
	cd document-service && npm run start:dev &

docker-dev:
	@echo "Démarrage de la stack Docker DEV local"
	docker compose up -d

staging:
	@echo "Démarrage de la stack STAGING (compose + override)"
	docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d

prod:
	@echo "Démarrage de la stack PROD (compose + prod)"
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

down:
	@echo "Arrêt de tous les containers"
	docker compose down

logs:
	@echo "Logs Docker en temps réel"
	docker compose logs -f

exec:
	@echo "Bash sur le container auth-service"
	docker compose exec auth-service bash
