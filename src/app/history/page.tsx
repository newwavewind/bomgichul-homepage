import type { Metadata } from "next";
import subjects from "@/data/history/manifest.json";
import { ExamTrackHub } from "@/components/exam-track/ExamTrackHub";
import { HISTORY_TRACK } from "@/lib/exam-track/config";
import { buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "한국사능력검정 기출문제·핵심 개념",
  description: "한국사능력검정 심화 최근 5회차 250문항을 선지마다 해설과 함께 봅니다. 문항마다 붙는 핵심 개념 카드로 그 시대를 통째로 정리하세요.",
  path: "/history",
});

export default function Page() {
  const description = "한국사능력검정 심화 최근 5회차 250문항을 선지마다 해설과 함께 봅니다. 문항마다 붙는 핵심 개념 카드로 그 시대를 통째로 정리하세요.";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildPublicServiceLearningResourceJsonLd({
            name: "한국사능력검정 기출 학습",
            description,
            path: "/history",
            learningResourceType: "Course",
            educationalLevel: HISTORY_TRACK.educationalLevel,
            aboutName: HISTORY_TRACK.aboutName,
          })),
        }}
      />
      <ExamTrackHub track={HISTORY_TRACK} subjects={subjects} />
    </>
  );
}
