import type { Metadata } from "next";
import { StudyHub } from "@/components/study/StudyHub";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
});

/** 홈 = 학습 허브 (구 랜딩 제거) */
export default function HomePage() {
  return <StudyHub />;
}
