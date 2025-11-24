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
  // Disable server-side features for static export
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
};

module.exports = nextConfig;
