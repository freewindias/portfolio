import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unique-meerkat-807.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
