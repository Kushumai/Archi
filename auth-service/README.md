## auth-service
Le service d’authentification gère l’inscription, la connexion et le rafraîchissement des sessions utilisateur (JSON Web Tokens). Il est développé en NestJS (TypeScript) et utilise PostgreSQL (via Prisma ORM) pour stocker les comptes avec les mots de passe hachés. À l’inscription (POST /api/auth/register), un token d’access et un refresh token sont générés. Les endpoints typiques sont /api/auth/register, /api/auth/login et /api/auth/refresh. Ce service signe également des tokens pour les communications inter-services (clé SERVICE_SECRET).
- Stack : Node.js + NestJS, Prisma ORM, PostgreSQL, JWT, bcrypt/argon2.
- Installation : dans auth-service/, exécutez npm install, puis npm run start:dev (ou npm run build et npm run start pour la prod).
- Configuration : ajustez .env pour les variables (ex. SERVICE_SECRET, connexion à la base de données DATABASE_URL, durée des tokens, etc.).
- Exécution Docker : ce service est inclus dans docker-compose.yml. Vous pouvez aussi lancer seulement celui-ci avec docker-compose up auth-service.
- Tests : npm test lance les tests unitaires (Jest).
