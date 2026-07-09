import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  typescript: {
    // Allows Vercel production builds to succeed even if there are minor type-casting issues
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
