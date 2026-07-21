"use client";

import { useState } from "react";
import Link from "next/link";
import { QuestionStem } from "@/components/exam/QuestionStem";
import { ExamAnswerList } from "@/components/exam/ExamAnswerList";
import { ExamQuestionSeoExplanations } from "@/components/exam/ExamQuestionSeoExplanations";
import { PrimaryButton } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";
import type { ExamQuestion } from "@/lib/exam-questions";
import { ARCHIVE_SUBJECT_MAP } from "@/lib/constants";
import type { AttemptResult } from "@/types/database";

export function RandomPracticeRunner({
  subject,
  questions,
  userId,
  aiUnlocked = true,
}: {
  subject: string;
  questions: ExamQuestion[];
  userId: string | null;
  aiUnlocked?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<number, AttemptResult>>({});
  const [finished, setFinished] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const total = questions.length;
  const question = questions[index];
  const subjectLabel = ARCHIVE_SUBJECT_MAP[question.subject];

  const handleNext = () => {
    if (finished) return;
    if (index + 1 >= total) {
      setFinished(true);
      trackEvent("random_practice_complete", { subject, total });
      return;
    }
    setIndex((i) => Math.min(i + 1, total - 1));
    setRevealed(false);
  };

  const handleRestart = () => {
    setIndex(0);
    setResults({});
    setFinished(false);
    setRevealed(false);
  };

  if (finished) {
    const correctCount = Object.values(results).filter((r) => r === "correct").length;
    const attemptedCount = Object.keys(results).length;
    return (
      <div className="mx-auto max-w-xl rounded-[var(--radius-largecards)] border border-carbon bg-paper p-8 text-center shadow-[var(--shadow-card)]">
        <p className="font-display text-body-sm text-smoke">랜덤 문제 연습 결과</p>
        <p className="mt-2 font-display text-heading-sm font-bold text-ink">
          {total}문제 중 <span className="text-[#6366f1]">{correctCount}개</span> 맞았다고 표시했어요
        </p>
        {attemptedCount < total && (
          <p className="mt-2 font-display text-body-sm text-smoke">
            ({total - attemptedCount}문제는 채점 표시를 안 남겼어요)
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
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

      <QuestionStem stem={question.stem} questionNo={question.questionNo} />

      <ExamAnswerList
        key={`${question.year}-${question.questionNo}`}
        items={question.items}
        correctChoice={question.correctChoice}
        questionType={question.questionType}
        comboChoices={question.comboChoices}
        compositeLayout={question.compositeLayout}
        tableHeader={question.tableHeader}
        stem={question.stem}
        free
        subject={question.subject}
        year={question.year}
        questionNo={question.questionNo}
        userId={userId}
        initialAttemptResult={null}
        onAttempt={(result) => setResults((r) => ({ ...r, [index]: result }))}
        onRevealed={() => setRevealed(true)}
        aiContext={{
          subject: question.subject,
          subjectLabel,
          unlocked: aiUnlocked,
          year: question.year,
          round: question.round,
          questionNo: question.questionNo,
          category: question.category,
          stem: question.stem,
          correctChoice: question.correctChoice,
        }}
      />

      {revealed && (
        <ExamQuestionSeoExplanations
          question={question}
          subjectLabel={subjectLabel}
        />
      )}

      <div className="mt-4 flex justify-end">
        <PrimaryButton onClick={handleNext}>
          {index + 1 >= total ? "결과 보기" : "다음 문제"} →
        </PrimaryButton>
      </div>
    </div>
  );
}
