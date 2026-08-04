import type { NextConfig } from "next";

// Cache-buster: trigger dev server restart to reload generated Prisma Client schema
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'webnox.blr1.digitaloceanspaces.com',
      },
    ],
  },
};

export default nextConfig;

