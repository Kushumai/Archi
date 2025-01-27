import { resolve, join } from 'path';

const baseDir = resolve(__dirname, '..', '..', '..'); // Remonte à la racine du projet

export const getEntitiesPath = (isLocal: boolean): string[] => {
  return isLocal
    ? [join(baseDir, 'src', 'modules', '**', '*.entity.js')]
    : [join(baseDir, 'dist', 'modules', '**', '*.entity.js')];
};

export const getMigrationsPath = (isLocal: boolean): string[] => {
  return isLocal
    ? [join(baseDir, 'src', 'shared', 'database', 'migrations', '*.js')]
    : [join(baseDir, 'dist', 'shared', 'database', 'migrations', '*.js')];
};
