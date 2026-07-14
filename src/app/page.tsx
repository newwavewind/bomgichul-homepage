import type { Metadata } from "next";
import { StudyHub } from "@/components/study/StudyHub";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "공인중개사 기출문제 해설",
  description:
    "공인중개사 기출문제 해설과 과목별 핵심 개념을 한곳에서 선택해 학습하세요.",
  path: "/",
});

/** 홈 = 학습 허브 (구 랜딩 제거) */
export default function HomePage() {
  return <StudyHub />;
}
