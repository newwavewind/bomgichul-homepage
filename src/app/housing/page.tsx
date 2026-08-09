import type { Metadata } from "next";
import subjects from "@/data/housing/manifest.json";
import { ExamTrackHub } from "@/components/exam-track/ExamTrackHub";
import { HOUSING_TRACK } from "@/lib/exam-track/config";
import { buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "주택관리사 기출문제·핵심 개념",
  description: "주택관리사보 1·2차 전 과목 기출문제와 해설, 핵심 개념을 무료로 학습하세요.",
  path: "/housing",
});

export default function Page() {
  const description = "주택관리사보 1·2차 전 과목 기출문제와 해설, 핵심 개념을 무료로 학습하세요.";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildPublicServiceLearningResourceJsonLd({
            name: "주택관리사보 기출 학습",
            description,
            path: "/housing",
            learningResourceType: "Course",
            educationalLevel: HOUSING_TRACK.educationalLevel,
            aboutName: HOUSING_TRACK.aboutName,
          })),
        }}
      />
      <ExamTrackHub
        track={HOUSING_TRACK}
        subjects={subjects}
        meta={{
          subjectLabel: "5개",
          examLabel: "1차·2차",
          yearLabel: "2020~2025",
        }}
      />
    </>
  );
}
