import type { Metadata } from "next";
import { StudyHub } from "@/components/study/StudyHub";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "공인중개사 기출문제·핵심 개념",
  description: "공인중개사 1·2차 6개 과목의 핵심 개념과 2016~2025년 기출문제 및 해설을 무료로 학습하세요.",
  path: "/real-estate",
});

export default function RealEstatePage() {
  return <StudyHub />;
}
