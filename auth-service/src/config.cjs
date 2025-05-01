// src/config.cjs
require('dotenv').config({ path: '.env.local' });

const { DATABASE_URL, SECRET_KEY } = process.env;
if (!DATABASE_URL || !SECRET_KEY) {
  throw new Error('⚠️  Missing required env vars DATABASE_URL or SECRET_KEY');
}

module.exports = {
  dbUrl: DATABASE_URL,
  jwtSecret: SECRET_KEY,
  // TTLs (en secondes)
  accessTokenTtl: 3600,   // 1h
  refreshTokenTtl: 7 * 24 * 3600, // 7 jours
};