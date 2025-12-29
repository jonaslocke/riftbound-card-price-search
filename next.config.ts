import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cmsassets.rgpub.io",
      },
    ],
  },
  htmlLimitedBots: /.*/,
};

export default nextConfig;
