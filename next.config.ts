import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "105mb"
    },
    middlewareClientMaxBodySize: "105mb"
  },
  turbopack: {
    root: process.cwd()
  },
  serverExternalPackages: ["pdfjs-dist", "canvas"]
};

export default nextConfig;
