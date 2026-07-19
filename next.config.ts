import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow the sandbox preview domain to load _next/* assets without cross-origin errors.
  // Without this, Next.js 16 blocks the preview subdomain from loading JS/CSS chunks
  // and the page renders as a blank screen or 404.
  allowedDevOrigins: [
    "*.space-z.ai",
    "preview-*.space-z.ai",
    "preview-chat-*.space-z.ai",
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
