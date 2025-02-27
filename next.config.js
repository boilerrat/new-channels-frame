/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@vercel/og'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
      },
      {
        protocol: 'https',
        hostname: 'placekitten.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'production' && process.env.NETLIFY === 'true',
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Add Netlify-specific configuration
  output: 'standalone',
};

module.exports = nextConfig;