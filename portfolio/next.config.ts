import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Silence the "multiple lockfiles" warning on monorepo-style directory layouts.
  // Tells Next.js that this package is the root of its own dependency tree.
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    // Serve AVIF first (smallest), fall back to WebP, then original format —
    // browser negotiates via Accept header, next/image picks automatically.
    formats: ["image/avif", "image/webp"],
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
  // Restricts these packages' imports to only the specific modules actually
  // used per-file at build time, instead of pulling in their full barrel
  // export graph — meaningfully shrinks client JS for icon-heavy pages.
  experimental: {
    optimizePackageImports: ["lucide-react", "motion", "@react-three/drei"],
  },
};

export default nextConfig;
