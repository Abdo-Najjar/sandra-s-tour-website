import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Two root layouts (website + dashboard), so unmatched URLs use app/global-not-found.tsx.
  experimental: { globalNotFound: true },
  partialPrefetching: true,
  // English lives at the plain URLs: /tours is served by the /en/tours page.
  // Arabic (/ar), the dashboard, the API, uploads, Next.js files and plain
  // files (anything with an extension, e.g. /site/img1.jpg) are left alone.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/en" },
        {
          source: String.raw`/:path((?!(?:ar|en|admin|login|api|uploads|_next)(?:/|$))(?!.*\.\w+$).+)`,
          destination: "/en/:path",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
