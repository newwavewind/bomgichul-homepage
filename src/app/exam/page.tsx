import Link from "next/link";
import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { FeatureCard } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, SUBJECT_LANDING_INFO, SITE_NAME } from "@/lib/constants";
import { getExamQuestionsForSubject, getExamYears, type ExamSubject } from "@/lib/exam-questions";

export const metadata: Metadata = {
  title: "기출문제 해설",
  description:
    "공인중개사 1·2차 전 과목 2016~2025년 기출문제를 문항별로 해설과 함께 확인하세요.",
  openGraph: {
    title: `기출문제 해설 | ${SITE_NAME}`,
    description: "공인중개사 1·2차 전 과목 기출문제를 문항별 해설과 함께 확인하세요.",
  },
};

export default function ExamHubPage() {
  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="mb-10 max-w-xl">
          <EyebrowLabel className="mb-2">기출문제 해설</EyebrowLabel>
          <SectionHeading as="h1">과목을 선택하세요</SectionHeading>
          <p className="mt-3 font-display text-body text-smoke">
            2016~2025년 공인중개사 1·2차 기출문제를 문항별로 정답·해설과 함께 모아뒀습니다.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXAM_SUBJECTS.map((s) => {
            const subject = s.value as ExamSubject;
            const label = ARCHIVE_SUBJECT_MAP[subject];
            const info = SUBJECT_LANDING_INFO[subject];
            const total = getExamQuestionsForSubject(subject).length;
            const years = getExamYears(subject);

            return (
              <Link key={subject} href={`/exam/${subject}`}>
                <FeatureCard tint="ice" className="h-full transition-opacity hover:opacity-90">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Tag className="!px-2.5 !py-0.5 !text-[12px]">{info.round}</Tag>
                  </div>
                  <h3 className="mb-2 font-display text-subheading font-semibold text-ink">
                    {label}
                  </h3>
                  <p className="font-display text-body-sm text-smoke">
                    {years[years.length - 1]}~{years[0]}년 · 문항 {total}개
                  </p>
                </FeatureCard>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
