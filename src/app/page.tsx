import type { Metadata } from "next";
import { PlatformHome } from "@/components/platform/PlatformHome";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/constants";
import { getUser } from "@/lib/auth";
import { getPersonalHomeData } from "@/lib/personal-home";
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
  const user = await getUser();
  const personalHome = user ? await getPersonalHomeData(user.id) : null;
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
      <PlatformHome user={user ? { nickname: user.nickname } : null} personalHome={personalHome} />
    </>
  );
}
