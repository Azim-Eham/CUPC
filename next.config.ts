import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "emzbjvomcvbjuqqhhhid.supabase.co",
      },
    ],
  },
};

export default nextConfig;
