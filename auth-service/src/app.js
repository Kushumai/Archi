const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const { PORT, DATABASE_URL, SECRET_KEY } = require('./config.cjs')

const app = express();
app.use(cors());
app.use(express.json());

// --- MOCK USER pour le développement
const testUser = {
  id: '1',
  email: 'test@example.com',
  // mot de passe en clair : 'password123'
  passwordHash: null,
};

// Hachage initial du mot de passe
(async () => {
  testUser.passwordHash = await argon2.hash('password123');
  console.log('Test user password hash ready');
})();

// Route de login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (email !== testUser.email) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  try {
    const match = await argon2.verify(testUser.passwordHash, password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error during password verify' });
  }
  // Génération des tokens
  const accessToken = jwt.sign({ id: testUser.id, email }, SECRET_KEY, { expiresIn: ACCESS_TOKEN_LIFETIME });
  const refreshToken = jwt.sign({ id: testUser.id }, REFRESH_SECRET_KEY, { expiresIn: REFRESH_TOKEN_LIFETIME });
  return res.json({ accessToken, refreshToken });
});

// Route de refresh token
app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    const newAccessToken = jwt.sign({ id: decoded.id }, SECRET_KEY, { expiresIn: ACCESS_TOKEN_LIFETIME });
    return res.json({ accessToken: newAccessToken });
  });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Auth Service running on http://localhost:${PORT}`);
});
