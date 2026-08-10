import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 글쓰기(write·new) 화면은 여기서 막지 않는다 — 목록 페이지에서 공개로 링크되어
      // 크롤러가 URL 을 알게 되는데, robots 로 막으면 그 페이지의 noindex 를 읽지 못해
      // 오히려 「내용 모르는 채 색인」 된다 (실제로 /archive/new 가 그렇게 색인됐다).
      // 크롤은 열어 두고 각 페이지의 noindex 로 뺀다. edit 화면은 공개 링크가 없어 그대로 막는다.
      disallow: [
        "/admin/",
        "/auth/",
        "/login",
        "/signup",
        "/onboarding",
        "/profile",
        "/notifications",
        "/community/*/edit",
        "/public-service/community/*/edit",
        "/police/community/*/edit",
        "/housing/community/*/edit",
        "/archive/*/edit",
        "/public-service/archive/*/edit",
        "/police/archive/*/edit",
        "/housing/archive/*/edit",
        "/exam/*/random",
        "/exam/*/wrong",
        "/exam/*/review",
        "/exam/*/bookmarks",
        "/exam/*/*/mock",
        "/study",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
