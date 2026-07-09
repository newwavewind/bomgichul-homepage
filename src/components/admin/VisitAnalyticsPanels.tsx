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
    <div className="rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper p-4 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          className="rounded-lg border border-mist px-3 py-1.5 font-display text-body-sm text-ink hover:bg-snow"
          aria-label="이전 달"
        >
          ←
        </button>
        <p className="font-display text-heading-sm font-semibold text-ink">
          {year}년 {month}월
        </p>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="rounded-lg border border-mist px-3 py-1.5 font-display text-body-sm text-ink hover:bg-snow"
          aria-label="다음 달"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-1 font-display text-[11px] font-medium text-fog"
          >
            {label}
          </div>
        ))}
        {cells.map((cell, index) => {
          if (!cell.day || !cell.key) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const count = dayCounts[cell.key] ?? 0;
          const isSelected = cell.key === selectedDate;

          return (
            <button
              key={cell.key}
              type="button"
              onClick={() => goTo(cell.key!, year, month)}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg border font-display transition-colors ${
                isSelected
                  ? "border-electric-blue bg-electric-blue/10 text-ink"
                  : count === 0
                    ? "border-transparent text-fog hover:border-mist hover:bg-snow"
                    : "border-transparent text-ink hover:border-mist hover:bg-snow"
              }`}
              aria-label={`${cell.day}일, 방문자 ${count}명`}
              aria-pressed={isSelected}
            >
              <span className="text-body-sm font-medium">{cell.day}</span>
              {count > 0 ? (
                <span className="text-[10px] font-semibold text-electric-blue">
                  {count}
                </span>
              ) : (
                <span className="text-[10px] text-transparent">0</span>
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

  return (
    <div className="rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper p-4 shadow-[var(--shadow-card)]">
      <p className="mb-1 font-display text-[12px] font-medium uppercase tracking-wide text-fog">
        방문자 추이
      </p>
      <p className="mb-4 font-display text-body-sm text-smoke">
        최근 {points.length}일 · 순 방문자 수 (한국 시간)
      </p>

      <div className="flex items-end gap-1 overflow-x-auto pb-2" role="img" aria-label="일별 순 방문자 추이">
        {points.map((point) => {
          const height = Math.round((point.uniqueVisitors / maxVisitors) * 100);
          const isSelected = point.date === selectedDate;
          const [, m, d] = point.date.split("-");

          return (
            <div
              key={point.date}
              className="flex min-w-[28px] flex-1 flex-col items-center gap-1"
              title={`${point.date}: 순 방문자 ${point.uniqueVisitors}명 · 페이지뷰 ${point.pageViews}`}
            >
              <span className="font-display text-[10px] text-fog">
                {point.uniqueVisitors > 0 ? point.uniqueVisitors : ""}
              </span>
              <div
                className={`w-full max-w-[32px] rounded-t-md transition-colors ${
                  isSelected ? "bg-electric-blue" : "bg-electric-blue/35"
                }`}
                style={{ height: `${Math.max(point.uniqueVisitors > 0 ? 8 : 2, height)}px` }}
              />
              <span
                className={`font-display text-[10px] ${
                  isSelected ? "font-semibold text-ink" : "text-fog"
                }`}
              >
                {Number(d)}/{Number(m)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
