// user-service/src/app.ts
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';  // à créer ensuite
import { Request, Response } from 'express';

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/users/health', async (_req: Request, res: Response) => {
  try {
    const result = await AppDataSource.manager.query('SELECT NOW()');
    return res.json({ status: 'ok', time: result[0].now });
  } catch (err: any) {
    console.error('DB health check failed', err);
    return res.status(500).json({ status: 'error', error: err.message });
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3003;

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(PORT, () => {
      console.log(`User Service running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
