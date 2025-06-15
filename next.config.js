/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  // Disable static page generation
  output: 'standalone',
  // Configure page generation
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Disable static optimization for all pages
  staticPageGenerationTimeout: 0,
  // Configure experimental features
  experimental: {
    esmExternals: true,
    appDir: true,
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Ensure proper handling of client components
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;