import subjects from "@/data/semusa/manifest.json";
import { ExamTrackHub } from "@/components/exam-track/ExamTrackHub";
import { SEMUSA_TRACK } from "@/lib/exam-track/config";
import { buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "세무사 1차 기출문제·해설",
  description:
    "세무사 1차 재정학·세법학개론·회계학개론·상법·민법·행정소송법 기출 1,680문항을 선지마다 해설과 함께 봅니다.",
  path: "/semusa",
});

export default function Page() {
  const description =
    "세무사 1차 재정학·세법학개론·회계학개론·상법·민법·행정소송법 기출 1,680문항을 선지마다 해설과 함께 봅니다.";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildPublicServiceLearningResourceJsonLd({
              name: "세무사 1차 기출 학습",
              description,
              path: "/semusa",
              learningResourceType: "Course",
              educationalLevel: SEMUSA_TRACK.educationalLevel,
              aboutName: SEMUSA_TRACK.aboutName,
            }),
          ),
        }}
      />
      <ExamTrackHub track={SEMUSA_TRACK} subjects={subjects} />
    </>
  );
}
