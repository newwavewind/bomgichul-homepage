import Link from "next/link";
import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { FeatureCard } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, SUBJECT_LANDING_INFO, SITE_NAME } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";
import { getConceptsForSubject } from "@/lib/concepts";
import type { ExamSubject } from "@/lib/exam-questions";

export const metadata: Metadata = {
  title: "개념 목록",
  description:
    "공인중개사 기출 10개년 해설에서 뽑은 과목별 핵심 개념을 정의·직관·핵심 포인트·헷갈리는 점·예시로 정리했습니다.",
  alternates: { canonical: absoluteUrl("/concepts") },
  openGraph: {
    title: `개념 목록 | ${SITE_NAME}`,
    description: "과목별 핵심 개념을 정의·직관·핵심 포인트·예시로 정리했습니다.",
    url: absoluteUrl("/concepts"),
  },
};

export default function ConceptsHubPage() {
  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="mb-10 max-w-xl">
          <EyebrowLabel className="mb-2">개념 목록</EyebrowLabel>
          <SectionHeading as="h1">과목을 선택하세요</SectionHeading>
          <p className="mt-3 font-display text-body text-smoke">
            10개년 기출 해설에서 자주 나오는 주제만 뽑아 정의·직관·핵심 포인트·헷갈리는 점·예시로 정리했습니다.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXAM_SUBJECTS.map((s) => {
            const subject = s.value as ExamSubject;
            const label = ARCHIVE_SUBJECT_MAP[subject];
            const info = SUBJECT_LANDING_INFO[subject];
            const total = getConceptsForSubject(subject).length;

            return (
              <Link key={subject} href={`/concepts/${subject}`}>
                <FeatureCard tint="lavender" className="h-full transition-opacity hover:opacity-90">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Tag className="!px-2.5 !py-0.5 !text-[12px]">{info.round}</Tag>
                  </div>
                  <h3 className="mb-2 font-display text-subheading font-semibold text-ink">
                    {label}
                  </h3>
                  <p className="font-display text-body-sm text-smoke">
                    핵심 개념 {total}개
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
