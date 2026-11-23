import type { Metadata } from "next";
import subjects from "@/data/history/manifest.json";
import { ExamTrackHub } from "@/components/exam-track/ExamTrackHub";
import { HISTORY_TRACK } from "@/lib/exam-track/config";
import { buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";

const DESCRIPTION =
  "국사편찬위원회 한국사능력검정시험(한능검) 심화 최근 11회차(제70~80회) 550문항 기출문제 정답·해설. 회차별·시대별로 무료로 학습하세요.";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "한국사능력검정시험 심화 기출문제·정답·해설",
    description: DESCRIPTION,
    path: "/history",
  }),
  keywords: [
    "한국사능력검정시험",
    "한능검",
    "한국사능력검정시험 심화",
    "한국사능력검정 기출문제",
    "한능검 심화 기출",
    "한국사능력검정시험 정답",
    "한국사능력검정시험 해설",
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildPublicServiceLearningResourceJsonLd({
            name: "한국사능력검정시험 심화 기출 학습",
            description: DESCRIPTION,
            path: "/history",
            learningResourceType: "Course",
            educationalLevel: HISTORY_TRACK.educationalLevel,
            aboutName: HISTORY_TRACK.aboutName,
          })),
        }}
      />
      <ExamTrackHub track={HISTORY_TRACK} subjects={subjects} />
    </>
  );
}
