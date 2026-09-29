import type { Metadata } from "next";
import { ExamIntroView } from "@/components/exam-intro/ExamIntroView";
import { getExamIntro } from "@/data/exam-intros";
import { buildPageMetadata } from "@/lib/seo";

const intro = getExamIntro("sonhae");

export const metadata: Metadata = buildPageMetadata({
  title: intro.title,
  description: intro.seoDescription,
  path: "/sonhae/intro",
});

export default function SonhaeIntroPage() {
  return <ExamIntroView intro={intro} />;
}
