import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "emzbjvomcvbjuqqhhhid.supabase.co",
      },
      {
        protocol: "https",
        hostname: "cu.ac.bd",
      },
    ],
  },
};

export default nextConfig;
