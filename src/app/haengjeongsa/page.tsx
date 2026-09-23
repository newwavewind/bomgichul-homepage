import subjects from "@/data/haengjeongsa/manifest.json";
import { ExamTrackHub } from "@/components/exam-track/ExamTrackHub";
import { HAENGJEONGSA_TRACK } from "@/lib/exam-track/config";
import { buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "행정사 1차 기출문제·해설",
  description:
    "행정사 1차 민법·행정법·행정학개론 기출 750문항을 선지마다 해설과 함께 봅니다.",
  path: "/haengjeongsa",
});

export default function Page() {
  const description =
    "행정사 1차 민법·행정법·행정학개론 기출 750문항을 선지마다 해설과 함께 봅니다.";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildPublicServiceLearningResourceJsonLd({
              name: "행정사 1차 기출 학습",
              description,
              path: "/haengjeongsa",
              learningResourceType: "Course",
              educationalLevel: HAENGJEONGSA_TRACK.educationalLevel,
              aboutName: HAENGJEONGSA_TRACK.aboutName,
            }),
          ),
        }}
      />
      <ExamTrackHub track={HAENGJEONGSA_TRACK} subjects={subjects} />
    </>
  );
}
