import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  compiler: {
    removeConsole: false,
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
