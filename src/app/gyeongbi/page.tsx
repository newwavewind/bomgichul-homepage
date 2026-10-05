import subjects from "@/data/gyeongbi/manifest.json";
import { ExamTrackHub } from "@/components/exam-track/ExamTrackHub";
import { GYEONGBI_TRACK } from "@/lib/exam-track/config";
import { buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

/*
 * 문항 수를 글에 박지 않고 manifest 에서 센다 — 경비지도사는 트랙을 먼저 세우고
 * 기출(앱에서 이식·해설 중)을 뒤에 싣는다. 변환기를 다시 돌리면 이 글도 따라온다.
 */
const examTotal = subjects.reduce((sum, subject) => sum + subject.examCount, 0);
const description =
  examTotal > 0
    ? `경비지도사 1차 법학개론·민간경비론, 2차 경비업법과 선택과목(소방학·범죄학·경호학·기계경비개론·기계경비기획 및 설계) 기출 ${examTotal.toLocaleString("ko-KR")}문항을 선지마다 해설과 함께 봅니다.`
    : "경비지도사 1차 법학개론·민간경비론, 2차 경비업법과 선택과목(소방학·범죄학·경호학·기계경비개론·기계경비기획 및 설계) 기출을 과목별·회차별로 학습합니다.";

export const metadata: Metadata = buildPageMetadata({
  title: "경비지도사 1·2차 기출문제·해설",
  description,
  path: "/gyeongbi",
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildPublicServiceLearningResourceJsonLd({
              name: "경비지도사 1·2차 기출 학습",
              description,
              path: "/gyeongbi",
              learningResourceType: "Course",
              educationalLevel: GYEONGBI_TRACK.educationalLevel,
              aboutName: GYEONGBI_TRACK.aboutName,
            }),
          ),
        }}
      />
      <ExamTrackHub track={GYEONGBI_TRACK} subjects={subjects} />
    </>
  );
}
