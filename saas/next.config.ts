import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Node v24 compat — tsc internal worker throws "invalid type: unit value, expected usize"
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
