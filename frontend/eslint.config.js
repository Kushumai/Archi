import next from 'next';
import nextConfig from './next.config.ts';

export default [
  ...next(nextConfig),
  {
    rules: {
      'react/no-unescaped-entities': 'off',
    },
  },
];