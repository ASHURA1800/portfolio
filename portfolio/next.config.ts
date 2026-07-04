import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Vercel Blob Storage (used for project/blog/cert images and resume)
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      // Common external image hosts (GitHub avatars, CDNs, etc.)
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },
  // Keep heavy Node.js modules out of the client bundle and Edge runtime
  serverExternalPackages: ["nodemailer", "bcryptjs"],
};

export default nextConfig;
