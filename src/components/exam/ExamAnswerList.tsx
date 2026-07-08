"use client";

import { useState } from "react";
import { ElevatedCard } from "@/components/ui/Card";
import { ExamAiButtons } from "@/components/exam/ExamAiButtons";
import { CorrectAnswerBadge } from "@/components/exam/CorrectAnswerBadge";
import { TableComboChoiceRows } from "@/components/exam/TableComboChoiceRows";
import { isTableCompositeQuestion } from "@/lib/composite-exam";
import { enrichTableCompositeQuestion } from "@/lib/realestate-table-composites";
import { trackEvent } from "@/lib/analytics";
import { buildExamItemAiPrompt } from "@/lib/ai-links";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  isStatementCompositeQuestion,
  type ExamComboChoice,
  type ExamQuestionItem,
  type ExamSubject,
} from "@/lib/exam-questions";
import type { AttemptResult } from "@/types/database";

const EXPLANATION_PREVIEW_LENGTH = 40;

export interface ExamAnswerAiContext {
  subject: ExamSubject;
  subjectLabel: string;
  unlocked: boolean;
  year: number;
  round: number;
  questionNo: number;
  category: string;
  stem: string;
  correctChoice: string;
}

function previewText(text: string): string {
  if (text.length <= EXPLANATION_PREVIEW_LENGTH) return text;
  return `${text.slice(0, EXPLANATION_PREVIEW_LENGTH)}…`;
}

function buildPrompt(aiContext: ExamAnswerAiContext, item: ExamQuestionItem, free: boolean) {
  return buildExamItemAiPrompt({
    ...aiContext,
    item,
    includeExplanation: free,
  });
}

function ExplanationRow({
  item,
  free,
  revealed,
  aiContext,
}: {
  item: ExamQuestionItem;
  free: boolean;
  revealed: boolean;
  aiContext?: ExamAnswerAiContext;
}) {
  const prompt = aiContext ? buildPrompt(aiContext, item, free) : "";

  if (free) {
    return (
      <div className="ml-10 mt-2 flex flex-wrap items-center gap-2">
        <details className="group">
          <summary className="cursor-pointer font-display text-body-sm font-medium text-electric-blue [&::-webkit-details-marker]:hidden">
            해설 보기 <span className="inline-block transition-transform group-open:rotate-180">▾</span>
          </summary>
          <p className="mt-1.5 font-display text-body-sm leading-relaxed text-smoke">
            {item.explanation}
          </p>
        </details>
        {prompt && aiContext && (
          <ExamAiButtons
            prompt={prompt}
            unlocked={aiContext.unlocked}
            subject={aiContext.subject}
            subjectLabel={aiContext.subjectLabel}
          />
        )}
      </div>
    );
  }

  if (!revealed) return null;

  return (
    <div className="ml-10 mt-2 flex flex-wrap items-center gap-2">
      <p className="font-display text-body-sm leading-relaxed text-smoke">
        {previewText(item.explanation)}
      </p>
      {prompt && aiContext && (
        <ExamAiButtons
          prompt={buildPrompt(aiContext, item, false)}
          unlocked={aiContext.unlocked}
          subject={aiContext.subject}
          subjectLabel={aiContext.subjectLabel}
        />
      )}
    </div>
  );
}

function StatementRows({
  items,
  revealed,
  free,
  aiContext,
}: {
  items: ExamQuestionItem[];
  revealed: boolean;
  free: boolean;
  aiContext?: ExamAnswerAiContext;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.key}
          className="rounded-[var(--radius-buttons)] border-[1.5px] border-mist bg-surface px-4 py-3"
        >
          <div className="flex items-start gap-3">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-icons)] border-[1.5px] border-carbon font-display text-body-sm font-bold ${
                revealed ? "visible" : "invisible"
              } ${item.answer === "O" ? "bg-[#6366f1] text-paper" : "bg-[#ef4444] text-paper"}`}
            >
              {item.answer}
            </span>
            <p className="flex-1 font-display text-body font-medium text-ink">
              {item.label} {item.text}
            </p>
          </div>
          {(free || revealed) && (
            <ExplanationRow item={item} free={free} revealed={revealed} aiContext={aiContext} />
          )}
        </div>
      ))}
    </div>
  );
}

function ChoiceRows({
  items,
  correctChoice,
  revealed,
  free,
  aiContext,
}: {
  items: ExamQuestionItem[];
  correctChoice: string;
  revealed: boolean;
  free: boolean;
  aiContext?: ExamAnswerAiContext;
}) {
  return (
    <ElevatedCard className="overflow-hidden">
      {items.map((item) => {
        const isCorrectChoice = item.key === correctChoice;
        return (
          <div key={item.key} className="border-b border-mist/60 px-5 py-5 last:border-b-0">
            <div className="mb-2 flex items-start gap-3">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-icons)] border-[1.5px] border-carbon font-display text-body-sm font-bold ${
                  revealed ? "visible" : "invisible"
                } ${item.answer === "O" ? "bg-[#6366f1] text-paper" : "bg-[#ef4444] text-paper"}`}
              >
                {item.answer}
              </span>
              <p className="flex-1 font-display text-body font-medium text-ink">
                {item.label} {item.text}
                <CorrectAnswerBadge visible={revealed && isCorrectChoice} className="ml-2" />
              </p>
            </div>
            <ExplanationRow item={item} free={free} revealed={revealed} aiContext={aiContext} />
          </div>
        );
      })}
    </ElevatedCard>
  );
}

function ComboChoiceRows({
  comboChoices,
  correctChoice,
  revealed,
}: {
  comboChoices: ExamComboChoice[];
  correctChoice: string;
  revealed: boolean;
}) {
  return (
    <ElevatedCard className="mt-4 overflow-hidden">
      {comboChoices.map((choice) => {
        const isCorrectChoice = String(choice.no) === correctChoice;
        return (
          <div
            key={choice.no}
            className="border-b border-mist/60 px-5 py-4 last:border-b-0"
          >
            <p className="font-display text-body font-medium text-ink">
              {choice.label} {choice.text}
              <CorrectAnswerBadge visible={revealed && isCorrectChoice} className="ml-2" />
            </p>
          </div>
        );
      })}
    </ElevatedCard>
  );
}

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
    stem,
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
