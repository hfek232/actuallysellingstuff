import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://susanchoi.com/wp-content/uploads/2025/04/**')],
  },
};

export default nextConfig;
