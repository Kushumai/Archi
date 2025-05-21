FROM node:24-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/main"]