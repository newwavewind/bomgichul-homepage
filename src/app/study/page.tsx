import type { Metadata } from "next";
import { StudyHub } from "@/components/study/StudyHub";
import { SITE_NAME } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "학습",
  description:
    "공인중개사 기출문제 해설과 기출 all-in-one 개념을 과목별로 한곳에서 학습하세요.",
  alternates: { canonical: absoluteUrl("/study") },
  openGraph: {
    title: `학습 | ${SITE_NAME}`,
    description: "기출문제 해설과 개념 목록을 과목별로 바로 시작하세요.",
    url: absoluteUrl("/study"),
  },
};

/** 네비「학습」허브 — 캐논은 `/study`. */
export default function StudyHubPage() {
  return <StudyHub />;
}
