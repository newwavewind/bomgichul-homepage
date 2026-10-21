"use client";

import { useState } from "react";
import Link from "next/link";
import { QuestionStem } from "@/components/exam/QuestionStem";
import { ExamStructuredMaterials } from "@/components/exam/ExamStructuredMaterials";
import { ExamReferenceList } from "@/components/exam/ExamReferenceList";
import { ExamOxQuestion } from "@/components/exam/ExamOxQuestion";
import { PrimaryButton } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";
import type { ExamQuestion } from "@/lib/exam-questions";
import type { AttemptResult } from "@/types/database";

export function RandomPracticeRunner({
  subject,
  questions,
}: {
  subject: string;
  questions: ExamQuestion[];
  /** 예전 채점 저장용 — 지금은 문항 화면과 같은 ExamOxQuestion 이 기록을 맡는다 */
  userId?: string | null;
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
      trackEvent("random_practice_complete", { subject, total });
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
      <div className="mx-auto max-w-xl rounded-[var(--radius-largecards)] border border-carbon bg-paper p-8 text-center shadow-[var(--shadow-card)]">
        <p className="font-display text-body-sm text-smoke">랜덤 문제 연습 결과</p>
        <p className="mt-2 font-display text-heading-sm font-bold text-ink">
          {total}문제 중 <span className="text-[#6366f1]">{correctCount}개</span> 맞혔어요
        </p>
        {attemptedCount < total && (
          <p className="mt-2 font-display text-body-sm text-smoke">
            ({total - attemptedCount}문제는 정답 확인을 하지 않았어요)
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
      {question.leadEntries?.length ? (
        <div className="mb-6">
          <ExamReferenceList entries={question.leadEntries} heading="시장 유형" />
        </div>
      ) : null}
      {question.table ? <ExamStructuredMaterials table={question.table} /> : null}

      {/* 문항 화면과 같은 방식 — 선지를 고르고 「정답 확인」을 누르면 맞힘·틀림과 해설이 나온다(2026-10-21).
          예전엔 고를 수 없이 정답만 펼쳐 스스로 맞았다고 표시해야 했다. */}
      <ExamOxQuestion
        key={`${question.year}-${question.questionNo}`}
        examId={`${question.subject}-${question.year}-${question.questionNo}-random`}
        items={question.items}
        correctChoice={Number(question.correctChoice)}
        correctChoices={question.correctChoices}
        examDate={question.examDate}
        lawVersions={question.lawVersions}
        explanationSummary={question.explanationSummary}
        comboChoices={question.comboChoices}
        referenceEntries={question.referenceEntries}
        passageLabel={question.leadEntries?.length ? "<보기>" : undefined}
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
