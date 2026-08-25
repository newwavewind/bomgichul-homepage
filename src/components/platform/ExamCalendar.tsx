"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  EXAM_CALENDAR_COLORS,
  EXAM_CALENDAR_EVENTS,
  examCalendarKindLabel,
  eventsInMonth,
  eventsOnDate,
  getKstTodayIso,
  toIsoDate,
  type ExamCalendarEvent,
} from "@/data/exam-calendar";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function formatKoDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

function formatRange(event: ExamCalendarEvent): string {
  if (!event.endDate || event.endDate === event.date) return formatKoDate(event.date);
  return `${formatKoDate(event.date)} ～ ${formatKoDate(event.endDate)}`;
}

function monthLabel(year: number, monthIndex0: number): string {
  return `${year}년 ${monthIndex0 + 1}월`;
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

function uniqueExamKeys(events: ExamCalendarEvent[]) {
  const seen = new Set<string>();
  const keys: ExamCalendarEvent["examKey"][] = [];
  for (const event of events) {
    if (seen.has(event.examKey)) continue;
    seen.add(event.examKey);
    keys.push(event.examKey);
  }
  return keys;
}

export function ExamCalendar() {
  const todayIso = getKstTodayIso();
  const [todayY, todayM] = todayIso.split("-").map(Number);
  const [year, setYear] = useState(todayY);
  const [monthIndex0, setMonthIndex0] = useState(todayM - 1);
  const [selectedIso, setSelectedIso] = useState(() => {
    if (eventsOnDate(todayIso).length) return todayIso;
    const monthPrefix = todayIso.slice(0, 7);
    const upcoming = EXAM_CALENDAR_EVENTS
      .flatMap((event) => {
        const end = event.endDate ?? event.date;
        if (end < todayIso) return [];
        if (event.date.startsWith(monthPrefix) || end.startsWith(monthPrefix)) {
          return [event.date < todayIso ? todayIso : event.date];
        }
        return [];
      })
      .sort();
    return upcoming[0] ?? todayIso;
  });

  const cells = useMemo(() => buildCells(year, monthIndex0), [year, monthIndex0]);
  const monthEvents = useMemo(() => eventsInMonth(year, monthIndex0), [year, monthIndex0]);
  const selectedEvents = useMemo(() => eventsOnDate(selectedIso), [selectedIso]);

  const goMonth = (delta: number) => {
    const next = new Date(Date.UTC(year, monthIndex0 + delta, 1));
    const y = next.getUTCFullYear();
    const m = next.getUTCMonth();
    setYear(y);
    setMonthIndex0(m);
    const isoInMonth = selectedIso.startsWith(`${y}-${String(m + 1).padStart(2, "0")}`);
    if (!isoInMonth) {
      const first = eventsInMonth(y, m).map((e) => e.date).sort()[0];
      setSelectedIso(first ?? toIsoDate(y, m, 1));
    }
  };

  const earliest = EXAM_CALENDAR_EVENTS.map((e) => e.date).sort()[0] ?? "2025-12-01";
  const latest =
    EXAM_CALENDAR_EVENTS.map((e) => e.endDate ?? e.date).sort().at(-1) ?? "2026-12-31";
  const prevMonthKey = toIsoDate(
    monthIndex0 === 0 ? year - 1 : year,
    monthIndex0 === 0 ? 11 : monthIndex0 - 1,
    1,
  ).slice(0, 7);
  const nextMonthKey = toIsoDate(
    monthIndex0 === 11 ? year + 1 : year,
    monthIndex0 === 11 ? 0 : monthIndex0 + 1,
    1,
  ).slice(0, 7);
  const disablePrev = prevMonthKey < earliest.slice(0, 7);
  const disableNext = nextMonthKey > latest.slice(0, 7);

  return (
    <section
      className="mx-auto mb-12 max-w-5xl rounded-[28px] border-[1.5px] border-carbon/15 bg-gradient-to-br from-[#e8f5ff]/50 to-[#f4f8ff]/80 p-5 shadow-[var(--shadow-card)] md:p-8"
      aria-label="시험 달력"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-[13px] font-semibold tracking-[0.05em] text-[#087f6d]">
            시험 달력
          </p>
          <h2 className="mt-1 font-display text-[24px] font-semibold tracking-tight text-ink md:text-[28px]">
            {monthLabel(year, monthIndex0)}
          </h2>
          <p className="mt-1 font-display text-[13px] text-smoke">
            날짜를 누르면 그날의 시험·접수·발표 일정이 아래에 열립니다. 공식 공고 기준입니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goMonth(-1)}
            disabled={disablePrev}
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-carbon/20 bg-paper font-display text-body-sm font-semibold text-ink disabled:opacity-40"
            aria-label="이전 달"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => {
              setYear(todayY);
              setMonthIndex0(todayM - 1);
              setSelectedIso(todayIso);
            }}
            className="inline-flex min-h-10 items-center rounded-full border border-carbon/20 bg-paper px-4 font-display text-[13px] font-semibold text-ink"
          >
            오늘
          </button>
          <button
            type="button"
            onClick={() => goMonth(1)}
            disabled={disableNext}
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-carbon/20 bg-paper font-display text-body-sm font-semibold text-ink disabled:opacity-40"
            aria-label="다음 달"
          >
            →
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-mist bg-paper">
        <div className="grid grid-cols-7 border-b border-mist bg-snow/80">
          {WEEKDAYS.map((label) => (
            <div
              key={label}
              className="px-1 py-2.5 text-center font-display text-[12px] font-semibold text-fog"
            >
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((cell, index) => {
            if (!cell) {
              return <div key={`empty-${index}`} className="min-h-[52px] border-b border-r border-mist/70 bg-snow/40 md:min-h-[64px]" />;
            }
            const dayEvents = eventsOnDate(cell.iso);
            const keys = uniqueExamKeys(dayEvents);
            const isSelected = cell.iso === selectedIso;
            const isToday = cell.iso === todayIso;
            const hasEvents = dayEvents.length > 0;
            return (
              <button
                key={cell.iso}
                type="button"
                onClick={() => setSelectedIso(cell.iso)}
                className={[
                  "relative flex min-h-[52px] flex-col items-stretch border-b border-r border-mist/70 px-1.5 py-1.5 text-left transition-colors md:min-h-[64px]",
                  isSelected ? "bg-[#e8f5ff]" : hasEvents ? "bg-white hover:bg-snow" : "bg-white hover:bg-snow/60",
                ].join(" ")}
                aria-pressed={isSelected}
                aria-label={`${formatKoDate(cell.iso)}${hasEvents ? `, 일정 ${dayEvents.length}건` : ""}`}
              >
                <span
                  className={[
                    "inline-flex h-7 w-7 items-center justify-center rounded-full font-display text-[13px] font-semibold",
                    isToday ? "bg-carbon text-paper" : isSelected ? "text-[#0b5fff]" : "text-ink",
                  ].join(" ")}
                >
                  {cell.day}
                </span>
                {keys.length > 0 ? (
                  <span className="mt-auto flex flex-wrap gap-0.5 pb-0.5">
                    {keys.slice(0, 4).map((key) => (
                      <span
                        key={key}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: EXAM_CALENDAR_COLORS[key] }}
                        aria-hidden
                      />
                    ))}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {monthEvents.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {uniqueExamKeys(monthEvents).map((key) => {
            const sample = monthEvents.find((e) => e.examKey === key);
            return (
              <li key={key} className="flex items-center gap-1.5 font-display text-[12px] text-smoke">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: EXAM_CALENDAR_COLORS[key] }}
                  aria-hidden
                />
                {sample?.examLabel ?? key}
              </li>
            );
          })}
        </ul>
      ) : null}

      <div className="mt-6 rounded-2xl border border-mist bg-paper px-4 py-5 md:px-6">
        <p className="font-display text-[13px] font-semibold text-fog">선택한 날</p>
        <p className="mt-1 font-display text-[20px] font-semibold text-ink">{formatKoDate(selectedIso)}</p>

        {selectedEvents.length === 0 ? (
          <p className="mt-4 font-display text-body text-smoke">이 날에는 등록된 시험 일정이 없습니다.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {selectedEvents.map((event) => (
              <li
                key={event.id}
                className="rounded-2xl border border-mist bg-snow/60 px-4 py-3.5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: EXAM_CALENDAR_COLORS[event.examKey] }}
                    aria-hidden
                  />
                  <span className="font-display text-[12px] font-semibold text-fog">
                    {event.examLabel} · {examCalendarKindLabel(event.kind)}
                  </span>
                </div>
                <p className="mt-1.5 font-display text-body-sm font-semibold text-ink">{event.title}</p>
                <p className="mt-1 font-display text-[13px] text-smoke">{formatRange(event)}</p>
                <p className="mt-1 font-display text-[13px] text-smoke">{event.detail}</p>
                <Link
                  href={event.href}
                  className="mt-3 inline-flex font-display text-body-sm font-semibold text-[#0b5fff] underline-offset-2 hover:underline"
                >
                  {event.examLabel} 안내 보기 →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-4 font-display text-[12px] text-fog">
        일정은 공식 시행계획·공고를 요약한 것입니다. 변경될 수 있으니 원서 접수 전 해당 기관 공고를 다시 확인하세요.
      </p>
    </section>
  );
}
