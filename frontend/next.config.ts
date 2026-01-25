import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Cache busting: Generate new build hashes every deployment
  generateBuildId: async () => {
    return new Date().getTime().toString()
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=0, must-revalidate",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
      ],
    },
    {
      source: "/_next/static/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],
}

export default nextConfig
