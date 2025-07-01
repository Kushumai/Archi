## user-service
Le service de gestion des utilisateurs gère les profils et les métadonnées utilisateur (prénom, nom, droits, etc.). Il reçoit l’ID utilisateur généré par l’auth-service lors de l’inscription et crée le profil correspondant. Il offre un endpoint REST pour créer (POST /api/v1/users), lire (GET /api/v1/users/:id), mettre à jour ou supprimer un profil.
- Stack : Node.js + NestJS, Prisma ORM (ou TypeORM), PostgreSQL.
- Installation : dans user-service/, exécutez npm install puis npm run start:dev.
- Configuration : paramètres dans .env (ex. DATABASE_URL pour PostgreSQL).
- Exécution Docker : inclus dans docker-compose. Sinon docker-compose up user-service.
- Tests : npm test (Jest + Supertest).
