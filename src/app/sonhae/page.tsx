import subjects from "@/data/sonhae/manifest.json";
import { ExamTrackHub } from "@/components/exam-track/ExamTrackHub";
import { SONHAE_TRACK } from "@/lib/exam-track/config";
import { buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "손해평가사 1차 기출문제·해설",
  description:
    "손해평가사 1차 「상법」 보험편·농어업재해보험법령·농학개론(재배학·원예작물학 포함) 기출 750문항을 선지마다 해설과 함께 봅니다.",
  path: "/sonhae",
});

export default function Page() {
  const description =
    "손해평가사 1차 「상법」 보험편·농어업재해보험법령·농학개론(재배학·원예작물학 포함) 기출 750문항을 선지마다 해설과 함께 봅니다.";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildPublicServiceLearningResourceJsonLd({
              name: "손해평가사 1차 기출 학습",
              description,
              path: "/sonhae",
              learningResourceType: "Course",
              educationalLevel: SONHAE_TRACK.educationalLevel,
              aboutName: SONHAE_TRACK.aboutName,
            }),
          ),
        }}
      />
      <ExamTrackHub track={SONHAE_TRACK} subjects={subjects} />
    </>
  );
}
