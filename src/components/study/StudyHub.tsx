import Link from "next/link";
import { SectionHeading } from "@/components/ui/Typography";
import { FeatureCard, TintedAccentCard } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { AppStoreButtons } from "@/components/ui/AppStoreButtons";
import { FloatingStickers } from "@/components/illustrations/Stickers";
import {
  EXAM_SUBJECTS,
  ARCHIVE_SUBJECT_MAP,
  SUBJECT_LANDING_INFO,
} from "@/lib/constants";
import { getConceptsForSubject } from "@/lib/concepts";
import {
  getExamQuestionsForSubject,
  getExamYears,
  type ExamSubject,
} from "@/lib/exam-questions";

/** 학습 허브 — 홈(`/`) 전용. `/study`는 홈으로 영구 리다이렉트. */
export function StudyHub() {
  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)] space-y-14">
        <h1 className="font-display text-heading font-semibold text-ink">공인중개사 기출문제</h1>
        <section id="concepts">
          <SectionHeading as="h2" className="mb-6">
            기출 올인원
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

        <section aria-label="앱 설치 안내">
          <TintedAccentCard className="relative overflow-hidden !bg-snow text-center">
            <FloatingStickers className="absolute inset-0 opacity-80" />
            <div className="relative">
              <p className="mx-auto max-w-md font-display text-body text-smoke">
                <span className="whitespace-nowrap">기출 학습의 모든 것</span>
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
