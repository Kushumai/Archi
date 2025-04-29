# Archi – Dossier de Location Immobilière

## Description

**Archi** est une application de gestion de dossiers de location immobilière, destinée à faciliter la communication et le partage de documents entre locataires et propriétaires.  
L'architecture est basée sur une approche microservices comportant :
- Un **service d'authentification** (basé sur JWT avec refresh token),
- Un **service de gestion des utilisateurs** (stockage dans PostgreSQL),
- Un **service de gestion des documents** (stockage dans MongoDB, normalisation des documents par type, organisation par dossiers et partage sécurisé).

Le front-end est développé en **React** avec **TypeScript**, suivant les principes de l'Atomic Design, et l'ensemble de la solution est containerisé avec Docker et déployé sur AWS (ECS via Fargate). Le déploiement est automatisé par un pipeline CI/CD configuré avec GitHub Actions.

## Table des Matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Structure du Projet](#structure-du-projet)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [CI/CD & Déploiement](#cicd--déploiement)
- [Contribuer](#contribuer)
- [License](#license)
- [Contact](#contact)

## Fonctionnalités

- **Authentification Sécurisée** :  
  - Connexion avec JWT et refresh token (valide 1 heure pour l'access token et 7 jours pour le refresh token).
  - APP_GUARD global pour protéger toutes les routes sensibles, tant côté back-end que front-end.

- **Gestion des Utilisateurs** :  
  - Inscription, connexion, gestion du profil et réinitialisation de mot de passe.
  
- **Gestion des Documents** :  
  - Téléversement, téléchargement, modification (normalisation des noms en fonction du type de document) et partage sécurisé.
  - Organisation des documents par dossiers (les tags/labels seront ajoutés ultérieurement).

- **Infrastructure CI/CD** :  
  - Pipeline GitHub Actions pour tests, build et déploiement automatisé vers AWS ECS/Fargate.
  
- **Containerisation & Orchestration** :  
  - Microservices et front-end dockerisés, orchestrés localement par Docker Compose et en production via AWS.

## Technologies

- **Back-end** : Node.js, Express, JWT, bcrypt
- **Base de données** : PostgreSQL (pour les utilisateurs et métadonnées), MongoDB (pour les documents)
- **Front-end** : React, TypeScript, Atomic Design
- **Containerisation** : Docker, Docker Compose
- **Déploiement** : AWS ECS, Fargate, AWS ECR, Nginx (reverse proxy)
- **CI/CD** : GitHub Actions

## Structure du Projet

La structure du projet est organisée en monorepo pour gérer de manière indépendante les différents microservices et le front-end :

Archi/ ├── auth-service/
        ├── user-service/
        ├── document-service/
        ├── frontend/
        ├── nginx/
        └── docker-compose.yml

        ## Installation

### Prérequis

- Node.js (v16 ou supérieur)
- Docker et Docker Compose
- Git

### Étapes

1. **Cloner le dépôt :**

   ```bash
   git clone git@github.com:VotreUsername/my-app.git
   cd my-app