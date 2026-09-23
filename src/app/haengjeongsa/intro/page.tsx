import type { Metadata } from "next";
import { ExamIntroView } from "@/components/exam-intro/ExamIntroView";
import { getExamIntro } from "@/data/exam-intros";
import { buildPageMetadata } from "@/lib/seo";

const intro = getExamIntro("haengjeongsa");

export const metadata: Metadata = buildPageMetadata({
  title: intro.title,
  description: intro.seoDescription,
  path: "/haengjeongsa/intro",
});

export default function HaengjeongsaIntroPage() {
  return <ExamIntroView intro={intro} />;
}
