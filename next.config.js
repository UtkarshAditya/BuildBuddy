/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Enable standalone output for Docker deployments
  output: process.env.DOCKER ? 'standalone' : undefined,
  // Disable strict mode in production to avoid double-rendering
  reactStrictMode: true,
}

module.exports = nextConfig
