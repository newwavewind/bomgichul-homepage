import Link from "next/link";
import { SectionHeading } from "@/components/ui/Typography";
import { FeatureCard, TintedAccentCard } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { AppStoreButtons } from "@/components/ui/AppStoreButtons";
import { FloatingStickers } from "@/components/illustrations/Stickers";
import { DDayStrip } from "@/components/home/DDayStrip";
import {
  EXAM_SUBJECTS,
  ARCHIVE_SUBJECT_MAP,
  SUBJECT_LANDING_INFO,
  SITE_NAME,
} from "@/lib/constants";
import { getConceptsForSubject } from "@/lib/concepts";
import { getExamQuestionsForSubject, getExamYears, type ExamSubject } from "@/lib/exam-questions";

function hubStats() {
  let conceptTotal = 0;
  let examTotal = 0;
  let yearMin = Infinity;
  let yearMax = -Infinity;

  for (const s of EXAM_SUBJECTS) {
    const subject = s.value as ExamSubject;
    conceptTotal += getConceptsForSubject(subject).length;
    examTotal += getExamQuestionsForSubject(subject).length;
    for (const year of getExamYears(subject)) {
      if (year < yearMin) yearMin = year;
      if (year > yearMax) yearMax = year;
    }
  }

  return { conceptTotal, examTotal, yearMin, yearMax };
}

/** 학습 허브 — 홈(`/`) 전용. `/study`는 홈으로 영구 리다이렉트. */
export function StudyHub() {
  const { conceptTotal, examTotal, yearMin, yearMax } = hubStats();

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)] space-y-14">
        <header className="mb-2 space-y-5">
          <Link href="/" className="group inline-flex items-center gap-2.5 rounded-full border border-mist bg-paper py-2 pl-2 pr-4 font-display text-body-sm font-semibold text-ink shadow-[var(--shadow-button)] transition-all hover:-translate-y-0.5 hover:border-carbon hover:bg-snow">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-carbon text-paper transition-transform group-hover:-translate-x-0.5" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M11.5 7H2.5M6 3.5L2.5 7L6 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            시험 다시 선택
          </Link>
          <DDayStrip />
          <div>
            <p className="mb-2 font-display text-[13px] font-semibold tracking-[0.04em] text-electric-blue">
              {SITE_NAME}
            </p>
            <h1 className="font-display text-heading font-semibold tracking-tight text-ink md:text-heading-lg">
              공인중개사 기출 학습의 모든 것
            </h1>
            <p className="mt-3 max-w-2xl font-display text-body text-smoke">
              기출 all-in-one 개념과 연도별 기출문제 해설을 과목별로 바로 시작하세요.
              막히는 지점은 수험생 커뮤니티와 앱 AI 질문으로 이어집니다.
            </p>
          </div>
          <dl className="flex flex-wrap gap-x-6 gap-y-2 font-display text-body-sm text-fog">
            <div className="flex items-baseline gap-1.5">
              <dt className="text-smoke">개념</dt>
              <dd className="font-semibold text-ink">{conceptTotal.toLocaleString("ko-KR")}개</dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt className="text-smoke">기출</dt>
              <dd className="font-semibold text-ink">{examTotal.toLocaleString("ko-KR")}문항</dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt className="text-smoke">연도</dt>
              <dd className="font-semibold text-ink">
                {Number.isFinite(yearMin) ? `${yearMin}~${yearMax}` : "—"}
              </dd>
            </div>
          </dl>
        </header>

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
