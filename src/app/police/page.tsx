import type { Metadata } from "next";
import subjects from "@/data/police/manifest.json";
import { ExamTrackHub } from "@/components/exam-track/ExamTrackHub";
import { POLICE_TRACK } from "@/lib/exam-track/config";
import { buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "경찰공무원 순경 공채 기출문제·핵심 개념",
  description: "경찰공무원 순경 공채 헌법·형사법·경찰학 기출문제와 해설, 핵심 개념을 무료로 학습하세요.",
  path: "/police",
});

export default function Page() {
  const description = "경찰공무원 순경 공채 헌법·형사법·경찰학 기출문제와 해설, 핵심 개념을 무료로 학습하세요.";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildPublicServiceLearningResourceJsonLd({
            name: "경찰공무원 순경 공채 기출 학습",
            description,
            path: "/police",
            learningResourceType: "Course",
            educationalLevel: POLICE_TRACK.educationalLevel,
            aboutName: POLICE_TRACK.aboutName,
          })),
        }}
      />
      <ExamTrackHub
        track={POLICE_TRACK}
        subjects={subjects}
        meta={{
          subjectLabel: "3개",
          examLabel: "회차별(1·2차)",
          yearLabel: "2022~2026",
        }}
      />
    </>
  );
}
