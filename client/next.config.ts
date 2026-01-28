import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript errors will now be caught during build
  typedRoutes: true,
  // Enable strict mode for better performance
  reactStrictMode: true,
  // Add turbopack config to silence warnings
  turbopack: {},
  // Set output file tracing root to silence warnings
  outputFileTracingRoot: __dirname,
  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.blob.core.windows.net',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;