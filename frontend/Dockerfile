FROM node:20-slim

RUN apt-get update && apt-get upgrade -y && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY .env .env
COPY .env.local .env.local

RUN npm run build || (npm run lint && false)

EXPOSE 3100

CMD ["npm", "run", "dev"]



