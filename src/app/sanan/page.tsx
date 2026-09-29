import subjects from "@/data/sanan/manifest.json";
import { ExamTrackHub } from "@/components/exam-track/ExamTrackHub";
import { SANAN_TRACK } from "@/lib/exam-track/config";
import { buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "산업안전지도사 1차 기출문제·해설",
  description:
    "산업안전지도사 1차 산업안전보건법령·산업안전일반·기업진단·지도 기출 750문항을 선지마다 해설과 함께 봅니다.",
  path: "/sanan",
});

export default function Page() {
  const description =
    "산업안전지도사 1차 산업안전보건법령·산업안전일반·기업진단·지도 기출 750문항을 선지마다 해설과 함께 봅니다.";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildPublicServiceLearningResourceJsonLd({
              name: "산업안전지도사 1차 기출 학습",
              description,
              path: "/sanan",
              learningResourceType: "Course",
              educationalLevel: SANAN_TRACK.educationalLevel,
              aboutName: SANAN_TRACK.aboutName,
            }),
          ),
        }}
      />
      <ExamTrackHub track={SANAN_TRACK} subjects={subjects} />
    </>
  );
}
