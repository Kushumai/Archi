<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#Description">Description</a></li>
    <li><a href="#Fonctionnalités-principales">Fonctionnalités principales</a></li>
    <li><a href="#Technologies">Technologies</a></li>
    <li><a href="#Structure-du-projet">Structure du projet</a></li>
    <li><a href="#Installation-et-démarrage">Installation et démarrage</a></li>
    <li><a href="#CI/CD-et-tests">CI/CD et tests</a></li>
    <li><a href="#Licence">Licence</a></li>
  </ol>
</details>

## Description

Archi est une plateforme web complète pour la gestion de dossiers de location immobilière, facilitant la communication et le partage sécurisé de documents entre locataires et propriétaires. Le projet suit une architecture modulaire multi-services : un front-end moderne (Next.js), un Backend For Frontend (BFF) central, et plusieurs microservices NestJS dédiés (authentification, gestion des utilisateurs, gestion des documents). Les services backend utilisent PostgreSQL (via Prisma ou TypeORM) pour les données métier, un stockage objet MinIO pour les documents, et communiquent entre eux via des requêtes HTTP sécurisées par JWT signés avec une clé secrète partagée. L’ensemble est conteneurisé avec Docker Compose et exposé derrière un reverse proxy NGINX. La CI/CD est prise en charge par GitHub Actions : le pipeline installe les dépendances, exécute lint, tests unitaires et d’intégration (Jest/Supertest) puis des tests end-to-end (Playwright) dans un environnement Docker isolé. Le déploiement final vise AWS (ECS/Fargate), mais le projet peut tourner localement en dev avec Docker Compose.

## Fonctionnalités principales
- Authentification sécurisée (auth-service) : système d’inscription et de connexion d’utilisateurs basé sur JWT (access token + refresh token). Un garde global protège toutes les routes sensibles.

- Gestion des utilisateurs (user-service) : création et mise à jour de profils (nom, prénom, etc.), avec logique métier pour éviter les doublons.

- Gestion documentaire (document-service) : téléversement, consultation et suppression de fichiers associés à un bien immobilier, stockés dans MinIO pour un accès rapide. Les documents sont normalisés par type et organisés par dossiers.

- Facade unifiée (bff-service) : le Backend-for-Frontend expose une API unique au front-end, orchestre les appels aux autres microservices et centralise la logique (authentification, agrégation de données, etc.).

- Pipeline CI/CD & Déploiement : tests automatisés (unitaires, intégration, end-to-end) et construction d’images Docker via GitHub Actions. Livraison continue vers un environnement cloud (par exemple AWS ECS).

- Containerisation & Orchestration : tous les composants (back-end, front-end, bases de données, MinIO, NGINX) sont packagés en conteneurs Docker. En local on utilise Docker Compose, en production on cible un orchestrateur cloud.


## Technologies

- Back-end : Node.js, NestJS (TypeScript) pour les microservices, avec Prisma ou TypeORM pour l’ORM. Authentification via JWT et bcrypt/argon2 pour le hachage.
- Front-end : Next.js (React+TypeScript, App Router), Stylisation avec TailwindCSS, composants UI avec shadcn/ui et Radix UI. Respect de l’Atomic Design.
- Bases de données : PostgreSQL (une instance par microservice).
-Stockage d’objets : MinIO (compatible S3) pour héberger les fichiers/documents.
-Infrastructure : Conteneurs Docker et Docker Compose, reverse proxy NGINX (pour exposer le front-end et router les requêtes vers les services). Déploiement cloud (AWS ECS/Fargate), registry Docker (ECR).
-CI/CD : GitHub Actions pour lint, tests (Jest, Supertest, Playwright), building d’images et déploiement.

## Structure du Projet

Le code est organisé en monorepo, chaque service ayant son propre dossier racine : 

```bash
Archi/ 
├── auth-service/      # Service d’authentification (NestJS, JWT)
├── user-service/      # Service de gestion des utilisateurs (NestJS, Postgres)
├── document-service/  # Service de gestion documentaire (NestJS, MinIO)
├── bff-service/       # Backend-for-Frontend (NestJS, Axios, cookie-parser)
├── nginx/             # Configuration NGINX (reverse proxy, static)
├── frontend/          # Application Next.js (React/TypeScript)
└── docker-compose.yml # Orchestrateur local des containers
```

## Installation et démarrage

### Prérequis

- Node.js (v16 ou supérieur)
- Docker et Docker Compose
- Git

### Étapes

1. **Cloner le dépôt :**

   ```sh
   git clone git@github.com:VotreUsername/my-app.git
   cd my-app
   ```
2. Configurer les variables d’environnement : chaque service utilise un fichier .env (non inclus) pour les clés secrètes, l’URL de la base de données, etc. Créez-les à partir des exemples (ex. .env.sample).
3. Construire et démarrer avec Docker Compose :
   ```sh
   docker-compose build
   docker-compose up -d
   ```
4. Exécuter localement en mode développement : (optionnel) vous pouvez aussi installer les dépendances et lancer chaque service séparément pour le développement :
   - Dans chaque dossier *-service/, exécutez npm install puis npm run start:dev (aide chaude NestJS).
   - Dans frontend/, exécutez npm install puis npm run dev.
  
Après démarrage, ouvrez votre navigateur sur http://localhost pour accéder à l’application (via NGINX), ou http://localhost:3100 directement au front-end. Les API sont joignables derrière ce proxy (par exemple /api/auth, /api/users, /api/documents).

## CI/CD et tests

Le projet est conçu pour l’intégration continue : le pipeline GitHub Actions installe les dépendances, effectue le linting et la vérification de types, puis compile le front-end et les services. Il exécute ensuite les tests unitaires et d’intégration (Jest + Supertest) et enfin les tests End-to-End (Playwright dans un environnement Docker isolé). En cas de succès, les conteneurs Docker sont construits et poussés sur un registre, prêts pour le déploiement automatique (par exemple docker-compose pull && up sur un serveur de production, ou via AWS Fargate).

## Licence

Ce projet est open-source (licence MIT). 
