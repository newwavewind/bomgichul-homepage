"use client";

import { useState } from "react";
import { ElevatedCard } from "@/components/ui/Card";
import { trackEvent } from "@/lib/analytics";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ExamQuestionItem, ExamSubject } from "@/lib/exam-questions";
import type { AttemptResult } from "@/types/database";

const EXPLANATION_PREVIEW_LENGTH = 40;

function previewText(text: string): string {
  if (text.length <= EXPLANATION_PREVIEW_LENGTH) return text;
  return `${text.slice(0, EXPLANATION_PREVIEW_LENGTH)}…`;
}

export function ExamAnswerList({
  items,
  correctChoice,
  free,
  subject,
  year,
  questionNo,
  userId,
  initialAttemptResult,
  onAttempt,
}: {
  items: ExamQuestionItem[];
  correctChoice: string;
  free: boolean;
  subject: ExamSubject;
  year: number;
  questionNo: number;
  userId: string | null;
  initialAttemptResult: AttemptResult | null;
  onAttempt?: (result: AttemptResult) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [attemptResult, setAttemptResult] = useState<AttemptResult | null>(
    initialAttemptResult
  );
  const [savingAttempt, setSavingAttempt] = useState(false);

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
                  <span
                    className={`ml-2 inline-flex items-center rounded-full bg-[#6366f1] px-2 py-0.5 font-display text-[11px] font-bold tracking-wide text-paper ${
                      revealed && isCorrectChoice ? "visible" : "invisible"
                    }`}
                  >
                    정답
                  </span>
                </p>
              </div>
              {free ? (
                <details className="ml-10 group">
                  <summary className="cursor-pointer font-display text-body-sm font-medium text-electric-blue [&::-webkit-details-marker]:hidden">
                    해설 보기 <span className="inline-block transition-transform group-open:rotate-180">▾</span>
                  </summary>
                  <p className="mt-1.5 font-display text-body-sm leading-relaxed text-smoke">
                    {item.explanation}
                  </p>
                </details>
              ) : (
                <p className="ml-10 font-display text-body-sm leading-relaxed text-smoke">
                  {previewText(item.explanation)}
                </p>
              )}
            </div>
          );
        })}
      </ElevatedCard>

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
