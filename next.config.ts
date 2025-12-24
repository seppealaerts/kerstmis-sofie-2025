import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@radix-ui/themes"],
  turbopack: {},
};

export default nextConfig;
