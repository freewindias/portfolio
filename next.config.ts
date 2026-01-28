import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "amicable-sardine-242.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "unique-meerkat-807.convex.cloud",
      },
    ],
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
};

export default nextConfig;
