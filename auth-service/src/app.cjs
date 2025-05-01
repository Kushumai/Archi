// src/app.cjs
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { dbUrl, jwtSecret, accessTokenTtl, refreshTokenTtl } = require('./config.cjs');

const app = express();

// CORS : front dev sur localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// --- MOCK USER pour le développement
const testUser = {
  id: '1',
  email: 'test@example.com',
  // mot de passe clair : 'password123'
  passwordHash: null,
};
(async () => {
  testUser.passwordHash = await argon2.hash('password123');
})();

// Génère un JWT
function signToken(payload, ttl) {
  return jwt.sign(payload, jwtSecret, { expiresIn: ttl });
}

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email !== testUser.email ||
        !(await argon2.verify(testUser.passwordHash, password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken  = signToken({ sub: testUser.id }, accessTokenTtl);
    const refreshToken = signToken({ sub: testUser.id }, refreshTokenTtl);

    // stocke le refresh token en cookie httpOnly
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/api/auth/refresh',
      maxAge: refreshTokenTtl * 1000,
    });

    return res.json({ accessToken });
  } catch (err) {
    console.error('Error in /api/auth/login:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// REFRESH
app.post('/api/auth/refresh', (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token' });
    }

    let payload;
    try {
      payload = jwt.verify(refreshToken, jwtSecret);
    } catch {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = signToken({ sub: payload.sub }, accessTokenTtl);
    const newRefreshToken = signToken({ sub: payload.sub }, refreshTokenTtl);

    // met à jour le cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      path: '/api/auth/refresh',
      maxAge: refreshTokenTtl * 1000,
    });

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Error in /api/auth/refresh:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// LOGOUT (optionnel)
// app.post('/api/auth/logout', (req, res) => {
//   res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
//   res.json({ message: 'Logged out' });
// });

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Auth Service running on http://localhost:${PORT}`);
});