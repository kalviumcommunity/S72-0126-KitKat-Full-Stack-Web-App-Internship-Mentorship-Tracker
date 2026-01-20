import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Temporarily ignore TypeScript errors during build
    // TODO: Fix all TypeScript errors and remove this
    ignoreBuildErrors: true,
  },
};

export default nextConfig;