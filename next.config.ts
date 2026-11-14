import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
    // Allow unoptimized images for placeholder SVGs served from /public
    unoptimized: false,
  },
  // Required for Supabase Auth cookie handling on Vercel Edge
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
};

export default nextConfig;
