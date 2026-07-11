import Link from "next/link";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/Typography";
import { FeatureCard, TintedAccentCard } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { AppStoreButtons } from "@/components/ui/AppStoreButtons";
import { FloatingStickers } from "@/components/illustrations/Stickers";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, SUBJECT_LANDING_INFO, SITE_NAME } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";
import { getConceptsForSubject } from "@/lib/concepts";
import { getExamQuestionsForSubject, getExamYears, type ExamSubject } from "@/lib/exam-questions";

export const metadata: Metadata = {
  title: "학습",
  description:
    "공인중개사 기출문제 해설과 과목별 핵심 개념을 한곳에서 선택해 학습하세요.",
  alternates: { canonical: absoluteUrl("/study") },
  openGraph: {
    title: `학습 | ${SITE_NAME}`,
    description: "기출문제 해설과 개념 목록을 과목별로 바로 시작하세요.",
    url: absoluteUrl("/study"),
  },
};

export default function StudyHubPage() {
  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)] space-y-14">
        <section id="exam">
          <SectionHeading as="h2" className="mb-6">
            기출문제
          </SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXAM_SUBJECTS.map((s) => {
              const subject = s.value as ExamSubject;
              const label = ARCHIVE_SUBJECT_MAP[subject];
              const info = SUBJECT_LANDING_INFO[subject];
              const total = getExamQuestionsForSubject(subject).length;
              const years = getExamYears(subject);

              return (
                <Link key={`exam-${subject}`} href={`/exam/${subject}`}>
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
        </section>

        <section id="concepts">
          <SectionHeading as="h2" className="mb-6">
            기출 all-in-one
          </SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXAM_SUBJECTS.map((s) => {
              const subject = s.value as ExamSubject;
              const label = ARCHIVE_SUBJECT_MAP[subject];
              const info = SUBJECT_LANDING_INFO[subject];
              const total = getConceptsForSubject(subject).length;

              return (
                <Link key={`concept-${subject}`} href={`/concepts/${subject}`}>
                  <FeatureCard tint="lavender" className="h-full transition-opacity hover:opacity-90">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <Tag className="!px-2.5 !py-0.5 !text-[12px]">{info.round}</Tag>
                    </div>
                    <h3 className="mb-2 font-display text-subheading font-semibold text-ink">
                      {label}
                    </h3>
                    <p className="font-display text-body-sm text-smoke">
                      기출 해설 주제 {total}개
                    </p>
                  </FeatureCard>
                </Link>
              );
            })}
          </div>
        </section>

        <section aria-label="앱 설치 안내">
          <TintedAccentCard className="relative overflow-hidden !bg-snow text-center">
            <FloatingStickers className="absolute inset-0 opacity-80" />
            <div className="relative">
              <p className="mx-auto max-w-md font-display text-body text-smoke">
                <span className="whitespace-nowrap">질문은 봄기출이 작성합니다.</span>
                <br />
                앱을 설치해 기출을 풀고, 막히는 순간은 AI 질문으로 이어 가세요.
              </p>
              <AppStoreButtons className="mt-6 justify-center" />
            </div>
          </TintedAccentCard>
        </section>
      </div>
    </div>
  );
}
