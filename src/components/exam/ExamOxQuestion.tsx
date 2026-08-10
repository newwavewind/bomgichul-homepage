"use client";

import { useState } from "react";
import { plainStudyText } from "@/lib/study-text";

export type ExamOxItem = {
  key: string;
  label?: string;
  text: string;
  answer?: string;
  explanation?: string;
};

export type ExamOxCombo = {
  no: number;
  label: string;
  text: string;
  isCorrect?: boolean;
  explanation?: string;
};

/** 공무원형 기출 상세 UI (공인중개사·경찰·주택관리사 공통) */
export function ExamOxQuestion({
  examId,
  revealEvent,
  items,
  correctChoice,
  explanationSummary,
  comboChoices = [],
  initialAttemptResult = null,
  onAttempt,
  renderExplanation = true,
}: {
  examId: string;
  revealEvent?: { subject: string; year: number; questionNo: number };
  items: ExamOxItem[];
  correctChoice?: number;
  explanationSummary?: string;
  comboChoices?: ExamOxCombo[];
  initialAttemptResult?: "correct" | "wrong" | null;
  onAttempt?: (result: "correct" | "wrong") => void | Promise<void>;
  renderExplanation?: boolean;
}) {
  const isComposite = comboChoices.length > 0;
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const isCorrect =
    selected !== null && correctChoice !== undefined && selected === correctChoice;

  const toggleReveal = () => {
    const next = !revealed;
    setRevealed(next);
    if (next && selected !== null && correctChoice !== undefined) {
      void onAttempt?.(selected === correctChoice ? "correct" : "wrong");
    }
    // 아래 해설 details 를 같은 버튼으로 여닫는다 — 열 때만 알리면 「해설 접기」를
    // 눌러도 해설이 남아 버린다.
    if (revealEvent) {
      window.dispatchEvent(
        new CustomEvent("exam:answer_revealed", {
          detail: { ...revealEvent, open: next },
        })
      );
    }
  };

  return (
    <div className="space-y-4">
      {isComposite ? (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={`${examId}-stmt-${item.key}`}
              className="rounded-2xl border border-mist bg-surface px-4 py-3"
            >
              <div className="flex gap-3">
                <span className="font-display font-semibold text-ink">
                  {item.label ?? item.key}
                </span>
                <span className="flex-1 font-system text-[15px] leading-7 text-ink">
                  {plainStudyText(item.text)}
                </span>
                {revealed && item.answer ? (
                  <span
                    className={`font-display text-[13px] font-bold ${
                      item.answer === "O" ? "text-[#6366f1]" : "text-[#ef4444]"
                    }`}
                  >
                    {item.answer}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
          <p className="pt-1 font-display text-body-sm font-semibold text-smoke">선택지</p>
          <div className="space-y-3">
            {comboChoices.map((choice) => {
              const selectedItem = selected === choice.no;
              return (
                <button
                  key={`${examId}-combo-${choice.no}`}
                  type="button"
                  onClick={() => !revealed && setSelected(choice.no)}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition-colors ${
                    selectedItem
                      ? "border-carbon bg-snow"
                      : "border-mist bg-paper hover:border-ash"
                  }`}
                >
                  <div className="flex gap-3">
                    <span className="font-display font-semibold text-ink">{choice.label}</span>
                    <span className="flex-1 font-system text-[15px] leading-7 text-ink">
                      {plainStudyText(choice.text)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => {
            const choice = Number(item.key || index + 1);
            const selectedItem = selected === choice;
            return (
              <button
                key={`${examId}-${item.key}`}
                type="button"
                onClick={() => !revealed && setSelected(choice)}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition-colors ${
                  selectedItem
                    ? "border-carbon bg-snow"
                    : "border-mist bg-paper hover:border-ash"
                }`}
              >
                <div className="flex gap-3">
                  <span className="font-display font-semibold text-ink">
                    {item.label ?? choice}
                  </span>
                  <span className="flex-1 font-system text-[15px] leading-7 text-ink">
                    {plainStudyText(item.text)}
                  </span>
                  {revealed && item.answer ? (
                    <span
                      className={`font-display text-[13px] font-bold ${
                        item.answer === "O" ? "text-[#6366f1]" : "text-[#ef4444]"
                      }`}
                    >
                      {item.answer}
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        disabled={selected === null && !revealed}
        onClick={toggleReveal}
        className="w-full rounded-2xl bg-carbon px-5 py-4 font-display text-body-sm font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-35"
      >
        {revealed ? "해설 접기" : "정답·해설 보기"}
      </button>

      {revealed ? (
        <div className="space-y-4">
          <div
            className={`rounded-2xl border px-5 py-4 ${
              (selected === null ? initialAttemptResult === "correct" : isCorrect)
                ? "border-[#6366f1]/30 bg-[#6366f1]/5"
                : "border-[#ef4444]/30 bg-[#ef4444]/5"
            }`}
          >
            <p className="font-display text-body-sm font-semibold text-ink">
              {(selected === null ? initialAttemptResult === "correct" : isCorrect) ? "정답입니다." : `정답은 ${correctChoice ?? "?"}번입니다.`}
            </p>
          </div>
          {renderExplanation ? <section
            className="rounded-2xl border border-mist bg-paper px-5 py-5"
            aria-label="선지별 해설"
          >
            <h2 className="font-display text-[18px] font-semibold text-ink">선지별 해설</h2>
            <div className="mt-4 divide-y divide-mist">
              {items.map((item, index) => (
                <div
                  key={`explanation-${examId}-${item.key}`}
                  className="py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-2 font-display text-body-sm font-semibold text-ink">
                    <span>{item.label ?? index + 1}</span>
                    {item.answer ? (
                      <span
                        className={
                          item.answer === "O" ? "text-[#6366f1]" : "text-[#ef4444]"
                        }
                      >
                        {item.answer}
                      </span>
                    ) : null}
                  </div>
                  {item.explanation ? (
                    <p className="mt-2 font-system text-[14px] leading-6 text-smoke">
                      {plainStudyText(item.explanation)}
                    </p>
                  ) : null}
                </div>
              ))}
              {isComposite
                ? comboChoices.map((choice) => (
                    <div key={`combo-expl-${examId}-${choice.no}`} className="py-4 last:pb-0">
                      <div className="flex items-center gap-2 font-display text-body-sm font-semibold text-ink">
                        <span>
                          {choice.label} {plainStudyText(choice.text)}
                        </span>
                        <span
                          className={
                            choice.isCorrect ? "text-[#6366f1]" : "text-[#ef4444]"
                          }
                        >
                          {choice.isCorrect ? "O" : "X"}
                        </span>
                      </div>
                      {choice.explanation ? (
                        <p className="mt-2 font-system text-[14px] leading-6 text-smoke">
                          {plainStudyText(choice.explanation)}
                        </p>
                      ) : null}
                    </div>
                  ))
                : null}
            </div>
            {!items.some((item) => item.explanation) &&
            !comboChoices.some((c) => c.explanation) &&
            explanationSummary ? (
              <p className="font-system text-[14px] leading-6 text-smoke">
                {plainStudyText(explanationSummary)}
              </p>
            ) : null}
            {explanationSummary &&
            (items.some((item) => item.explanation) ||
              comboChoices.some((c) => c.explanation)) ? (
              <div className="mt-4 border-t border-mist pt-4">
                <p className="font-display text-body-sm font-semibold text-ink">해설 요약</p>
                <p className="mt-2 font-system text-[14px] leading-6 text-smoke">
                  {plainStudyText(explanationSummary)}
                </p>
              </div>
            ) : null}
          </section> : null}
        </div>
      ) : null}
    </div>
  );
}
