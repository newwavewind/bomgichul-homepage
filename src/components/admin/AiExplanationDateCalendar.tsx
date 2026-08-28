"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function toIsoDate(year: number, monthIndex0: number, day: number) {
  return `${year}-${String(monthIndex0 + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildCells(year: number, monthIndex0: number) {
  const firstWeekday = new Date(Date.UTC(year, monthIndex0, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, monthIndex0 + 1, 0)).getUTCDate();
  const cells: ({ day: number; iso: string } | null)[] = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, iso: toIsoDate(year, monthIndex0, day) });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function buildHref(basePath: string, params: { subject?: string; date?: string | null }) {
  const qs = new URLSearchParams();
  if (params.date) qs.set("date", params.date);
  if (params.subject) qs.set("subject", params.subject);
  const s = qs.toString();
  return s ? `${basePath}?${s}` : basePath;
}

export function AiExplanationDateCalendar({
  selectedDate,
  subject,
  today,
  counts,
  /** 해설 화면과 개념 화면이 같은 달력을 쓴다 — 돌아갈 곳만 다르다 */
  basePath = "/admin/ai-explanations",
}: {
  selectedDate: string | null;
  subject?: string;
  today: string;
  counts: Record<string, number>;
  basePath?: string;
}) {
  const initial = selectedDate ?? today;
  const [initY, initM] = initial.split("-").map(Number);
  const [year, setYear] = useState(initY);
  const [monthIndex0, setMonthIndex0] = useState(initM - 1);

  useEffect(() => {
    const focus = selectedDate ?? today;
    const [y, m] = focus.split("-").map(Number);
    setYear(y);
    setMonthIndex0(m - 1);
  }, [selectedDate, today]);

  const cells = useMemo(() => buildCells(year, monthIndex0), [year, monthIndex0]);
  const monthPrefix = `${year}-${String(monthIndex0 + 1).padStart(2, "0")}`;
  const monthTotal = Object.entries(counts).reduce(
    (sum, [key, n]) => (key.startsWith(monthPrefix) ? sum + n : sum),
    0
  );

  const goMonth = (delta: number) => {
    const next = new Date(Date.UTC(year, monthIndex0 + delta, 1));
    setYear(next.getUTCFullYear());
    setMonthIndex0(next.getUTCMonth());
  };

  const earliestMonth = Object.keys(counts).sort()[0]?.slice(0, 7);
  const todayMonth = today.slice(0, 7);
  const prevMonth = toIsoDate(
    monthIndex0 === 0 ? year - 1 : year,
    monthIndex0 === 0 ? 11 : monthIndex0 - 1,
    1
  ).slice(0, 7);
  const nextMonth = toIsoDate(
    monthIndex0 === 11 ? year + 1 : year,
    monthIndex0 === 11 ? 0 : monthIndex0 + 1,
    1
  ).slice(0, 7);
  const disablePrev = Boolean(earliestMonth && prevMonth < earliestMonth);
  const disableNext = nextMonth > todayMonth;

  return (
    <div className="rounded-[var(--radius-cards)] border border-mist bg-paper p-3 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goMonth(-1)}
            disabled={disablePrev}
            aria-label="이전 달"
            className="rounded-[var(--radius-buttons)] border border-mist px-2.5 py-1.5 font-display text-[12px] text-ink disabled:opacity-30"
          >
            ←
          </button>
          <p className="min-w-[7.5rem] text-center font-display text-body-sm font-semibold text-ink">
            {year}년 {monthIndex0 + 1}월
          </p>
          <button
            type="button"
            onClick={() => goMonth(1)}
            disabled={disableNext}
            aria-label="다음 달"
            className="rounded-[var(--radius-buttons)] border border-mist px-2.5 py-1.5 font-display text-[12px] text-ink disabled:opacity-30"
          >
            →
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Link
            href={buildHref(basePath, { subject })}
            className={`rounded-[var(--radius-tags)] px-2.5 py-1 font-display text-[12px] ${
              !selectedDate ? "bg-midnight text-paper" : "bg-surface text-ink hover:bg-snow"
            }`}
          >
            전체
          </Link>
          <Link
            href={buildHref(basePath, { subject, date: today })}
            className={`rounded-[var(--radius-tags)] px-2.5 py-1 font-display text-[12px] ${
              selectedDate === today ? "bg-midnight text-paper" : "bg-surface text-ink hover:bg-snow"
            }`}
          >
            오늘
          </Link>
          <span className="self-center font-display text-[11px] text-fog">
            이 달 {monthTotal}건
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1 font-display text-[11px] font-semibold text-fog">
            {d}
          </div>
        ))}
        {cells.map((cell, i) => {
          if (!cell) return <div key={`e-${i}`} />;
          const count = counts[cell.iso] ?? 0;
          const selected = selectedDate === cell.iso;
          const isToday = cell.iso === today;
          const future = cell.iso > today;
          return (
            <Link
              key={cell.iso}
              href={buildHref(basePath, { subject, date: cell.iso })}
              aria-current={selected ? "date" : undefined}
              aria-label={`${cell.iso}${count ? ` · ${count}건` : ""}`}
              className={`relative flex min-h-10 flex-col items-center justify-center rounded-xl font-display text-[13px] transition-colors ${
                selected
                  ? "bg-midnight text-paper"
                  : count > 0
                    ? "bg-ios-blue/[0.08] text-ink hover:bg-ios-blue/15"
                    : future
                      ? "text-fog/50 hover:bg-snow"
                      : "text-smoke hover:bg-snow"
              } ${isToday && !selected ? "ring-1 ring-ios-blue/40" : ""}`}
            >
              <span className="leading-none">{cell.day}</span>
              {count > 0 ? (
                <span
                  className={`mt-0.5 text-[9px] leading-none ${
                    selected ? "text-paper/80" : "text-ios-blue"
                  }`}
                >
                  {count}
                </span>
              ) : (
                <span className="mt-0.5 h-[9px]" aria-hidden />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
