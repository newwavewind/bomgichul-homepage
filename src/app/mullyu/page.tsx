import subjects from "@/data/mullyu/manifest.json";
import { ExamTrackHub } from "@/components/exam-track/ExamTrackHub";
import { MULLYU_TRACK } from "@/lib/exam-track/config";
import { buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

/* 문항 수를 글에 박지 않고 manifest 에서 센다 — 변환기를 다시 돌리면 이 글도 따라온다. */
const examTotal = subjects.reduce((sum, subject) => sum + subject.examCount, 0);
const description =
  examTotal > 0
    ? `물류관리사 물류관리론·화물운송론·국제물류론·보관하역론·물류관련법규 기출 ${examTotal.toLocaleString("ko-KR")}문항을 선지마다 해설과 함께 봅니다.`
    : "물류관리사 물류관리론·화물운송론·국제물류론·보관하역론·물류관련법규 기출을 과목별·회차별로 학습합니다.";

export const metadata: Metadata = buildPageMetadata({
  title: "물류관리사 기출문제·해설",
  description,
  path: "/mullyu",
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildPublicServiceLearningResourceJsonLd({
              name: "물류관리사 기출 학습",
              description,
              path: "/mullyu",
              learningResourceType: "Course",
              educationalLevel: MULLYU_TRACK.educationalLevel,
              aboutName: MULLYU_TRACK.aboutName,
            }),
          ),
        }}
      />
      <ExamTrackHub track={MULLYU_TRACK} subjects={subjects} />
    </>
  );
}
