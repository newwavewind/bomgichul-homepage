import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Confirmed successors of retired concept pages.
      {
        source: "/public-service/concepts/gyojeonghak/gjh-corr-history",
        destination: "/public-service/concepts/gyojeonghak/hp-haenghyeongsa",
        permanent: true,
      },
      {
        source: "/public-service/concepts/gyojeonghak/gjh-private-prison",
        destination: "/public-service/concepts/gyojeonghak/my-minyeong-gyodoso",
        permanent: true,
      },
      {
        source: "/public-service/concepts/gyojeonghak/gjh-labeling",
        destination: "/public-service/concepts/gyojeonghak/bj-nakin-sanghojagyong",
        permanent: true,
      },
      {
        source: "/public-service/concepts/gyojeonghak/gjh-treatment-custody",
        destination: "/public-service/concepts/gyojeonghak/cg-chiryogamho",
        permanent: true,
      },
      {
        source: "/public-service/concepts/gyojeonghak/gjh-remedy",
        destination: "/public-service/concepts/gyojeonghak/hj-gwolli-guje-jojik",
        permanent: true,
      },
      {
        source: "/public-service/concepts/gyojeonghak/gjh-diversion",
        destination: "/public-service/concepts/gyojeonghak/hb-diversion",
        permanent: true,
      },
      {
        source: "/public-service/concepts/sobang/fire-yeonso-hyeongtae",
        destination: "/firefighter/concepts/sobang/sb-yeonso-hyeongtae",
        permanent: true,
      },
      {
        source: "/firefighter/concepts/sobang/fire-yeonso-hyeongtae",
        destination: "/firefighter/concepts/sobang/sb-yeonso-hyeongtae",
        permanent: true,
      },
      {
        source: "/public-service/concepts/sobang/fire-yuryu-hwajae",
        destination: "/firefighter/concepts/sobang/sb-hwajae-iron",
        permanent: true,
      },
      {
        source: "/firefighter/concepts/sobang/fire-yuryu-hwajae",
        destination: "/firefighter/concepts/sobang/sb-hwajae-iron",
        permanent: true,
      },
      {
        source: "/public-service/concepts/sobang/fire-bunmal",
        destination: "/firefighter/concepts/sobang/sb-sohwa-iron",
        permanent: true,
      },
      {
        source: "/firefighter/concepts/sobang/fire-bunmal",
        destination: "/firefighter/concepts/sobang/sb-sohwa-iron",
        permanent: true,
      },
      {
        source: "/firefighter/concepts/haengjeongbeop/halb-319",
        destination: "/public-service/concepts/haengjeongbeop/halb-319",
        permanent: true,
      },
      {
        source: "/firefighter/concepts/haengjeongbeop/halb-307",
        destination: "/public-service/concepts/haengjeongbeop/halb-307",
        permanent: true,
      },
      {
        source: "/firefighter/concepts/haengjeongbeop/halb-324",
        destination: "/public-service/concepts/haengjeongbeop/halb-324",
        permanent: true,
      },
      {
        source: "/firefighter/concepts/haengjeongbeop/halb-202",
        destination: "/public-service/concepts/haengjeongbeop/halb-202",
        permanent: true,
      },
      {
        source: "/firefighter/concepts/haengjeongbeop/halb-316",
        destination: "/public-service/concepts/haengjeongbeop/halb-316",
        permanent: true,
      },
      // Play Console 등 예전 privacy.html 경로 호환
      { source: "/privacy.html", destination: "/privacy", permanent: true },
    ];
  },

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
