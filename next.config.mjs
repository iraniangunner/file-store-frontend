/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'filerget.com',
        pathname: '/storage/**',
      },
      // Add more domains as needed
      {
        protocol: 'https',
        hostname: '*.filerget.com',
      },
    ],
    // Or use domains (simpler but deprecated in newer Next.js)
    // domains: ['filerget.com'],
  },
};

export default nextConfig;

