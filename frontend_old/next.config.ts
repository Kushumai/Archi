/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,     // ← désactive la redirection slash final
  async rewrites() {
    return [
      { source: '/api/auth/:path*', destination: 'http://localhost:3002/api/auth/:path*' },
      { source: '/api/users/me',   destination: 'http://localhost:3003/users/me' },
      { source: '/api/users/:id',  destination: 'http://localhost:3003/users/:id' },
    ];
  },
}

export default nextConfig;
