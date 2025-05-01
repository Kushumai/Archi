// next.config.ts
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:3002/api/auth/:path*',
      },
      {
        source: '/api/users/:path*',
        destination: 'http://localhost:3003/api/users/:path*',
      },
    ];
  },
};

export default nextConfig;
