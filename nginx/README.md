## nginx
Le dossier nginx/ contient la configuration du serveur NGINX utilisé comme reverse proxy. Celui-ci écoute sur le port 80 et route les requêtes entrantes vers le front-end (Next.js) ou vers le BFF selon le contexte. Il peut également servir des fichiers statiques si besoin. Le fichier principal nginx.conf définit les upstream vers chaque service et gère la distribution du trafic.
- Pour ajuster le routing ou ajouter des en-têtes globaux, modifiez nginx/nginx.conf.
- En local, NGINX est lancé via Docker Compose (image: nginx:stable) et monte ces configs.
