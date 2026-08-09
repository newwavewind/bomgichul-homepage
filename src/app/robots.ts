import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/auth/",
        "/login",
        "/signup",
        "/onboarding",
        "/profile",
        "/notifications",
        "/community/write",
        "/community/*/edit",
        "/public-service/community/write",
        "/public-service/community/*/edit",
        "/police/community/write",
        "/police/community/*/edit",
        "/housing/community/write",
        "/housing/community/*/edit",
        "/archive/new",
        "/archive/*/edit",
        "/public-service/archive/new",
        "/public-service/archive/*/edit",
        "/police/archive/new",
        "/police/archive/*/edit",
        "/housing/archive/new",
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
