import type { Metadata } from "next";
import subjects from "@/data/social-worker/manifest.json";
import { ExamTrackHub } from "@/components/exam-track/ExamTrackHub";
import { SOCIAL_WORKER_TRACK } from "@/lib/exam-track/config";
import { buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "사회복지사 1급 기출문제·핵심 개념",
  description: "사회복지사 1급 인간행동과 사회환경·사회복지조사론·사회복지실천론 등 8개 영역 기출문제와 해설, 핵심 개념을 무료로 학습하세요.",
  path: "/social-worker",
});

export default function Page() {
  const description = "사회복지사 1급 인간행동과 사회환경·사회복지조사론·사회복지실천론 등 8개 영역 기출문제와 해설, 핵심 개념을 무료로 학습하세요.";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildPublicServiceLearningResourceJsonLd({
            name: "사회복지사 1급 기출 학습",
            description,
            path: "/social-worker",
            learningResourceType: "Course",
            educationalLevel: SOCIAL_WORKER_TRACK.educationalLevel,
            aboutName: SOCIAL_WORKER_TRACK.aboutName,
          })),
        }}
      />
      <ExamTrackHub track={SOCIAL_WORKER_TRACK} subjects={subjects} />
    </>
  );
}
