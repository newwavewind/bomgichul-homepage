import subjects from "@/data/gamjeong/manifest.json";
import { ExamTrackHub } from "@/components/exam-track/ExamTrackHub";
import { GAMJEONG_TRACK } from "@/lib/exam-track/config";
import { buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

/* 문항 수를 글에 박지 않고 manifest 에서 센다 — 변환기를 다시 돌리면 이 글도 따라온다. */
const examTotal = subjects.reduce((sum, subject) => sum + subject.examCount, 0);
const description =
  examTotal > 0
    ? `감정평가사 1차 민법·경제학원론·부동산학원론·감정평가관계법규·회계학 기출 ${examTotal.toLocaleString("ko-KR")}문항을 선지마다 해설과 함께 봅니다.`
    : "감정평가사 1차 민법·경제학원론·부동산학원론·감정평가관계법규·회계학 기출을 과목별·회차별로 학습합니다.";

export const metadata: Metadata = buildPageMetadata({
  title: "감정평가사 1차 기출문제·해설",
  description,
  path: "/gamjeong",
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildPublicServiceLearningResourceJsonLd({
              name: "감정평가사 1차 기출 학습",
              description,
              path: "/gamjeong",
              learningResourceType: "Course",
              educationalLevel: GAMJEONG_TRACK.educationalLevel,
              aboutName: GAMJEONG_TRACK.aboutName,
            }),
          ),
        }}
      />
      <ExamTrackHub track={GAMJEONG_TRACK} subjects={subjects} />
    </>
  );
}
