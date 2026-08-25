"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { LoginSoftNudge } from "@/components/auth/LoginSoftNudge";
import { TableComboChoiceRows } from "@/components/exam/TableComboChoiceRows";
import {
  ChoiceRows,
  ComboChoiceRows,
  StatementRows,
} from "@/components/exam/ExamAnswerRows";
import { isTableCompositeQuestion } from "@/lib/composite-exam";
import { enrichTableCompositeQuestion } from "@/lib/realestate-table-composites";
import {
  bumpAnonAttemptCount,
  dismissProgressNudge,
  shouldShowProgressNudge,
} from "@/lib/login-nudges";
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
  initialRevealed = false,
  selectedChoice,
  onRevealed,
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
  /** 이미 채점된 결과(예: 시험 모드)를 곧바로 보여줄 때 true로 전달 */
  initialRevealed?: boolean;
  /** 사용자가 실제로 고른 선택지 — 채점된 결과에서 선택 표시에 사용 */
  selectedChoice?: string;
  onRevealed?: () => void;
}) {
  const [revealed, setRevealed] = useState(initialRevealed);
  const [attemptResult, setAttemptResult] = useState<AttemptResult | null>(
    initialAttemptResult
  );
  const [savingAttempt, setSavingAttempt] = useState(false);
  const [showProgressNudge, setShowProgressNudge] = useState(false);
  const pathname = usePathname();
  const loginHref = `/login?next=${encodeURIComponent(pathname ?? "/")}`;

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
          <StatementRows items={items} revealed={revealed} free={free} />
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
              selectedNo={selectedChoice ? Number(selectedChoice) : undefined}
            />
          ) : (
            <ComboChoiceRows
              comboChoices={resolvedComboChoices}
              correctChoice={correctChoice}
              revealed={revealed}
              selectedNo={selectedChoice ? Number(selectedChoice) : undefined}
            />
          )}
        </>
      ) : (
        <ChoiceRows
          items={items}
          correctChoice={correctChoice}
          revealed={revealed}
          free={free}
          selectedKey={selectedChoice}
        />
      )}

      {!revealed && (
        <button
          type="button"
          onClick={() => {
            setRevealed(true);
            onRevealed?.();
            if (!userId) {
              bumpAnonAttemptCount();
              setShowProgressNudge(shouldShowProgressNudge(false));
            }
            trackEvent("exam_answer_reveal", {});
            window.dispatchEvent(
              new CustomEvent("exam:answer_revealed", {
                detail: { subject, year, questionNo },
              })
            );
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-[var(--radius-buttons)] border border-carbon bg-paper py-3 font-display text-body font-semibold text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
        >
          정답 확인
        </button>
      )}

      {revealed && !userId ? (
        <div className="mt-4 space-y-3">
          <LoginSoftNudge
            title="오답노트에 넣어 두기"
            body="틀린 문항을 모아 약점만 복습할 수 있어요. 오답노트·북마크·해설 모두 무료이고, 로그인만 하면 바로 열립니다."
            href={loginHref}
            cta="무료로 로그인하고 저장"
          />
          {showProgressNudge ? (
            <LoginSoftNudge
              title="지금까지 푼 건 이 기기에만 남아 있어요"
              body="오답·북마크·최근 학습이 계정에 이어지고, 다른 기기에서도 그대로입니다. 홈페이지 기능은 전부 무료예요."
              href={loginHref}
              cta="무료로 로그인하고 이어하기"
              onDismiss={() => {
                dismissProgressNudge();
                setShowProgressNudge(false);
              }}
            />
          ) : null}
        </div>
      ) : null}

      {revealed && userId && (
        <div className="mt-4 flex items-center justify-center gap-3 rounded-[var(--radius-cards)] border border-dashed border-mist bg-surface px-5 py-4">
          <p className="font-display text-body-sm text-smoke">이 문제, 나는?</p>
          <button
            type="button"
            onClick={() => recordAttempt("correct")}
            disabled={savingAttempt}
            className={`min-h-11 rounded-[var(--radius-buttons)] border border-carbon px-3.5 font-display text-body-sm font-medium transition-colors disabled:opacity-60 ${
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
            className={`min-h-11 rounded-[var(--radius-buttons)] border border-carbon px-3.5 font-display text-body-sm font-medium transition-colors disabled:opacity-60 ${
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
