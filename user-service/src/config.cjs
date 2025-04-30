// user-service/src/config.cjs
require('dotenv').config();

const { PORT, DATABASE_URL, SECRET_KEY } = process.env;

if (!DATABASE_URL || !SECRET_KEY) {
  throw new Error('Missing required env vars DATABASE_URL or SECRET_KEY');
}

module.exports = {
  PORT: Number(PORT) || 3003,
  DATABASE_URL,
  SECRET_KEY,
};