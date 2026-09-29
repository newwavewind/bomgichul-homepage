import subjects from "@/data/nomusa/manifest.json";
import { ExamTrackHub } from "@/components/exam-track/ExamTrackHub";
import { NOMUSA_TRACK } from "@/lib/exam-track/config";
import { buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "공인노무사 1차 기출문제·해설",
  description:
    "공인노무사 1차 노동법(1)·노동법(2)·민법·사회보험법·경영학개론·경제학원론 기출 1,530문항을 선지마다 해설과 함께 봅니다.",
  path: "/nomusa",
});

export default function Page() {
  const description =
    "공인노무사 1차 노동법(1)·노동법(2)·민법·사회보험법·경영학개론·경제학원론 기출 1,530문항을 선지마다 해설과 함께 봅니다.";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildPublicServiceLearningResourceJsonLd({
              name: "공인노무사 1차 기출 학습",
              description,
              path: "/nomusa",
              learningResourceType: "Course",
              educationalLevel: NOMUSA_TRACK.educationalLevel,
              aboutName: NOMUSA_TRACK.aboutName,
            }),
          ),
        }}
      />
      <ExamTrackHub track={NOMUSA_TRACK} subjects={subjects} />
    </>
  );
}
