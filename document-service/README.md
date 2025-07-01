## document-service
Le service de gestion documentaire permet de téléverser, consulter et supprimer des fichiers associés aux biens immobiliers. Les fichiers sont envoyés au format multipart via les APIs REST, puis stockés dans un bucket MinIO avec un nom normalisé. Les métadonnées de chaque document (nom, type, propriétaire, date) sont enregistrées dans PostgreSQL (via Prisma).
- Stack : Node.js + NestJS, Prisma ORM, PostgreSQL, MinIO (S3), Multer (pour le traitement des uploads), JWT pour sécuriser les endpoints.
- Installation : dans document-service/, lancez npm install et npm run start:dev.
- Configuration : .env doit contenir les informations MinIO (URL, clé, bucket, région) et la base de données.
- Exécution Docker : inclus dans docker-compose. Pour un test, docker-compose up document-service minio.
- Tests : npm test (Jest + Supertest pour les API).
