import type { Metadata } from "next";
import { PlatformHome } from "@/components/platform/PlatformHome";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/constants";
import {
  buildPageMetadata,
  buildPlatformHomeJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
});

/** 종합학습 플랫폼 홈 — 시험 종류를 선택하는 첫 화면 */
export default async function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebSiteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPlatformHomeJsonLd()) }}
      />
      <PlatformHome />
    </>
  );
}
