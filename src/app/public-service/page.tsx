import type { Metadata } from "next";
import { PublicServiceHub } from "@/components/study/PublicServiceHub";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "공무원 기출 학습",
  description: "9급 공무원 국가직·지방직 과목별 기출과 핵심 개념 학습",
  path: "/public-service",
});

export default function PublicServicePage() {
  return <PublicServiceHub />;
}
