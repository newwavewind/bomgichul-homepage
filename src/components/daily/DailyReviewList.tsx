"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DailyChoiceBadge } from "@/components/daily/DailyChoiceBadge";
import { DailyQuestionDiscussion } from "@/components/daily/DailyQuestionDiscussion";
import {
  DailyOxComboTable,
  dailyOxTableFrom,
} from "@/components/daily/DailyOxComboTable";
import {
  DailyChoiceContent,
  DailyQuestionBody,
} from "@/components/daily/DailyQuestionBody";
import {
  ExamQuestionSeoExplanations,
  type SeoExplanationQuestion,
} from "@/components/exam/ExamQuestionSeoExplanations";
import { ExplanationChoiceSelection } from "@/components/exam/ExamSeoExplanationDetails";
import { getDailyReviewExplanations } from "@/lib/daily-challenge/actions";
import { scopeFromPathname } from "@/lib/exam-track/community";
import { EnglishPassageNotes } from "@/components/english/EnglishPassageNotes";
import { splitDailyExplanation } from "@/lib/daily-challenge/explanation";
import type { DailyReviewItem } from "@/lib/daily-challenge/types";

/**
 * 채점 뒤 문제·해설 보기 — 한 문제씩 좌우로 넘긴다(2026-10-20).
 *
 * 예전엔 열 문제를 위아래로 길게 늘어놓아 해설을 읽다 보면 몇 번인지 놓쳤다. 이제 한 장에 한 문제만
 * 보이고, 위 번호 줄(넓은 화면은 ‹ › 단추도)·아래 이전/다음 단추·키보드 ←→·휴대폰 옆으로 밀기로 넘긴다. 번호 줄은 해설을 연
 * 뒤에만 맞힘(파랑)·틀림(빨강)을 칠한다 — 해설을 가린 동안 정답이 새지 않게.
 */
type ReviewExplanations = Awaited<ReturnType<typeof getDailyReviewExplanations>>;

export function DailyReviewList({
  exam,
  subjectLabel,
  items,
  showAnswers = true,
}: {
  exam: string;
  subjectLabel: string;
  items: DailyReviewItem[];
  showAnswers?: boolean;
}) {
  const [rawIndex, setIndex] = useState(0);
  const [explanations, setExplanations] = useState<ReviewExplanations>({});
  const questionIds = items.filter((item) => !item.structuredExplanation).map(({ id }) => id).join("\n");

  useEffect(() => {
    if (!showAnswers || !questionIds) return;
    let current = true;
    void getDailyReviewExplanations(exam, questionIds.split("\n")).then((next) => {
      if (current) setExplanations(next);
    }).catch(() => {
      // The saved result has a copy of the explanations for offline review.
    });
    return () => { current = false; };
  }, [exam, questionIds, showAnswers]);
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
      if (target?.closest("input, textarea, select, [contenteditable='true'], dialog[open]")) return;
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
              ? "border-[color:light-dark(#DDE9F6,var(--color-mist))] bg-white text-smoke"
              : entry.ok
                ? "border-[color:light-dark(#91C6FF,var(--color-mist))] bg-[color:light-dark(#F1F8FF,color-mix(in_srgb,var(--color-snow)_90%,#F1F8FF))] text-[color:light-dark(#0066D6,var(--color-carbon))]"
                : "border-[color:light-dark(#FFB3C1,var(--color-mist))] bg-[color:light-dark(#FFF2F5,color-mix(in_srgb,var(--color-snow)_90%,#FFF2F5))] text-[color:light-dark(#D7003A,var(--color-coral))]";
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
          if (target.closest("table, .overflow-x-auto, input, textarea, dialog[open]")) {
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
        <ReviewCard
          key={item.id}
          item={item}
          index={index}
          total={items.length}
          showAnswers={showAnswers}
          subjectLabel={subjectLabel}
          explanation={item.structuredExplanation ?? explanations[item.id]}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => go(index - 1, true)}
          disabled={index === 0}
          className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-[color:light-dark(#cfe0f5,var(--color-mist))] bg-white px-4 text-sm font-semibold text-ink transition-colors hover:border-[#007AFF] disabled:cursor-default disabled:opacity-40 disabled:hover:border-[color:light-dark(#cfe0f5,var(--color-mist))]"
        >
          <span aria-hidden>←</span> 이전 문제
        </button>
        <button
          type="button"
          onClick={() => go(index + 1, true)}
          disabled={index === items.length - 1}
          className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#007AFF] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0066D6] disabled:cursor-default disabled:bg-[color:light-dark(#cfe0f5,color-mix(in_srgb,var(--color-snow)_90%,#cfe0f5))] disabled:text-fog"
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
      className="hidden size-9 shrink-0 items-center justify-center rounded-full border border-[color:light-dark(#cfe0f5,var(--color-mist))] bg-white text-ink transition-colors hover:border-[#007AFF] disabled:cursor-default disabled:opacity-35 disabled:hover:border-[color:light-dark(#cfe0f5,var(--color-mist))] sm:flex"
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
  subjectLabel,
  explanation,
}: {
  item: DailyReviewItem;
  index: number;
  total: number;
  showAnswers: boolean;
  subjectLabel: string;
  explanation?: ReviewExplanations[string];
}) {
  const question = showAnswers ? explanation?.question ?? savedExplanation(item) : null;
  const oxTable = dailyOxTableFrom(item.presentation.promptItems, item.choices);
  const explainedKeys = new Set(question?.items.filter((choice) =>
    choice.answer?.trim() || choice.explanation?.trim()
  ).map(({ key }) => key));
  const showOriginalChoices = !question
    || Boolean(oxTable || question.comboChoices?.length || item.presentation.choiceHeaders.length)
    || item.choices.some((choice) => choice.image || choice.translation || !explainedKeys.has(choice.key));
  return (
    <article
      aria-roledescription="slide"
      aria-label={`${total}문제 중 ${index + 1}번`}
      className="rounded-2xl border border-[color:light-dark(#e6eef8,var(--color-mist))] bg-white/70 px-2.5 py-3 sm:px-4"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 text-xs text-fog">
          {index + 1} / {total} · {item.sourceLabel}
        </p>
        <Link
          href={item.href}
          className="shrink-0 text-xs font-medium text-fog transition-colors hover:text-[color:light-dark(#0066D6,var(--color-carbon))]"
        >
          이 문항으로 →
        </Link>
      </div>
      <DailyQuestionBody
        stem={item.stem}
        presentation={item.presentation}
        questionNo={index + 1}
        heading="h3"
        subjectId={item.id.split(":")[1]}
      />
      {/* 공무원 영어 — 문항 화면과 같은 순서: 지문 해석 → 해설 → 어휘(2026-10-21) */}
      {showAnswers && item.translation ? (
        <section className="mt-3 rounded-2xl border border-[color:light-dark(#e6eef8,var(--color-mist))] bg-[color:light-dark(#F8FAFC,var(--color-snow))] px-3 py-2.5 sm:px-4">
          <p className="text-sm font-semibold text-[color:light-dark(#0066D6,var(--color-carbon))]">지문 해석</p>
          <p className="mt-1 whitespace-pre-line text-[15px] leading-7 text-smoke">{item.translation}</p>
        </section>
      ) : null}
      {showOriginalChoices && (oxTable ? (
        <DailyOxComboTable
          headers={oxTable.headers}
          rows={oxTable.rows}
          choices={item.choices}
          correctKeys={item.correctKeys}
          pickedKey={item.picked}
          showAnswers={showAnswers}
        />
      ) : (
        <div className="mt-3 grid gap-2">
          {item.choices.map((choice) => {
            const isPicked = showAnswers && item.picked === choice.key;
            const isCorrect = showAnswers && item.correctKeys.includes(choice.key);
            const tone = isCorrect ? "selected" : isPicked ? "incorrect" : "default";
            return (
              <div key={choice.key} className="flex gap-3 rounded-2xl border border-mist bg-paper px-3 py-2.5 text-ink sm:px-4">
                <DailyChoiceBadge label={choice.label} tone={tone} />
                <DailyChoiceContent choice={choice} choiceHeaders={item.presentation.choiceHeaders} questionId={item.id} />
              </div>
            );
          })}
        </div>
      ))}
      {question ? (
        <ExplanationChoiceSelection choice={item.picked ? { number: Number(item.picked), incorrect: !item.ok } : null}>
          <ExamQuestionSeoExplanations
            question={question}
            subjectLabel={subjectLabel}
            scope={scopeFromPathname(item.href)}
            glossaryByChoice={explanation?.glossaryByChoice}
            glossaryPro={explanation?.glossaryOffers?.length ? { path: item.href, offers: explanation.glossaryOffers } : undefined}
            pickedChoice={item.pickedLabel.normalize("NFKC").replace(/^(\d+)$/, "$1번")}
            embedded
          />
        </ExplanationChoiceSelection>
      ) : null}
      {showAnswers && item.vocab?.length ? (
        <div className="-mt-4">
          <EnglishPassageNotes exam={{ vocab: item.vocab }} showTranslation={false} />
        </div>
      ) : null}
      {showAnswers ? <DailyQuestionDiscussion questionId={item.id} /> : null}
    </article>
  );
}

/** Review sessions saved before the current exam data was loaded remain readable. */
function savedExplanation(item: DailyReviewItem): SeoExplanationQuestion {
  const statements = item.presentation.promptItems;
  const statementNotes = splitDailyExplanation(item.explanation, statements);
  const hasStatementNotes = Object.keys(statementNotes.byChoice).length > 0;
  const choices = hasStatementNotes ? statements : item.choices;
  const { common, byChoice } = hasStatementNotes
    ? statementNotes
    : splitDailyExplanation(item.explanation, choices);
  const path = item.href.split("/");
  return {
    year: Number(path.at(path[1] === "exam" ? -2 : -3)),
    questionNo: Number(path.at(-1)),
    stem: item.stem,
    category: item.category,
    correctChoice: item.correctKeys.length === 1 ? item.correctKeys[0] : undefined,
    correctChoices: item.correctKeys.length > 1 ? item.correctKeys.map(Number) : undefined,
    explanationSummary: common || (item.explanation.trim() ? undefined : "이 문항의 해설은 문항 페이지에 있습니다."),
    items: choices.map((choice) => {
      const explanation = byChoice[choice.key];
      const verdict = hasStatementNotes ? explanation?.match(/^\((옳음|틀림)\)\s*/) : null;
      return {
        ...choice,
        answer: verdict ? (verdict[1] === "옳음" ? "O" : "X") : undefined,
        explanation: verdict ? explanation?.slice(verdict[0].length) : explanation,
      };
    }),
  };
}
