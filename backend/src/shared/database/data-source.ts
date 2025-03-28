import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { getEntitiesPath, getMigrationsPath } from '../utils/path-helper';

import { globSync } from 'glob';

const isLocal = process.env.NODE_ENV !== 'production';


const resolvedEntities = getEntitiesPath(isLocal).flatMap((path) => globSync(path));
const resolvedMigrations = getMigrationsPath(isLocal).flatMap((path) => globSync(path));

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: isLocal ? 'postgres' : process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'user',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'psql_archi_db',
  entities: resolvedEntities, // Chemins dynamiques pour les entités
  migrations: resolvedMigrations, // Chemins dynamiques pour les migrations
  synchronize: false, // Toujours désactivé
  logging: true,
});


// const entitiesPaths = [join(__dirname, '..', '..', 'modules', '**', '*.entity.js')];
// const resolvedEntities = entitiesPaths.flatMap((path) => globSync(path));
// console.log('Test Glob Resolved Entities:', resolvedEntities);

// const entitiesPaths = getEntitiesPath(process.env.NODE_ENV !== 'production');
// const resolvedEntities = entitiesPaths.flatMap((path) => globSync(path));
// console.log('Resolved Entities:', resolvedEntities);

// const migrationsPaths = getMigrationsPath(process.env.NODE_ENV !== 'production');
// const resolvedMigrations = migrationsPaths.flatMap((path) => globSync(path));
// console.log('Resolved Migrations:', resolvedMigrations);




console.log('Entities loaded in data-source:', AppDataSource.options.entities);
console.log('Migrations loaded in data-source:', AppDataSource.options.migrations);

console.log('Resolved Entities Path:', getEntitiesPath(process.env.NODE_ENV !== 'production'));
console.log('Resolved Migrations Path:', getMigrationsPath(process.env.NODE_ENV !== 'production'));

console.log('Resolved Entities Path dev:', getEntitiesPath(process.env.NODE_ENV !== 'development'));
console.log('Resolved Migrations Path dev:', getMigrationsPath(process.env.NODE_ENV !== 'development'));

console.log('Resolved Entities:', resolvedEntities);
console.log('Resolved Migrations:', resolvedMigrations);


console.log('Resolved Entities Path:', getEntitiesPath(isLocal));
console.log('Resolved Migrations Path:', getMigrationsPath(isLocal));