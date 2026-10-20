import { SubjectLearningCard } from "@/components/study/SubjectLearningCard";
import { ExamTrackHubGuide } from "@/components/exam-track/ExamTrackHubGuide";
import {
  HubBackButton,
  HubExamIntroLink,
} from "@/components/exam-intro/HubExamIntroLink";

import { TintedAccentCard } from "@/components/ui/Card";

import { AppStoreButtons } from "@/components/ui/AppStoreButtons";
import { FloatingStickers } from "@/components/illustrations/Stickers";
import { AdRail } from "@/components/ads/AdRail";
import {
  EXAM_SUBJECTS,
  ARCHIVE_SUBJECT_MAP,
  SUBJECT_LANDING_INFO,
} from "@/lib/constants";
import {
  getExamQuestionsForSubject,
  type ExamSubject,
} from "@/lib/exam-questions";

/** 학습 허브 — 홈(`/`) 전용. `/study`는 홈으로 영구 리다이렉트. */
export function StudyHub() {
  return (
    <div className="px-4 py-6 sm:px-5 md:py-10">
      <div className="mx-auto max-w-[1120px] space-y-10 md:space-y-12">
        <div className="space-y-5">
          <div className="flex items-center gap-2.5">
            <HubBackButton />
            <h1 className="font-display text-[30px] font-semibold leading-tight text-ink md:text-[34px]">공인중개사 기출문제</h1>
          </div>
          <HubExamIntroLink href="/real-estate/intro" label="공인중개사" />
        </div>
        <section id="exam"><h2 className="mb-5 text-[22px] font-semibold md:text-2xl">과목별 기출문제</h2><div className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">{EXAM_SUBJECTS.map(s=>{const subject=s.value as ExamSubject;return <SubjectLearningCard key={subject} label={ARCHIVE_SUBJECT_MAP[subject]} badge={SUBJECT_LANDING_INFO[subject].round} examCount={getExamQuestionsForSubject(subject).length} examHref={`/exam/${subject}`} dailyHref={`/real-estate/daily?subject=${encodeURIComponent(subject)}`}/>;})}</div></section>

        <ExamTrackHubGuide id="real_estate" basePath="/real-estate" label="공인중개사" />

        <AdRail adsense="hub" spacingClassName="" />

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
