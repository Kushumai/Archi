## frontend
Le dossier frontend/ contient l’application Next.js (React + TypeScript) qui fournit l’interface utilisateur. Elle suit les principes de l’Atomic Design et utilise TailwindCSS + shadcn/ui pour le style. Le front-end consomme l’API exposée par le BFF (ex. /api/auth, /api/documents, etc.) et gère les cookies d’authentification.
- Stack : Next.js (v15), React, TypeScript, TailwindCSS, shadcn/ui, Radix UI.
- Installation : dans frontend/, exécutez npm install.
- Démarrage (dev) : npm run dev. Le serveur Next démarre (par défaut sur le port 3000, mappé au 3100 en local). Ouvrez http://localhost:3100.
- Build & production : npm run build puis npm run start. Vous pouvez aussi exporter un site statique (npm run export) si besoin.
- Tests : créer un projet Next ne génère pas de tests par défaut, mais vous pouvez ajouter npm test (Jest/React Testing Library) selon vos besoins.
