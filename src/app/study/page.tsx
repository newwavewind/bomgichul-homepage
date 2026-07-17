import type { Metadata } from "next";
import { StudyHub } from "@/components/study/StudyHub";
import { SITE_NAME } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "학습",
  description:
    "기출문제 해설과 과목별 핵심 개념을 한곳에서 선택해 학습하세요.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: `학습 | ${SITE_NAME}`,
    description: "기출문제 해설과 개념 목록을 과목별로 바로 시작하세요.",
    url: absoluteUrl("/"),
  },
};

/** 네비「학습」도 동일 허브. 캐논은 `/`. */
export default function StudyHubPage() {
  return <StudyHub />;
}
