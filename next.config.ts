import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  // Cursor 미리보기는 127.0.0.1 로 열고, next dev 는 localhost 로 떠서
  // 클라이언트 JS·HMR 이 막히면 버튼 클릭이 아무 반응 없게 된다.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
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

export default withBotId(nextConfig);
