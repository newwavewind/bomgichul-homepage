"use client";

import Link from "next/link";
import { DailyChoiceBadge } from "@/components/daily/DailyChoiceBadge";
import { DailyQuestionDiscussion } from "@/components/daily/DailyQuestionDiscussion";
import {
  DailyChoiceContent,
  DailyQuestionBody,
} from "@/components/daily/DailyQuestionBody";
import { CitedText } from "@/components/exam/CitedText";
import { splitDailyExplanation } from "@/lib/daily-challenge/explanation";
import type { DailyReviewItem } from "@/lib/daily-challenge/types";

export function DailyReviewList({
  items,
  showAnswers = true,
}: {
  items: DailyReviewItem[];
  showAnswers?: boolean;
}) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item, index) => {
        const explanation = splitDailyExplanation(
          item.explanation,
          item.choices,
        );
        const hasChoiceExplanations =
          Object.keys(explanation.byChoice).length > 0;
        return (
          <li
            key={item.id}
            className="rounded-2xl border border-[#e6eef8] bg-white/70 px-2.5 py-3 sm:px-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 text-xs text-[#64748b]">
                {index + 1}. {item.sourceLabel}
              </p>
              <Link
                href={item.href}
                className="shrink-0 text-xs font-medium text-[#64748b] transition-colors hover:text-[#0066D6]"
              >
                이 문항으로 →
              </Link>
            </div>
            <DailyQuestionBody
              stem={item.stem}
              presentation={item.presentation}
              questionNo={index + 1}
              heading="h3"
            />
            <div className="mt-3 grid gap-2">
              {item.choices.map((choice) => {
                const isPicked = item.picked === choice.key;
                const isCorrect = item.correctKeys.includes(choice.key);
                const choiceStyle = showAnswers
                  ? isCorrect
                    ? "border-[#91C6FF] bg-[#F1F8FF]"
                    : isPicked
                      ? "border-[#FFB3C1] bg-[#FFF2F5]"
                      : "border-[#DDE9F6] bg-white"
                  : "border-[#DDE9F6] bg-white";
                const explanationLabelStyle = isCorrect
                  ? "bg-[#DCEEFF] text-[#0066D6]"
                  : isPicked
                    ? "bg-[#FFE1E8] text-[#C70036]"
                    : "bg-[#EAF3FE] text-[#47739E]";
                return (
                  <div
                    key={choice.key}
                    className={`rounded-2xl border px-3 py-2.5 text-ink sm:px-4 ${choiceStyle}`}
                  >
                    <div className="flex gap-3">
                      <DailyChoiceBadge
                        label={choice.label}
                        tone={
                          showAnswers
                            ? isCorrect
                              ? "selected"
                              : isPicked
                                ? "incorrect"
                                : "default"
                            : "default"
                        }
                      />
                      <DailyChoiceContent
                        choice={choice}
                        choiceHeaders={item.presentation.choiceHeaders}
                      />
                    </div>
                    {showAnswers && (isPicked || isCorrect) ? (
                      <p
                        className={`mt-2 pl-9 text-sm font-semibold ${isCorrect ? "text-[#007AFF]" : "text-[#D7003A]"}`}
                      >
                        {isPicked && isCorrect
                          ? "내 선택 · 정답"
                          : isCorrect
                            ? "정답"
                            : "내 선택"}
                      </p>
                    ) : null}
                    {showAnswers && explanation.byChoice[choice.key] ? (
                      <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-white/70 px-3 py-2.5">
                        <span
                          className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold leading-5 ${explanationLabelStyle}`}
                        >
                          해설
                        </span>
                        <p className="min-w-0 flex-1 text-sm leading-6 text-[#475569]">
                          <CitedText text={explanation.byChoice[choice.key]!} />
                        </p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            {showAnswers && (explanation.common || !hasChoiceExplanations) ? (
              <div className="mt-4 border-t border-[#e6eef8] pt-4">
                <p className="text-sm font-semibold text-[#0066D6]">
                  {hasChoiceExplanations ? "공통 해설" : "해설"}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-base leading-7 text-[#334155]">
                  <CitedText
                    text={
                      explanation.common ||
                      "이 문항의 해설은 문항 페이지에 있습니다."
                    }
                  />
                </p>
              </div>
            ) : null}
            {showAnswers ? (
              <DailyQuestionDiscussion questionId={item.id} />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
