import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/login",
        "/onboarding",
        "/profile",
        "/notifications",
        "/community/write",
        "/community/*/edit",
        "/archive/new",
        "/archive/*/edit",
        "/exam/*/random",
        "/exam/*/wrong",
        "/exam/*/review",
        "/exam/*/*/mock",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
