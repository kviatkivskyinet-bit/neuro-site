/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: 'export',
  distDir: 'out',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  // Видалили experimental звідси!
};

module.exports = nextConfig;
