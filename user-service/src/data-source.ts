import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import dotenv from 'dotenv';

dotenv.config();

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  throw new Error('Missing DATABASE_URL in environment');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});