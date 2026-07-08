"use client";

import { useState } from "react";
import { TableComboChoiceRows } from "@/components/exam/TableComboChoiceRows";
import {
  ChoiceRows,
  ComboChoiceRows,
  StatementRows,
  type ExamAnswerAiContext,
} from "@/components/exam/ExamAnswerRows";
import { isTableCompositeQuestion } from "@/lib/composite-exam";
import { enrichTableCompositeQuestion } from "@/lib/realestate-table-composites";
import { trackEvent } from "@/lib/analytics";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  isStatementCompositeQuestion,
  type ExamComboChoice,
  type ExamQuestionItem,
  type ExamSubject,
} from "@/lib/exam-questions";
import type { AttemptResult } from "@/types/database";

export type { ExamAnswerAiContext };

export function ExamAnswerList({
  items,
  correctChoice,
  questionType,
  comboChoices = [],
  compositeLayout,
  tableHeader,
  stem,
  free,
  subject,
  year,
  questionNo,
  userId,
  initialAttemptResult,
  onAttempt,
  aiContext,
}: {
  items: ExamQuestionItem[];
  correctChoice: string;
  questionType?: "correct" | "wrong" | "composite";
  comboChoices?: ExamComboChoice[];
  compositeLayout?: "table" | "statements";
  tableHeader?: string[];
  stem?: string;
  free: boolean;
  subject: ExamSubject;
  year: number;
  questionNo: number;
  userId: string | null;
  initialAttemptResult: AttemptResult | null;
  onAttempt?: (result: AttemptResult) => void;
  aiContext?: ExamAnswerAiContext;
}) {
  const [revealed, setRevealed] = useState(false);
  const [attemptResult, setAttemptResult] = useState<AttemptResult | null>(
    initialAttemptResult
  );
  const [savingAttempt, setSavingAttempt] = useState(false);

  const enriched = enrichTableCompositeQuestion({
    year,
    questionNo,
    comboChoices,
    tableHeader,
    compositeLayout,
  });
  const resolvedComboChoices = enriched.comboChoices;
  const resolvedTableHeader = enriched.tableHeader;
  const resolvedCompositeLayout = enriched.compositeLayout;

  const isStatementComposite = isStatementCompositeQuestion({
    questionType: questionType ?? "correct",
    comboChoices: resolvedComboChoices,
  });
  const isTableComposite = isTableCompositeQuestion({
    compositeLayout: resolvedCompositeLayout,
    comboChoices: resolvedComboChoices,
    stem: stem ?? "",
  });

  const recordAttempt = async (result: AttemptResult) => {
    if (!userId || savingAttempt || !isSupabaseConfigured()) return;
    setSavingAttempt(true);
    setAttemptResult(result);

    const supabase = createClient();
    const { error } = await supabase.from("question_attempts").upsert(
      { user_id: userId, subject, year, question_no: questionNo, result },
      { onConflict: "user_id,subject,year,question_no" }
    );

    if (error) {
      setAttemptResult(initialAttemptResult);
    } else {
      trackEvent("exam_question_attempt", { subject, year, questionNo, result });
      onAttempt?.(result);
    }

    setSavingAttempt(false);
  };

  return (
    <>
      {isStatementComposite ? (
        <>
          <StatementRows
            items={items}
            revealed={revealed}
            free={free}
            aiContext={aiContext}
          />
          <p className="mb-2 mt-5 font-display text-body-sm font-semibold text-smoke">선택지</p>
          {isTableComposite ? (
            <TableComboChoiceRows
              comboChoices={resolvedComboChoices}
              tableHeader={resolvedTableHeader}
              stem={stem}
              year={year}
              questionNo={questionNo}
              correctChoice={correctChoice}
              revealed={revealed}
            />
          ) : (
            <ComboChoiceRows
              comboChoices={resolvedComboChoices}
              correctChoice={correctChoice}
              revealed={revealed}
            />
          )}
        </>
      ) : (
        <ChoiceRows
          items={items}
          correctChoice={correctChoice}
          revealed={revealed}
          free={free}
          aiContext={aiContext}
        />
      )}

      {!revealed && (
        <button
          type="button"
          onClick={() => {
            setRevealed(true);
            trackEvent("exam_answer_reveal", {});
            window.dispatchEvent(
              new CustomEvent("exam:answer_revealed", {
                detail: { subject, year, questionNo },
              })
            );
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-paper py-3 font-display text-body font-semibold text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
        >
          정답 확인
        </button>
      )}

      {revealed && userId && (
        <div className="mt-4 flex items-center justify-center gap-3 rounded-[var(--radius-cards)] border border-dashed border-mist bg-surface px-5 py-4">
          <p className="font-display text-body-sm text-smoke">이 문제, 나는?</p>
          <button
            type="button"
            onClick={() => recordAttempt("correct")}
            disabled={savingAttempt}
            className={`rounded-[var(--radius-buttons)] border-[1.5px] border-carbon px-3.5 py-1.5 font-display text-body-sm font-medium transition-colors disabled:opacity-60 ${
              attemptResult === "correct"
                ? "bg-[#6366f1] text-paper"
                : "bg-paper text-ink hover:bg-snow"
            }`}
          >
            맞았어요
          </button>
          <button
            type="button"
            onClick={() => recordAttempt("wrong")}
            disabled={savingAttempt}
            className={`rounded-[var(--radius-buttons)] border-[1.5px] border-carbon px-3.5 py-1.5 font-display text-body-sm font-medium transition-colors disabled:opacity-60 ${
              attemptResult === "wrong"
                ? "bg-[#ef4444] text-paper"
                : "bg-paper text-ink hover:bg-snow"
            }`}
          >
            틀렸어요
          </button>
        </div>
      )}
    </>
  );
}
