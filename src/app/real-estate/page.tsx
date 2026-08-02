import type { Metadata } from "next";
import { StudyHub } from "@/components/study/StudyHub";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "공인중개사 기출 학습",
  description: "공인중개사 1·2차 전 과목 개념과 2016~2025년 기출 학습",
  path: "/real-estate",
});

export default function RealEstatePage() {
  return <StudyHub />;
}
