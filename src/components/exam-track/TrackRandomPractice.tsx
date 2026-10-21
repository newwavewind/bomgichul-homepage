"use client";

import { useMemo, useState } from "react";
import { TrackPracticeQuestion } from "./TrackPracticeQuestion";
import type { ExamTrackExam } from "@/lib/exam-track/types";
import { fallbackToc, tocKey, type TrackSubjectToc } from "@/lib/exam-track/toc";
import { formatExamRefLabel } from "@/lib/exam-track/sourceLabel";

/**
 * 시험 트랙의 랜덤 문제(2026-10-21) — 공인중개사 랜덤 문제와 같은 모양.
 * 연도·단원(교재 목차 순, 편마다 묶음)·문제 수를 고르고 「필터 적용하고 시작」→ 필터는 접히고 문제가 이어진다.
 * 문제는 선지를 고르고 「정답 확인」하면 맞힘·틀림과 각 선지 아래 해설, 맨 아래 공통 해설이 나온다.
 */
const SIZES = [10, 20, 30, 40];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function chip(selected: boolean) {
  return `min-h-10 rounded-full border px-3 font-display text-[12px] font-medium transition-colors ${
    selected ? "border-carbon bg-carbon text-paper" : "border-mist bg-paper text-ink hover:bg-snow"
  }`;
}

export function TrackRandomPractice({
  scope,
  exams,
  toc,
  loginNextFor,
  attemptOf,
  onAttempt,
}: {
  scope: string;
  exams: ExamTrackExam[];
  toc: TrackSubjectToc | null;
  loginNextFor: (exam: ExamTrackExam) => string;
  attemptOf: (exam: ExamTrackExam) => "correct" | "wrong" | null;
  onAttempt: (exam: ExamTrackExam, result: "correct" | "wrong") => void | Promise<void>;
}) {
  const resolvedToc = useMemo(() => {
    const base = toc && toc.parts.length ? toc : fallbackToc(exams);
    // 문항이 하나도 없는 장·편은 숨긴다(앱 목차엔 있어도 기출이 없는 장이 있다)
    const used = new Set(exams.map((exam) => base.byQuestion[tocKey(exam)]).filter(Boolean));
    return {
      ...base,
      parts: base.parts
        .map((part) => ({ ...part, chapters: part.chapters.filter((chapter) => used.has(chapter.id)) }))
        .filter((part) => part.chapters.length > 0),
    };
  }, [toc, exams]);
  const years = useMemo(() => [...new Set(exams.map((exam) => exam.year))].sort((a, b) => b - a), [exams]);

  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [size, setSize] = useState(20);
  const [collapsed, setCollapsed] = useState(false);
  const [questions, setQuestions] = useState<ExamTrackExam[]>([]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<string, "correct" | "wrong">>({});
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);

  const toggle = <T,>(value: T, list: T[], setter: (next: T[]) => void) =>
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);

  const start = () => {
    const pool = exams.filter((exam) => {
      if (selectedYears.length && !selectedYears.includes(exam.year)) return false;
      if (selectedUnits.length) {
        const chapter = resolvedToc.byQuestion[tocKey(exam)];
        if (!chapter || !selectedUnits.includes(chapter)) return false;
      }
      return true;
    });
    setQuestions(shuffle(pool).slice(0, size));
    setIndex(0);
    setResults({});
    setFinished(false);
    setStarted(true);
    setCollapsed(true);
  };

  const current = questions[index] ?? null;
  const summary = [
    selectedYears.length ? `연도 ${selectedYears.length}개` : "전체 연도",
    selectedUnits.length ? `단원 ${selectedUnits.length}개` : "전체 단원",
    `${size}문제`,
  ].join(" · ");

  return (
    <div className="mt-5">
      {collapsed ? (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-[var(--radius-cards)] border border-carbon bg-surface px-5 py-3.5">
          <p className="min-w-0 font-display text-body-sm text-ink">
            <span className="font-semibold">연도·단원 필터</span>
            <span className="ml-2 text-smoke">{summary}</span>
          </p>
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            aria-expanded={false}
            className="shrink-0 rounded-full border border-mist bg-paper px-4 py-2 font-display text-[13px] font-semibold text-ink hover:bg-snow"
          >
            다시 펼치기 ▾
          </button>
        </div>
      ) : (
        <div className="mb-6 rounded-[var(--radius-cards)] border border-carbon bg-surface p-5">
          <p className="mb-4 font-display text-body-sm font-semibold text-ink">연도·단원 필터</p>
          <div className="mb-4">
            <p className="mb-2 font-display text-[12px] font-medium text-fog">연도</p>
            <div className="flex flex-wrap gap-2">
              {years.map((year) => (
                <button key={year} type="button" onClick={() => toggle(year, selectedYears, setSelectedYears)} className={chip(selectedYears.includes(year))}>
                  {year}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <p className="mb-2 font-display text-[12px] font-medium text-fog">단원 (교재 목차 순)</p>
            <div className="space-y-3">
              {resolvedToc.parts.map((part, partIndex) => (
                <div key={`${part.label}-${partIndex}`}>
                  <p className="mb-1.5 font-display text-[12px] font-semibold text-ink">
                    {partIndex + 1}편 · {part.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {part.chapters.map((chapter) => (
                      <button key={chapter.id} type="button" onClick={() => toggle(chapter.id, selectedUnits, setSelectedUnits)} className={chip(selectedUnits.includes(chapter.id))}>
                        {chapter.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-5">
            <p className="mb-2 font-display text-[12px] font-medium text-fog">문제 수</p>
            <div role="radiogroup" aria-label="문제 수" className="inline-flex rounded-[var(--radius-buttons)] border border-mist bg-paper p-1">
              {SIZES.map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={size === n}
                  onClick={() => setSize(n)}
                  className={`min-w-[3.25rem] rounded-[calc(var(--radius-buttons)-2px)] px-3.5 py-2 font-display text-body-sm font-medium tabular-nums transition-colors ${
                    size === n ? "bg-carbon text-paper shadow-[var(--shadow-button)]" : "text-smoke hover:text-ink"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center justify-center rounded-[var(--radius-buttons)] border border-carbon bg-paper px-7 py-2.5 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
          >
            필터 적용하고 시작
          </button>
        </div>
      )}

      {started && !questions.length ? (
        <p className="rounded-[var(--radius-cards)] border border-carbon bg-paper p-8 text-center font-display text-body text-smoke">
          선택한 조건에 맞는 문제가 없어요. 필터를 조정해 보세요.
        </p>
      ) : null}

      {started && finished ? (
        <div className="mx-auto max-w-xl rounded-[var(--radius-largecards)] border border-carbon bg-paper p-8 text-center">
          <p className="font-display text-body-sm text-smoke">랜덤 문제 연습 결과</p>
          <p className="mt-2 font-display text-heading-sm font-bold text-ink">
            {questions.length}문제 중 <span className="text-[#6366f1]">{Object.values(results).filter((r) => r === "correct").length}개</span> 맞혔어요
          </p>
          <button
            type="button"
            onClick={start}
            className="mt-6 inline-flex rounded-[var(--radius-buttons)] border border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink hover:bg-snow"
          >
            같은 조건으로 다시 풀기
          </button>
        </div>
      ) : null}

      {started && !finished && current ? (
        <div>
          <div className="mb-4 flex items-center justify-between font-display text-body-sm text-fog">
            <span>{index + 1} / {questions.length}</span>
            <span>{formatExamRefLabel(scope, current.year, current.sourceCode)} · {current.questionNo}번</span>
          </div>
          <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-mist">
            <div className="h-full rounded-full bg-[#6366f1] transition-all" style={{ width: `${(index / questions.length) * 100}%` }} />
          </div>
          <TrackPracticeQuestion
            key={tocKey(current)}
            exam={current}
            loginNext={loginNextFor(current)}
            initialAttemptResult={attemptOf(current)}
            onAttempt={(result) => {
              setResults((prev) => ({ ...prev, [tocKey(current)]: result }));
              return onAttempt(current, result);
            }}
          />
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={() => (index + 1 >= questions.length ? setFinished(true) : setIndex(index + 1))}
              className="rounded-full bg-carbon px-5 py-2.5 font-display text-body-sm font-semibold text-paper"
            >
              {index + 1 >= questions.length ? "결과 보기" : "다음 문제"} →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
