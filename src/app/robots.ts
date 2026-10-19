import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 글쓰기(write·new)와 로그인·가입·온보딩·프로필·알림은 여기서 막지 않는다.
      // 공개 페이지에서 링크되어 크롤러가 URL 을 알게 되는데, robots 로 막으면
      // 그 페이지의 noindex 를 읽지 못해 「robots.txt에 의해 차단됨」으로 남는다.
      // 크롤은 열어 두고 각 페이지의 noindex 로 뺀다. edit 화면은 공개 링크가 없어 그대로 막는다.
      disallow: [
        "/history",
        "/history/",
        "/exam/history",
        "/exam/history/",
        "/admin/",
        "/auth/",
        "/community/*/edit",
        "/public-service/community/*/edit",
        "/police/community/*/edit",
        "/firefighter/community/*/edit",
        "/housing/community/*/edit",
        "/social-worker/community/*/edit",
        "/history/community/*/edit",
        "/english/community/*/edit",
        "/gugeo/community/*/edit",
        "/haengjeongsa/community/*/edit",
        "/semusa/community/*/edit",
        "/sanan/community/*/edit",
        "/sonhae/community/*/edit",
        "/nomusa/community/*/edit",
        "/gyeongbi/community/*/edit",
        "/gamjeong/community/*/edit",
        "/mullyu/community/*/edit",
        "/archive/*/edit",
        "/public-service/archive/*/edit",
        "/police/archive/*/edit",
        "/firefighter/archive/*/edit",
        "/housing/archive/*/edit",
        "/social-worker/archive/*/edit",
        "/history/archive/*/edit",
        "/english/archive/*/edit",
        "/gugeo/archive/*/edit",
        "/haengjeongsa/archive/*/edit",
        "/semusa/archive/*/edit",
        "/sanan/archive/*/edit",
        "/sonhae/archive/*/edit",
        "/nomusa/archive/*/edit",
        "/gyeongbi/archive/*/edit",
        "/gamjeong/archive/*/edit",
        "/mullyu/archive/*/edit",
        "/exam/*/random",
        "/exam/*/wrong",
        "/exam/*/review",
        "/exam/*/bookmarks",
        "/exam/*/*/mock",
        "/study",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
