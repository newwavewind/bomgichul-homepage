"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DailyChoiceBadge } from "@/components/daily/DailyChoiceBadge";
import { DailyQuestionDiscussion } from "@/components/daily/DailyQuestionDiscussion";
import {
  DailyChoiceContent,
  DailyQuestionBody,
} from "@/components/daily/DailyQuestionBody";
import { CitedText } from "@/components/exam/CitedText";
import { DailyExplanationText } from "@/components/daily/DailyExplanationText";
import { splitDailyExplanation } from "@/lib/daily-challenge/explanation";
import type { DailyReviewItem } from "@/lib/daily-challenge/types";

/**
 * 채점 뒤 문제·해설 보기 — 한 문제씩 좌우로 넘긴다(2026-10-20).
 *
 * 예전엔 열 문제를 위아래로 길게 늘어놓아 해설을 읽다 보면 몇 번인지 놓쳤다. 이제 한 장에 한 문제만
 * 보이고, 위 번호 줄(넓은 화면은 ‹ › 단추도)·아래 이전/다음 단추·키보드 ←→·휴대폰 옆으로 밀기로 넘긴다. 번호 줄은 해설을 연
 * 뒤에만 맞힘(파랑)·틀림(빨강)을 칠한다 — 해설을 가린 동안 정답이 새지 않게.
 */
export function DailyReviewList({
  items,
  showAnswers = true,
}: {
  items: DailyReviewItem[];
  showAnswers?: boolean;
}) {
  const [rawIndex, setIndex] = useState(0);
  const index = Math.min(rawIndex, Math.max(0, items.length - 1));
  const sectionRef = useRef<HTMLElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const go = (next: number, scroll = false) => {
    const clamped = Math.max(0, Math.min(items.length - 1, next));
    if (clamped === index) return;
    setIndex(clamped);
    // 아래 단추로 넘겼을 때 새 문제의 머리가 화면 위로 지나가 있으면 끌어올린다.
    const top = sectionRef.current?.getBoundingClientRect().top ?? 0;
    if (scroll && top < 0) {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      setIndex((current) => {
        const base = Math.min(current, Math.max(0, items.length - 1));
        return Math.max(0, Math.min(items.length - 1, base + (event.key === "ArrowRight" ? 1 : -1)));
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items.length]);

  if (!items.length) return null;
  const item = items[index];

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="문제별 정답과 해설"
      className="mt-5 scroll-mt-20"
    >
      <div className="flex items-center gap-2">
        <ArrowButton direction="prev" disabled={index === 0} onClick={() => go(index - 1)} />
        <ol className="flex min-w-0 flex-1 flex-wrap justify-center gap-1 py-1 sm:gap-1.5">
          {items.map((entry, i) => {
            const tone = !showAnswers
              ? "border-[#DDE9F6] bg-white text-[#475569]"
              : entry.ok
                ? "border-[#91C6FF] bg-[#F1F8FF] text-[#0066D6]"
                : "border-[#FFB3C1] bg-[#FFF2F5] text-[#D7003A]";
            const current = i === index;
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`${i + 1}번 문제${showAnswers ? (entry.ok ? " · 맞힘" : " · 틀림") : ""}`}
                  aria-current={current ? "step" : undefined}
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-semibold tabular-nums transition-shadow sm:size-8 sm:text-[13px] ${tone} ${current ? "ring-2 ring-[#007AFF] ring-offset-1" : "hover:border-[#007AFF]"}`}
                >
                  {i + 1}
                </button>
              </li>
            );
          })}
        </ol>
        <ArrowButton direction="next" disabled={index === items.length - 1} onClick={() => go(index + 1)} />
      </div>

      <div
        className="mt-3"
        onTouchStart={(event) => {
          const target = event.target as HTMLElement;
          // 옆으로 넘기는 표·입력칸 안에서 시작한 밀기는 넘김으로 보지 않는다.
          if (target.closest("table, .overflow-x-auto, input, textarea")) {
            touchStart.current = null;
            return;
          }
          const touch = event.touches[0];
          touchStart.current = { x: touch.clientX, y: touch.clientY };
        }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start) return;
          const touch = event.changedTouches[0];
          const dx = touch.clientX - start.x;
          const dy = touch.clientY - start.y;
          if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
          go(index + (dx < 0 ? 1 : -1));
        }}
      >
        <ReviewCard key={item.id} item={item} index={index} total={items.length} showAnswers={showAnswers} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => go(index - 1, true)}
          disabled={index === 0}
          className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-[#cfe0f5] bg-white px-4 text-sm font-semibold text-ink transition-colors hover:border-[#007AFF] disabled:cursor-default disabled:opacity-40 disabled:hover:border-[#cfe0f5]"
        >
          <span aria-hidden>←</span> 이전 문제
        </button>
        <button
          type="button"
          onClick={() => go(index + 1, true)}
          disabled={index === items.length - 1}
          className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#007AFF] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0066D6] disabled:cursor-default disabled:bg-[#cfe0f5] disabled:text-[#64748b]"
        >
          다음 문제 <span aria-hidden>→</span>
        </button>
      </div>
    </section>
  );
}

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "이전 문제" : "다음 문제"}
      className="hidden size-9 shrink-0 items-center justify-center rounded-full border border-[#cfe0f5] bg-white text-ink transition-colors hover:border-[#007AFF] disabled:cursor-default disabled:opacity-35 disabled:hover:border-[#cfe0f5] sm:flex"
    >
      <svg viewBox="0 0 20 20" className="size-4" aria-hidden>
        <path
          d={direction === "prev" ? "M12.5 4.5 7 10l5.5 5.5" : "M7.5 4.5 13 10l-5.5 5.5"}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function ReviewCard({
  item,
  index,
  total,
  showAnswers,
}: {
  item: DailyReviewItem;
  index: number;
  total: number;
  showAnswers: boolean;
}) {
  const explanation = splitDailyExplanation(item.explanation, item.choices);
  const hasChoiceExplanations = Object.keys(explanation.byChoice).length > 0;
  return (
    <article
      aria-roledescription="slide"
      aria-label={`${total}문제 중 ${index + 1}번`}
      className="rounded-2xl border border-[#e6eef8] bg-white/70 px-2.5 py-3 sm:px-4"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 text-xs text-[#64748b]">
          {index + 1} / {total} · {item.sourceLabel}
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
          <div className="mt-1.5">
            <DailyExplanationText
              text={
                explanation.common ||
                "이 문항의 해설은 문항 페이지에 있습니다."
              }
            />
          </div>
        </div>
      ) : null}
      {showAnswers ? <DailyQuestionDiscussion questionId={item.id} /> : null}
    </article>
  );
}
