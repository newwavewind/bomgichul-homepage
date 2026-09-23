import type { Metadata } from "next";
import subjects from "@/data/firefighter/manifest.json";
import { ExamTrackHub } from "@/components/exam-track/ExamTrackHub";
import { FIREFIGHTER_TRACK } from "@/lib/exam-track/config";
import { buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "소방공무원 소방학개론·소방관계법규 기출문제·핵심 개념",
  description:
    "소방공무원 공개경쟁채용 소방학개론·소방관계법규 기출문제와 해설, 핵심 개념을 무료로 학습하세요.",
  path: "/firefighter",
});

export default function Page() {
  const description =
    "소방공무원 공개경쟁채용 소방학개론·소방관계법규 기출문제와 해설, 핵심 개념을 무료로 학습하세요.";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildPublicServiceLearningResourceJsonLd({
            name: "소방공무원 소방학개론·소방관계법규 기출 학습",
            description,
            path: "/firefighter",
            learningResourceType: "Course",
            educationalLevel: FIREFIGHTER_TRACK.educationalLevel,
            aboutName: FIREFIGHTER_TRACK.aboutName,
          })),
        }}
      />
      <ExamTrackHub track={FIREFIGHTER_TRACK} subjects={subjects} />
    </>
  );
}
