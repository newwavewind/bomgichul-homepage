"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { DailyVisitTrendPoint } from "@/lib/site-visits";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

type VisitDateCalendarProps = {
  selectedDate: string;
  year: number;
  month: number;
  dayCounts: Record<string, number>;
};

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function VisitDateCalendar({
  selectedDate,
  year,
  month,
  dayCounts,
}: VisitDateCalendarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const cells = useMemo(() => {
    const firstWeekday = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const items: Array<{ day: number | null; key: string | null }> = [];

    for (let i = 0; i < firstWeekday; i++) {
      items.push({ day: null, key: null });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      items.push({ day, key: dateKey(year, month, day) });
    }
    return items;
  }, [year, month]);

  const goTo = (nextDate: string, nextYear: number, nextMonth: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", nextDate);
    params.set("month", `${nextYear}-${String(nextMonth).padStart(2, "0")}`);
    router.push(`/admin/visits?${params.toString()}`);
  };

  const shiftMonth = (delta: number) => {
    const d = new Date(year, month - 1 + delta, 1);
    const nextYear = d.getFullYear();
    const nextMonth = d.getMonth() + 1;
    const day = Math.min(
      Number(selectedDate.split("-")[2]) || 1,
      new Date(nextYear, nextMonth, 0).getDate()
    );
    goTo(dateKey(nextYear, nextMonth, day), nextYear, nextMonth);
  };

  return (
    <div className="rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper p-3 shadow-[var(--shadow-card)] sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-mist font-display text-body-sm text-ink hover:bg-snow sm:h-auto sm:w-auto sm:px-3 sm:py-1.5"
          aria-label="이전 달"
        >
          ←
        </button>
        <p className="font-display text-body font-semibold text-ink sm:text-heading-sm">
          {year}년 {month}월
        </p>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-mist font-display text-body-sm text-ink hover:bg-snow sm:h-auto sm:w-auto sm:px-3 sm:py-1.5"
          aria-label="다음 달"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center sm:gap-1">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-1 font-display text-[10px] font-medium text-fog sm:text-[11px]"
          >
            {label}
          </div>
        ))}
        {cells.map((cell, index) => {
          if (!cell.day || !cell.key) {
            return <div key={`empty-${index}`} className="min-h-[40px] sm:aspect-square" />;
          }

          const count = dayCounts[cell.key] ?? 0;
          const isSelected = cell.key === selectedDate;

          return (
            <button
              key={cell.key}
              type="button"
              onClick={() => goTo(cell.key!, year, month)}
              className={`flex min-h-[40px] flex-col items-center justify-center rounded-md border font-display transition-colors sm:aspect-square sm:rounded-lg ${
                isSelected
                  ? "border-electric-blue bg-electric-blue/10 text-ink"
                  : count === 0
                    ? "border-transparent text-fog hover:border-mist hover:bg-snow"
                    : "border-transparent text-ink hover:border-mist hover:bg-snow"
              }`}
              aria-label={`${cell.day}일, 방문자 ${count}명`}
              aria-pressed={isSelected}
            >
              <span className="text-[13px] font-medium sm:text-body-sm">{cell.day}</span>
              {count > 0 ? (
                <span className="text-[9px] font-semibold text-electric-blue sm:text-[10px]">
                  {count}
                </span>
              ) : (
                <span className="text-[9px] text-transparent sm:text-[10px]">0</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type VisitTrendChartProps = {
  points: DailyVisitTrendPoint[];
  selectedDate: string;
};

export function VisitTrendChart({ points, selectedDate }: VisitTrendChartProps) {
  const maxVisitors = Math.max(1, ...points.map((p) => p.uniqueVisitors));
  const chartHeight = 72;

  return (
    <div className="rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper p-3 shadow-[var(--shadow-card)] sm:p-4">
      <p className="mb-1 font-display text-[11px] font-medium uppercase tracking-wide text-fog sm:text-[12px]">
        방문자 추이
      </p>
      <p className="mb-3 font-display text-[13px] text-smoke sm:mb-4 sm:text-body-sm">
        최근 {points.length}일 · 순 방문자 (KST)
      </p>

      <div
        className="flex items-end gap-0.5 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] sm:gap-1 sm:pb-2"
        role="img"
        aria-label="일별 순 방문자 추이"
      >
        {points.map((point) => {
          const barHeight =
            point.uniqueVisitors > 0
              ? Math.max(8, Math.round((point.uniqueVisitors / maxVisitors) * chartHeight))
              : 2;
          const isSelected = point.date === selectedDate;
          const [, m, d] = point.date.split("-");

          return (
            <div
              key={point.date}
              className="flex w-8 shrink-0 flex-col items-center gap-0.5 sm:w-auto sm:min-w-[28px] sm:flex-1"
              title={`${point.date}: 순 방문자 ${point.uniqueVisitors}명 · 페이지뷰 ${point.pageViews}`}
            >
              <span className="min-h-[12px] font-display text-[9px] text-fog sm:text-[10px]">
                {point.uniqueVisitors > 0 ? point.uniqueVisitors : ""}
              </span>
              <div
                className={`w-full max-w-[28px] rounded-t-sm transition-colors sm:max-w-[32px] sm:rounded-t-md ${
                  isSelected ? "bg-electric-blue" : "bg-electric-blue/35"
                }`}
                style={{ height: `${barHeight}px` }}
              />
              <span
                className={`font-display text-[9px] sm:text-[10px] ${
                  isSelected ? "font-semibold text-ink" : "text-fog"
                }`}
              >
                {Number(m)}/{Number(d)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
