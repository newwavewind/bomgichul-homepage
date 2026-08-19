import type { Metadata } from "next";
import subjects from "@/data/english/manifest.json";
import { ExamTrackHub } from "@/components/exam-track/ExamTrackHub";
import { ENGLISH_TRACK } from "@/lib/exam-track/config";
import { buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "9급 공무원 영어 기출문제·해설",
  description: "국가직·지방직 9급 영어 기출 20회차 400문항을 선지마다 해설과 함께 봅니다. 지문 해석과 그 문항에서 챙길 어휘를 같은 화면에서 확인하세요.",
  path: "/english",
});

export default function Page() {
  const description = "국가직·지방직 9급 영어 기출 20회차 400문항을 선지마다 해설과 함께 봅니다. 지문 해석과 그 문항에서 챙길 어휘를 같은 화면에서 확인하세요.";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildPublicServiceLearningResourceJsonLd({
            name: "9급 공무원 영어 기출 학습",
            description,
            path: "/english",
            learningResourceType: "Course",
            educationalLevel: ENGLISH_TRACK.educationalLevel,
            aboutName: ENGLISH_TRACK.aboutName,
          })),
        }}
      />
      <ExamTrackHub track={ENGLISH_TRACK} subjects={subjects} />
    </>
  );
}
