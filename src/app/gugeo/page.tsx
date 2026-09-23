import subjects from "@/data/gugeo/manifest.json";
import { ExamTrackHub } from "@/components/exam-track/ExamTrackHub";
import { GUGEO_TRACK } from "@/lib/exam-track/config";
import { buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "9급 공무원 국어 기출문제·해설",
  description:
    "국가직·지방직 9급 공무원 국어 기출 20회차 400문항을 선지마다 해설과 함께 봅니다.",
  path: "/gugeo",
});

export default function Page() {
  const description =
    "국가직·지방직 9급 공무원 국어 기출 20회차 400문항을 선지마다 해설과 함께 봅니다.";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildPublicServiceLearningResourceJsonLd({
              name: "9급 공무원 국어 기출 학습",
              description,
              path: "/gugeo",
              learningResourceType: "Course",
              educationalLevel: GUGEO_TRACK.educationalLevel,
              aboutName: GUGEO_TRACK.aboutName,
            }),
          ),
        }}
      />
      <ExamTrackHub track={GUGEO_TRACK} subjects={subjects} />
    </>
  );
}
