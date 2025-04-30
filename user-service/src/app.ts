// user-service/src/app.ts
require('reflect-metadata');
const express = require('express');
const cors = require('cors');
const { AppDataSource } = require('./data-source');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 3003;

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');

    // Health check
    app.get('/api/users/health', async (_req: any, res: any) => {
      try {
        const result = await AppDataSource.query('SELECT NOW()');
        res.json({ status: 'ok', time: result[0].now });
      } catch (error) {
        console.error('DB health check failed', error);
        res.status(500).json({ status: 'error', error: (error as Error).message });
      }
    });

    app.listen(PORT, () => {
      console.log(`User Service running on http://localhost:${PORT}`);
    });
  })
  .catch((error:any) => {
    console.error('Error during Data Source initialization', error);
    process.exit(1);
  });