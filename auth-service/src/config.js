module.exports = {
    SECRET_KEY: process.env.SECRET_KEY || 'dev_secret_key',
    REFRESH_SECRET_KEY: process.env.REFRESH_SECRET_KEY || 'dev_refresh_secret_key',
    ACCESS_TOKEN_LIFETIME: '1h',
    REFRESH_TOKEN_LIFETIME: '7d',
    PORT: process.env.PORT || 3001,
  };