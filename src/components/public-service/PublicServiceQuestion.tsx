"use client";

import { useState } from "react";
import type { PublicServiceExam } from "@/lib/public-service-content";

export function PublicServiceQuestion({ exam }: { exam: PublicServiceExam }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const isCorrect = selected === exam.correctChoice;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {exam.items.map((item, index) => {
          const choice = Number(item.key || index + 1);
          const selectedItem = selected === choice;
          return (
            <button
              key={`${exam.id}-${item.key}`}
              type="button"
              onClick={() => !revealed && setSelected(choice)}
              className={`w-full rounded-2xl border px-4 py-4 text-left transition-colors ${
                selectedItem ? "border-carbon bg-snow" : "border-mist bg-paper hover:border-ash"
              }`}
            >
              <div className="flex gap-3">
                <span className="font-display font-semibold text-ink">{item.label ?? choice}</span>
                <span className="flex-1 font-system text-[15px] leading-7 text-ink">{item.text}</span>
                {revealed && item.answer ? (
                  <span className={`font-display text-[13px] font-bold ${item.answer === "O" ? "text-leaf" : "text-coral"}`}>
                    {item.answer}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={selected === null && !revealed}
        onClick={() => setRevealed((value) => !value)}
        className="w-full rounded-2xl bg-carbon px-5 py-4 font-display text-body-sm font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-35"
      >
        {revealed ? "해설 접기" : "정답·해설 보기"}
      </button>

      {revealed ? (
        <div className="space-y-4">
          <div className={`rounded-2xl border px-5 py-4 ${isCorrect ? "border-leaf/30 bg-green-50" : "border-coral/30 bg-red-50"}`}>
            <p className="font-display text-body-sm font-semibold text-ink">
              {isCorrect ? "정답입니다." : `정답은 ${exam.correctChoice}번입니다.`}
            </p>
          </div>
          <section className="rounded-2xl border border-mist bg-paper px-5 py-5" aria-label="선지별 해설">
            <h2 className="font-display text-[18px] font-semibold text-ink">선지별 해설</h2>
            <div className="mt-4 divide-y divide-mist">
              {exam.items.map((item, index) => (
                <div key={`explanation-${exam.id}-${item.key}`} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2 font-display text-body-sm font-semibold text-ink">
                    <span>{item.label ?? index + 1}</span>
                    {item.answer ? <span className={item.answer === "O" ? "text-leaf" : "text-coral"}>{item.answer}</span> : null}
                  </div>
                  {item.explanation ? <p className="mt-2 font-system text-[14px] leading-6 text-smoke">{item.explanation}</p> : null}
                </div>
              ))}
            </div>
            {!exam.items.some((item) => item.explanation) && exam.explanationSummary ? (
              <p className="font-system text-[14px] leading-6 text-smoke">{exam.explanationSummary}</p>
            ) : null}
          </section>
        </div>
      ) : null}
    </div>
  );
}
