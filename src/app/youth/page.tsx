import subjects from "@/data/youth/manifest.json";
import { ExamTrackHub } from "@/components/exam-track/ExamTrackHub";
import { YOUTH_TRACK } from "@/lib/exam-track/config";
import { buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

/*
 * 문항 수를 글에 박지 않고 manifest 에서 센다 — 변환기를 다시 돌리면 이 글도 따라온다.
 * 과목은 manifest 의 `track`(1급·2급·3급)으로 허브가 급수별로 묶는다(앱의 급수 고르기와 같은 갈래).
 */
const examTotal = subjects.reduce((sum, subject) => sum + subject.examCount, 0);
const description =
  examTotal > 0
    ? `청소년상담사 1급·2급·3급 필기 ${subjects.length}과목 기출 ${examTotal.toLocaleString("ko-KR")}문항을 선지마다 해설과 함께 봅니다.`
    : "청소년상담사 1급·2급·3급 필기 기출을 급수별·과목별·회차별로 학습합니다.";

export const metadata: Metadata = buildPageMetadata({
  title: "청소년상담사 기출문제·해설",
  description,
  path: "/youth",
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildPublicServiceLearningResourceJsonLd({
              name: "청소년상담사 기출 학습",
              description,
              path: "/youth",
              learningResourceType: "Course",
              educationalLevel: YOUTH_TRACK.educationalLevel,
              aboutName: YOUTH_TRACK.aboutName,
            }),
          ),
        }}
      />
      <ExamTrackHub track={YOUTH_TRACK} subjects={subjects} />
    </>
  );
}
