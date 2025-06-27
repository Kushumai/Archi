import next from 'next';
import nextConfig from './next.config.js';

export default [
  ...next(nextConfig),
  {
    rules: {
      'react/no-unescaped-entities': 'off',
    },
  },
];