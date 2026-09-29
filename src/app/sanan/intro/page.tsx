import type { Metadata } from "next";
import { ExamIntroView } from "@/components/exam-intro/ExamIntroView";
import { getExamIntro } from "@/data/exam-intros";
import { buildPageMetadata } from "@/lib/seo";

const intro = getExamIntro("sanan");

export const metadata: Metadata = buildPageMetadata({
  title: intro.title,
  description: intro.seoDescription,
  path: "/sanan/intro",
});

export default function SananIntroPage() {
  return <ExamIntroView intro={intro} />;
}
