import type { Metadata } from "next";
import { ExamIntroView } from "@/components/exam-intro/ExamIntroView";
import { getExamIntro } from "@/data/exam-intros";
import { buildPageMetadata } from "@/lib/seo";

const intro = getExamIntro("firefighter");

export const metadata: Metadata = buildPageMetadata({
  title: intro.title,
  description: intro.seoDescription,
  path: "/firefighter/intro",
});

export default function FirefighterIntroPage() {
  return <ExamIntroView intro={intro} />;
}
