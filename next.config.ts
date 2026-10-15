import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.18.6', '192.168.18.2'],
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '192.168.18.6:3000',
        'h7k9zcph-3000.uks1.devtunnels.ms', // Add your dev tunnel URL here
      ],
    },
  },
};

export default nextConfig;
