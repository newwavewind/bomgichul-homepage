import type { Metadata } from "next";
import { PlatformHome } from "@/components/platform/PlatformHome";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
});

/** 종합학습 플랫폼 홈 — 시험 종류를 선택하는 첫 화면 */
export default function HomePage() {
  return <PlatformHome />;
}
