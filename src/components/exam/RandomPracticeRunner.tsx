"use client";

import { useState } from "react";
import Link from "next/link";
import { QuestionStem } from "@/components/exam/QuestionStem";
import { ExamAnswerList } from "@/components/exam/ExamAnswerList";
import { PrimaryButton } from "@/components/ui/Button";
import { PC_APP_URL } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import type { ExamQuestion } from "@/lib/exam-questions";
import type { AttemptResult } from "@/types/database";

export function RandomPracticeRunner({
  subject,
  subjectLabel,
  questions,
  userId,
  unlocked,
  fullSetSize,
}: {
  subject: string;
  subjectLabel: string;
  questions: ExamQuestion[];
  userId: string | null;
  unlocked: boolean;
  fullSetSize: number;
}) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<number, AttemptResult>>({});
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const question = questions[index];

  const handleNext = () => {
    if (finished) return;
    if (index + 1 >= total) {
      setFinished(true);
      trackEvent("random_practice_complete", { subject, total, unlocked });
      return;
    }
    setIndex((i) => Math.min(i + 1, total - 1));
  };

  const handleRestart = () => {
    setIndex(0);
    setResults({});
    setFinished(false);
  };

  if (finished) {
    const correctCount = Object.values(results).filter((r) => r === "correct").length;
    const attemptedCount = Object.keys(results).length;
    return (
      <div className="mx-auto max-w-xl rounded-[var(--radius-largecards)] border-[1.5px] border-carbon bg-paper p-8 text-center shadow-[var(--shadow-card)]">
        <p className="font-display text-body-sm text-smoke">
          {unlocked ? "랜덤 문제 연습 결과" : "무료 미리보기 결과"}
        </p>
        <p className="mt-2 font-display text-heading-sm font-bold text-ink">
          {total}문제 중 <span className="text-[#6366f1]">{correctCount}개</span> 맞았다고 표시했어요
        </p>
        {attemptedCount < total && (
          <p className="mt-2 font-display text-body-sm text-smoke">
            ({total - attemptedCount}문제는 채점 표시를 안 남겼어요)
          </p>
        )}

        {!unlocked && (
          <div className="mt-6 rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-ice/40 p-5 text-left">
            <p className="font-display text-body-sm font-semibold text-ink">
              🎁 지금 푼 건 {total}문제짜리 무료 미리보기예요
            </p>
            <p className="mt-1 font-display text-body-sm text-smoke">
              {subjectLabel} 프리미엄을 해제하면 전체 연도 기출 중 {fullSetSize}문제를 무작위로 뽑아 계속 연습할
              수 있어요. 모바일 앱에서 구매하면 PC 학습 코드가 발급돼요.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <PrimaryButton href={`/exam/${subject}#unlock`}>코드 등록하러 가기</PrimaryButton>
              <a
                href={PC_APP_URL}
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
              >
                앱에서 구매하기
              </a>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
          >
            다시 풀기
          </button>
          <Link
            href={`/exam/${subject}`}
            className="font-display text-body-sm font-medium text-fog transition-colors hover:text-ink"
          >
            과목 페이지로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!unlocked && (
        <div className="mb-4 rounded-[var(--radius-cards)] border border-dashed border-mist bg-surface px-4 py-2.5">
          <p className="font-display text-body-sm text-smoke">
            🎁 무료 미리보기 · 프리미엄 해제 시 {fullSetSize}문제로 늘어나요
          </p>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <span className="font-display text-body-sm font-medium text-fog">
          {index + 1} / {total}
        </span>
        <span className="font-display text-body-sm text-fog">
          {question.year}년 · {question.questionNo}번
        </span>
      </div>

      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-mist">
        <div
          className="h-full rounded-full bg-[#6366f1] transition-all"
          style={{ width: `${(index / total) * 100}%` }}
        />
      </div>

      <QuestionStem stem={question.stem} />

      <ExamAnswerList
        key={`${question.year}-${question.questionNo}`}
        items={question.items}
        correctChoice={question.correctChoice}
        free
        subject={question.subject}
        year={question.year}
        questionNo={question.questionNo}
        userId={userId}
        initialAttemptResult={null}
        onAttempt={(result) => setResults((r) => ({ ...r, [index]: result }))}
      />

      <div className="mt-4 flex justify-end">
        <PrimaryButton onClick={handleNext}>
          {index + 1 >= total ? "결과 보기" : "다음 문제"} →
        </PrimaryButton>
      </div>
    </div>
  );
}
