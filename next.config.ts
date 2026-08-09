import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/diary-수험일기",
        destination: "/diary",
        permanent: true,
      },
    ];
  },
  images: {
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: "/ranks/**", search: "?v=2" },
    ],
  },
  // Prefer webpack for local preview: nested large trees + Turbopack watch can
  // hit EMFILE and make every route resolve as 404.
  turbopack: {},
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/.next/**",
          "**/ox-quiz-app/**",
        ],
      };
    }
    return config;
  },
};

export default nextConfig;
