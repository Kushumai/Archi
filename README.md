# Archi
Projet de fin d'étude

docker build ../../backend -f ../../docker/dev/Dockerfile.backend -t test-backend

docker-compose --env-file ../../backend/.env -f docker-compose.dev.yml up --build
