import type { Metadata } from "next";
import { ExamIntroView } from "@/components/exam-intro/ExamIntroView";
import { getExamIntro } from "@/data/exam-intros";
import { buildPageMetadata } from "@/lib/seo";

const intro = getExamIntro("nomusa");

export const metadata: Metadata = buildPageMetadata({
  title: intro.title,
  description: intro.seoDescription,
  path: "/nomusa/intro",
});

export default function NomusaIntroPage() {
  return <ExamIntroView intro={intro} />;
}
