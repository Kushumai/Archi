## bff-service
Le BFF (Backend-for-Frontend) sert de passerelle unique entre le front-end et les microservices. Il centralise la logique métier côté serveur : authentification (garde les cookies de refresh-token HTTP), agrégation de données issues de plusieurs services, et exposition d’une API simplifiée au client. Par exemple, lors du login il relaie la requête à auth-service puis gère les cookies de session.
- Stack : Node.js + NestJS, Axios pour appel HTTP aux autres services, cookie-parser, helmet pour la sécurité, Passport-JWT pour la vérification des tokens.
- Installation : dans bff-service/, npm install puis npm run start:dev.
- Configuration : .env pour les URL des services (AUTH_SERVICE_URL, USER_SERVICE_URL, etc.) et clés JWT (JWT_SECRET, SERVICE_SECRET).
- Exécution Docker : inclus dans docker-compose (service bff-service).
- Tests : npm test (Jest pour les tests unitaires).
