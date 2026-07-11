"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { DailyVisitTrendPoint } from "@/lib/site-visits";

const TREND_WINDOW = 7;

type VisitTrendChartProps = {
  selectedDate: string;
  points: DailyVisitTrendPoint[];
};

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function addDays(key: string, delta: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + delta));
  return dateKey(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

function emptyPoint(date: string): DailyVisitTrendPoint {
  return {
    date,
    pageViews: 0,
    uniqueVisitors: 0,
    anonymousVisitors: 0,
    localVisitors: 0,
    loggedInVisits: 0,
  };
}

export function VisitTrendChart({ selectedDate, points }: VisitTrendChartProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pointMap = useMemo(
    () => new Map(points.map((p) => [p.date, p])),
    [points]
  );

  const [windowEnd, setWindowEnd] = useState(selectedDate);

  useEffect(() => {
    setWindowEnd(selectedDate);
  }, [selectedDate]);

  const windowPoints = useMemo(() => {
    const end = windowEnd;
    const start = addDays(end, -(TREND_WINDOW - 1));
    const list: DailyVisitTrendPoint[] = [];
    let cursor = start;
    while (cursor <= end) {
      list.push(pointMap.get(cursor) ?? emptyPoint(cursor));
      cursor = addDays(cursor, 1);
    }
    return list;
  }, [windowEnd, pointMap]);

  const maxVisitors = Math.max(1, ...windowPoints.map((p) => p.uniqueVisitors));
  const chartHeight = 88;
  const windowStart = windowPoints[0]?.date ?? selectedDate;
  const rangeLabel = `${windowStart.slice(5).replace("-", "/")} – ${windowEnd
    .slice(5)
    .replace("-", "/")}`;

  const selectDay = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", key);
    params.delete("month");
    router.push(`/admin/visits?${params.toString()}`);
  };

  const shiftWindow = (deltaWeeks: number) => {
    setWindowEnd(addDays(windowEnd, deltaWeeks * TREND_WINDOW));
  };

  return (
    <div className="rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper p-3 shadow-[var(--shadow-card)] sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => shiftWindow(-1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-mist font-display text-body-sm text-ink hover:bg-snow"
          aria-label="이전 7일"
        >
          ←
        </button>
        <div className="min-w-0 text-center">
          <p className="font-display text-[11px] font-medium uppercase tracking-wide text-fog">
            방문자 추이
          </p>
          <p className="font-display text-[13px] text-smoke sm:text-body-sm">
            {rangeLabel} · 순 방문자 (KST)
          </p>
        </div>
        <button
          type="button"
          onClick={() => shiftWindow(1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-mist font-display text-body-sm text-ink hover:bg-snow"
          aria-label="다음 7일"
        >
          →
        </button>
      </div>

      <div
        className="flex h-[148px] items-end justify-between gap-1 sm:gap-2"
        role="img"
        aria-label={`${windowStart}부터 ${windowEnd}까지 일별 순 방문자 추이`}
      >
        {windowPoints.map((point) => {
          const barHeight =
            point.uniqueVisitors > 0
              ? Math.max(8, Math.round((point.uniqueVisitors / maxVisitors) * chartHeight))
              : 2;
          const isSelected = point.date === selectedDate;
          const [, m, d] = point.date.split("-");

          return (
            <button
              key={point.date}
              type="button"
              onClick={() => selectDay(point.date)}
              className="flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-md px-0.5 py-1 transition-colors hover:bg-snow"
              title={`${point.date}: 순 방문자 ${point.uniqueVisitors}명 · 페이지뷰 ${point.pageViews}`}
              aria-pressed={isSelected}
            >
              <span className="min-h-[12px] font-display text-[9px] text-fog sm:text-[10px]">
                {point.uniqueVisitors > 0 ? point.uniqueVisitors : ""}
              </span>
              <div
                className={`w-full max-w-[36px] rounded-t-sm transition-colors sm:rounded-t-md ${
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
            </button>
          );
        })}
      </div>
    </div>
  );
}
