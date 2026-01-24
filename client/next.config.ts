import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript errors will now be caught during build
  experimental: {
    typedRoutes: true,
  },
  // Enable strict mode for better performance
  reactStrictMode: true,
  // Optimize images
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;