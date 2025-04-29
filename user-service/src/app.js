// user-service/src/app.js
const express = require('express');
const cors = require('cors');
const db = require('./db.cjs');
const { PORT } = require('./config.cjs');

const app = express();
app.use(cors());
app.use(express.json());

// Route de santé pour valider la connexion à la base
app.get('/api/users/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    return res.json({ status: 'ok', time: result.rows[0].now });
  } catch (err) {
    console.error('DB health check failed', err);
    return res.status(500).json({ status: 'error', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`User Service running on http://localhost:${PORT}`);
});
