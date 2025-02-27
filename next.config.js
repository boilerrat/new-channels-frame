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
    ],
  },
};

module.exports = nextConfig; 