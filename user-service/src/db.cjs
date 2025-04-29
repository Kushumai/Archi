// user-service/src/db.cjs
const { Pool } = require('pg');
const { DATABASE_URL } = require('./config.cjs');

// Crée un pool de connexions à PostgreSQL
const pool = new Pool({
  connectionString: DATABASE_URL,
});

// Gestion d’erreurs inattendues
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
