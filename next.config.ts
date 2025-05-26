import type { NextConfig } from "next";
import { REPO_PATH } from "./constants";

const isProd = process.env.NODE_ENV === "production";
const nextConfig: NextConfig = {
  output: isProd ? "export" : undefined,
  basePath: isProd ? REPO_PATH : "",
  assetPrefix: isProd ? REPO_PATH : "",
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
};

export default nextConfig;
