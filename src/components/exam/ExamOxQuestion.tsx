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
  passageLead = [],
  passageLabel,
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
  /** 보기 상자에서 ㉠ 앞에 놓인 도입부. 지문과 한 문장으로 이어지는 자리다. */
  passageLead?: string[];
  passageLabel?: string;
  initialAttemptResult?: "correct" | "wrong" | null;
  onAttempt?: (result: "correct" | "wrong") => void | Promise<void>;
  renderExplanation?: boolean;
}) {
  const isComposite = comboChoices.length > 0;
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const isCorrect =
    selected !== null && correctChoice !== undefined && selected === correctChoice;

  /**
   * 채점은 한 번뿐이고 되돌리지 않는다.
   *
   * 예전에는 같은 단추가 「정답 확인 ↔ 해설 접기」로 오갔는데, 접을 이유가
   * 없다 — 답을 본 뒤에 다시 가리면 이미 본 것이 안 보이게 될 뿐이고, 그
   * 상태에서 할 수 있는 일도 없다. 앱에도 그 단추는 없다.
   */
  const reveal = () => {
    if (revealed) return;
    setRevealed(true);
    if (selected !== null && correctChoice !== undefined) {
      void onAttempt?.(selected === correctChoice ? "correct" : "wrong");
    }
    // 아래 해설 details 를 함께 연다
    if (revealEvent) {
      window.dispatchEvent(
        new CustomEvent("exam:answer_revealed", {
          detail: { ...revealEvent, open: true },
        })
      );
    }
  };

  return (
    <div className="space-y-4">
      {isComposite ? (
        <div className="space-y-3">
          {/*
            보기는 시험지처럼 **상자 하나**다. 도입부와 ㉠~㉤ 이 「…행하여지고 있어,
            ㉠타인의 생명…」처럼 한 문장으로 이어지는 문항이 있어, 도입부를 위쪽에
            따로 떼어 두면 그 상자가 쉼표에서 끊겨 문장이 잘린 것처럼 읽힌다.
            그래서 도입부와 지문을 같은 상자에 담고, O/X 는 각 줄 끝에 붙인다.
          */}
          {passageLabel ? (
            <p className="text-center font-display text-body-sm font-medium text-smoke">
              {passageLabel}
            </p>
          ) : null}
          <div className="space-y-2.5 rounded-[var(--radius-cards)] border border-carbon bg-surface px-5 py-4">
            {passageLead.map((line, i) => (
              <p key={`${examId}-lead-${i}`} className="font-system text-[15px] leading-7 text-ink">
                {plainStudyText(line)}
              </p>
            ))}
            {items.map((item) => (
              <div key={`${examId}-stmt-${item.key}`} className="flex gap-3">
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
            ))}
          </div>
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
            // 채점 뒤에는 고른 자리와 정답만 남기고 나머지는 물러선다.
            // 앱이 하던 것이다 — 다섯 줄이 같은 무게로 남아 있으면 어디를
            // 봐야 하는지 눈이 다시 헤맨다.
            const muted = revealed && !selectedItem && choice !== correctChoice;
            const isAnswer = revealed && choice === correctChoice;
            return (
              <button
                key={`${examId}-${item.key}`}
                type="button"
                // 고른 번호를 한 번 더 누르면 바로 채점한다 — 아래 단추까지
                // 손을 내리지 않아도 되게 앱이 두었던 길이다.
                onClick={() => {
                  if (revealed) return;
                  if (selectedItem) reveal();
                  else setSelected(choice);
                }}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition-colors ${
                  isAnswer
                    ? "border-[#6366f1] bg-[#6366f1]/[0.06]"
                    : selectedItem
                      ? revealed
                        ? "border-[#ef4444] bg-[#ef4444]/[0.05]"
                        : "border-carbon bg-snow study-pick-tap-again"
                      : "border-mist bg-paper hover:border-ash"
                } ${muted ? "opacity-45" : ""}`}
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

      {/* 고른 뒤 한 번 더 누르면 채점된다는 것을 알린다. 알리지 않으면
          아무도 두 번 누르지 않는다 — 앱이 선지 아래에 두던 안내다. */}
      {/* 채점 전에만 남는다 — 채점하고 나면 안내도 단추도 할 일이 없다 */}
      {!revealed ? (
        <>
          <p className="text-center font-system text-[13px] text-fog">
            번호를 고른 뒤 한 번 더 누르거나 아래 「정답 확인」을 누르세요
          </p>
          <button
            type="button"
            disabled={selected === null}
            onClick={reveal}
            className="w-full rounded-2xl bg-carbon px-5 py-4 font-display text-body-sm font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-35"
          >
            정답 확인
          </button>
        </>
      ) : null}

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
