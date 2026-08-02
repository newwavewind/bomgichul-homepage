import type { Metadata } from "next";
import { PublicServiceHub } from "@/components/study/PublicServiceHub";
import { buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "9급 공무원 기출문제·핵심 개념",
  description: "9급 공무원 국가직·지방직 16개 과목의 연도별 기출문제와 해설, 핵심 개념을 무료로 학습하세요.",
  path: "/public-service",
});

export default function PublicServicePage() {
  const description = "9급 공무원 국가직·지방직 16개 과목의 연도별 기출문제와 해설, 핵심 개념 학습";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildPublicServiceLearningResourceJsonLd({
            name: "9급 공무원 국가직·지방직 기출 학습",
            description,
            path: "/public-service",
            learningResourceType: "Course",
          })),
        }}
      />
      <PublicServiceHub />
    </>
  );
}
