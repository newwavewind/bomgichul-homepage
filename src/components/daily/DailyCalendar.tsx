"use client";

import Link from "next/link";
import { useState } from "react";
import { formatKoreanDate } from "@/lib/daily-challenge/format";
import { DAILY_ARCHIVE_START_DATE } from "@/lib/daily-challenge/pick";
import type { DailyCalendarStatus } from "@/lib/daily-challenge/types";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function monthKey(dateKey: string) {
  return dateKey.slice(0, 7);
}

function monthStart(dateKey: string) {
  return `${monthKey(dateKey)}-01`;
}

function shiftMonth(dateKey: string, amount: number) {
  const [year, month] = dateKey.split("-").map(Number);
  const shifted = new Date(Date.UTC(year, month - 1 + amount, 1));
  return shifted.toISOString().slice(0, 10);
}

function shiftDay(dateKey: string, amount: number) {
  const shifted = new Date(`${dateKey}T00:00:00Z`);
  shifted.setUTCDate(shifted.getUTCDate() + amount);
  return shifted.toISOString().slice(0, 10);
}

function daysInMonth(dateKey: string) {
  const [year, month] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function dayOfWeek(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

function hrefFor(exam: string, subjectId: string, dateKey: string) {
  return `/${exam}/daily?subject=${encodeURIComponent(subjectId)}&date=${dateKey}`;
}

export function DailyCalendar({
  exam,
  subjectId,
  dateKey,
  todayDateKey,
  statuses = {},
  embedded = false,
}: {
  exam: string;
  subjectId: string;
  dateKey: string;
  todayDateKey: string;
  statuses?: Record<string, DailyCalendarStatus>;
  embedded?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [calendarView, setCalendarView] = useState(() => ({
    dateKey,
    month: monthStart(dateKey),
  }));
  const visibleMonth =
    calendarView.dateKey === dateKey
      ? calendarView.month
      : monthStart(dateKey);
  const setVisibleMonth = (month: string) =>
    setCalendarView({ dateKey, month });
  const firstDay = visibleMonth;
  const totalDays = daysInMonth(visibleMonth);
  const leading = dayOfWeek(firstDay);
  const previousMonth = shiftMonth(firstDay, -1);
  const nextMonth = shiftMonth(firstDay, 1);
  const previousDay = shiftDay(dateKey, -1);
  const nextDay = shiftDay(dateKey, 1);
  const canGoPrevious =
    monthKey(previousMonth) >= monthKey(DAILY_ARCHIVE_START_DATE);
  const canGoNext = monthKey(nextMonth) <= monthKey(todayDateKey);
  const canGoPreviousDay = previousDay >= DAILY_ARCHIVE_START_DATE;
  const canGoNextDay = nextDay <= todayDateKey;
  const cellCount = Math.ceil((leading + totalDays) / 7) * 7;
  const cells = Array.from({ length: cellCount }, (_, index) => {
    const day = index - leading + 1;
    if (day < 1 || day > totalDays) return null;
    return `${monthKey(visibleMonth)}-${String(day).padStart(2, "0")}`;
  });
  const selectedMonth = Number(dateKey.slice(5, 7));
  const selectedDay = Number(dateKey.slice(8, 10));
  const displayedMonth = Number(visibleMonth.slice(5, 7));

  return (
    <section
      className={
        embedded
          ? "mb-5 border-b border-[#e6eef8] pb-5"
          : "rounded-[24px] border border-[#dbe7f5] bg-white/90 p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
      }
      aria-label="날짜별 매일 10문제"
    >
      <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-stretch gap-2">
        {canGoPreviousDay ? (
          <Link
            href={hrefFor(exam, subjectId, previousDay)}
            aria-label={`이전 날짜 ${formatKoreanDate(previousDay)} 문제 보기`}
            className="flex min-h-12 items-center justify-center rounded-[14px] border border-[#e1e7ef] bg-white/80 text-[#4d78a8] shadow-[0_3px_12px_rgba(15,23,42,0.06)] transition-colors hover:bg-white active:bg-[#f4f7fb]"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-5 fill-none stroke-current stroke-2"
            >
              <path d="m15 5-7 7 7 7" />
            </svg>
          </Link>
        ) : (
          <button
            type="button"
            disabled
            aria-label="이전 날짜는 제공되지 않습니다"
            className="flex min-h-12 items-center justify-center rounded-[14px] border border-[#e1e7ef] bg-white/50 text-[#b8c2cf]"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-5 fill-none stroke-current stroke-2"
            >
              <path d="m15 5-7 7 7 7" />
            </svg>
          </button>
        )}

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="daily-calendar-panel"
          className="flex min-w-0 items-center justify-between rounded-[14px] border border-[#e1e7ef] bg-white/80 px-3 py-2.5 text-left text-[#1d1d1f] shadow-[0_3px_12px_rgba(15,23,42,0.07)] backdrop-blur-xl transition-colors hover:bg-white active:bg-[#f4f7fb] sm:px-4"
        >
          <span className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-[15px] font-semibold tracking-[-0.01em]">
              {selectedMonth}월 {selectedDay}일
            </span>
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className={`size-4 shrink-0 fill-none stroke-[#7d8794] stroke-[1.8] transition-transform ${open ? "rotate-180" : ""}`}
            >
              <path d="m5 7.5 5 5 5-5" />
            </svg>
          </span>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[#edf5ff] text-[#4d78a8]">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-5 fill-none stroke-current stroke-[1.7]"
            >
              <rect x="3.5" y="4.5" width="17" height="16" rx="3" />
              <path d="M7.5 2.5v4M16.5 2.5v4M3.5 9h17m-12 5 2.2 2.2 4.8-4.8" />
            </svg>
          </span>
        </button>

        {canGoNextDay ? (
          <Link
            href={hrefFor(exam, subjectId, nextDay)}
            aria-label={`다음 날짜 ${formatKoreanDate(nextDay)} 문제 보기`}
            className="flex min-h-12 items-center justify-center rounded-[14px] border border-[#e1e7ef] bg-white/80 text-[#4d78a8] shadow-[0_3px_12px_rgba(15,23,42,0.06)] transition-colors hover:bg-white active:bg-[#f4f7fb]"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-5 fill-none stroke-current stroke-2"
            >
              <path d="m9 5 7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <button
            type="button"
            disabled
            aria-label="다음 날짜는 아직 열리지 않았습니다"
            className="flex min-h-12 items-center justify-center rounded-[14px] border border-[#e1e7ef] bg-white/50 text-[#b8c2cf]"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-5 fill-none stroke-current stroke-2"
            >
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {open
        ? (
          <section
            id="daily-calendar-panel"
            aria-label="날짜별 기출 10문제 달력"
            className="mt-3 w-full overflow-hidden rounded-[20px] border border-[#e1e7ef] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
          >
            <header className="grid grid-cols-[auto_1fr_auto] items-center gap-2 border-b border-[#e5e7eb] px-4 py-4 sm:px-6">
              {dateKey === todayDateKey ? (
                <button
                  type="button"
                  onClick={() => setVisibleMonth(monthStart(todayDateKey))}
                  className="rounded-full border border-[#dbe2ea] px-3 py-1.5 text-sm font-semibold text-[#64748b]"
                >
                  오늘
                </button>
              ) : (
                <Link
                  href={hrefFor(exam, subjectId, todayDateKey)}
                  className="rounded-full border border-[#dbe2ea] px-3 py-1.5 text-sm font-semibold text-[#64748b]"
                >
                  오늘
                </Link>
              )}

              <div className="flex min-w-0 items-center justify-center gap-2 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setVisibleMonth(previousMonth)}
                  disabled={!canGoPrevious}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-3xl font-light text-[#334155] hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-25"
                  aria-label="이전 달"
                >
                  ‹
                </button>
                <h2 className="whitespace-nowrap text-lg font-bold tracking-[-0.02em] text-[#0f172a] sm:text-2xl">
                  {Number(visibleMonth.slice(0, 4))}년 {displayedMonth}월
                </h2>
                <button
                  type="button"
                  onClick={() => setVisibleMonth(nextMonth)}
                  disabled={!canGoNext}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-3xl font-light text-[#334155] hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-25"
                  aria-label="다음 달"
                >
                  ›
                </button>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="달력 닫기"
                className="relative size-10 rounded-full hover:bg-[#f1f5f9]"
              >
                <span className="absolute left-2 top-1/2 h-px w-6 -translate-y-1/2 rotate-45 bg-[#0f172a]" />
                <span className="absolute left-2 top-1/2 h-px w-6 -translate-y-1/2 -rotate-45 bg-[#0f172a]" />
              </button>
            </header>

            <MonthGrid
              cells={cells}
              exam={exam}
              subjectId={subjectId}
              dateKey={dateKey}
              todayDateKey={todayDateKey}
              statuses={statuses}
            />

            <footer className="space-y-4 px-5 py-5 sm:px-7">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-[#64748b]">
                <span className="mr-auto">
                  {Number(visibleMonth.slice(0, 4))}년 {displayedMonth}월 날짜 선택
                </span>
                <span className="text-[#007AFF]">★ 만점</span>
                <span className="text-[#EA580C]">● 복습</span>
                <span className="text-[#94a3b8]">● 미완료</span>
              </div>
              <p className="border-t border-[#eef2f7] pt-4 text-sm leading-6 text-[#64748b]">
                날짜를 누르면 그날의 기출 10문제와 학습 기록을 확인할 수 있습니다.
              </p>
            </footer>
          </section>
        )
        : null}
    </section>
  );
}

function MonthGrid({
  cells,
  exam,
  subjectId,
  dateKey,
  todayDateKey,
  statuses,
}: {
  cells: (string | null)[];
  exam: string;
  subjectId: string;
  dateKey: string;
  todayDateKey: string;
  statuses: Record<string, DailyCalendarStatus>;
}) {
  return (
    <div>
      <div className="grid grid-cols-7 border-b border-[#e5e7eb] text-center text-sm font-semibold text-[#64748b]">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday} className="py-3.5">
            {weekday}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center">
        {cells.map((cell, index) =>
          cell ? (
            <DateCell
              key={cell}
              cell={cell}
              exam={exam}
              subjectId={subjectId}
              dateKey={dateKey}
              todayDateKey={todayDateKey}
              status={statuses[cell]}
            />
          ) : (
            <span
              key={`empty-${index}`}
              className="h-16 border-b border-[#edf1f5]"
            />
          ),
        )}
      </div>
    </div>
  );
}

function DateCell({
  cell,
  exam,
  subjectId,
  dateKey,
  todayDateKey,
  status,
}: {
  cell: string;
  exam: string;
  subjectId: string;
  dateKey: string;
  todayDateKey: string;
  status?: DailyCalendarStatus;
}) {
  const unavailable = cell < DAILY_ARCHIVE_START_DATE || cell > todayDateKey;
  const selected = cell === dateKey;
  const today = cell === todayDateKey;
  const label = Number(cell.slice(-2));
  if (unavailable) {
    return (
      <span className="flex h-16 items-center justify-center border-b border-[#edf1f5] text-sm font-semibold text-[#c4c7cc]">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={hrefFor(exam, subjectId, cell)}
      aria-label={`${formatKoreanDate(cell)} 문제 보기${today ? ", 오늘" : ""}${status ? `, ${status.correct}점` : ""}`}
      aria-current={selected ? "date" : undefined}
      className="group relative flex h-16 items-center justify-center border-b border-[#edf1f5] text-sm font-semibold text-[#0f172a]"
    >
      <span
        className={`flex size-10 items-center justify-center rounded-full transition-colors ${selected ? "bg-[#0B2C6B] text-white shadow-[0_4px_12px_rgba(11,44,107,0.24)]" : "group-hover:bg-[#eef5ff] group-hover:text-[#0066D6]"}`}
      >
        {label}
      </span>
      {status ? (
        <span
          className={`absolute bottom-1 text-[9px] font-bold ${selected ? "text-[#0B2C6B]" : status.needsReview ? "text-[#EA580C]" : "text-[#007AFF]"}`}
        >
          {status.correct === status.total
            ? "★"
            : status.needsReview
              ? "●"
              : `${status.correct}`}
        </span>
      ) : today && !selected ? (
        <span className="absolute bottom-1 size-1.5 rounded-full bg-[#007AFF]" />
      ) : cell < todayDateKey ? (
        <span className="absolute bottom-1 size-1.5 rounded-full bg-[#e2e8f0]" />
      ) : null}
    </Link>
  );
}
