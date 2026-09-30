import { SubjectLearningCard } from "@/components/study/SubjectLearningCard";
import { HubExamIntroLink } from "@/components/exam-intro/HubExamIntroLink";

import { TintedAccentCard } from "@/components/ui/Card";

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
  type ExamSubject,
} from "@/lib/exam-questions";

/** 학습 허브 — 홈(`/`) 전용. `/study`는 홈으로 영구 리다이렉트. */
export function StudyHub() {
  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)] space-y-14">
        <div className="space-y-3">
          <h1 className="font-display text-heading font-semibold text-ink">공인중개사 기출문제</h1>
          <HubExamIntroLink href="/real-estate/intro" label="공인중개사" />
        </div>
        <section id="exam"><span id="concepts" className="scroll-mt-24" /><h2 className="mb-6 text-2xl font-semibold">과목별 기출문제·핵심 개념</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{EXAM_SUBJECTS.map(s=>{const subject=s.value as ExamSubject;return <SubjectLearningCard key={subject} label={ARCHIVE_SUBJECT_MAP[subject]} badge={SUBJECT_LANDING_INFO[subject].round} examCount={getExamQuestionsForSubject(subject).length} conceptCount={getConceptsForSubject(subject).length} examHref={`/exam/${subject}`} conceptHref={`/concepts/${subject}`}/>;})}</div></section>

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
