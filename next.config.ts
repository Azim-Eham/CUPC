import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
