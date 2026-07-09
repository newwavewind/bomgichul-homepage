"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  formatNewsDateLabel,
  getAdjacentNewsDates,
} from "@/lib/news-dates";

interface NewsDateNavigatorProps {
  dates: string[];
  selected: string | null;
  countsByDate: Record<string, number>;
}

export function NewsDateNavigator({
  dates,
  selected,
  countsByDate,
}: NewsDateNavigatorProps) {
  const router = useRouter();

  if (dates.length === 0 || !selected) return null;

  const { prev, next } = getAdjacentNewsDates(dates, selected);
  const selectedLabel = formatNewsDateLabel(selected);
  const selectedCount = countsByDate[selected] ?? 0;

  return (
    <div className="mb-5 rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper px-4 py-4 shadow-[var(--shadow-card)]">
      <p className="font-display text-[12px] font-medium text-fog">날짜별 보기</p>

      <div className="mt-3 flex items-center justify-between gap-2">
        {prev ? (
          <Link
            href={`/news?date=${prev}`}
            className="rounded-[var(--radius-buttons)] border border-mist px-3 py-2 font-display text-body-sm font-medium text-ink transition-colors hover:bg-snow"
            aria-label={`${formatNewsDateLabel(prev)} 뉴스 보기`}
          >
            ← 이전
          </Link>
        ) : (
          <div className="w-[4.25rem]" aria-hidden />
        )}

        <div className="min-w-0 flex-1 text-center">
          <p className="font-display text-body font-bold text-ink">{selectedLabel}</p>
          <p className="mt-1 font-display text-[12px] text-smoke">
            {selectedCount > 0 ? `기사 ${selectedCount}건` : "기사 없음"}
          </p>
        </div>

        {next ? (
          <Link
            href={`/news?date=${next}`}
            className="rounded-[var(--radius-buttons)] border border-mist px-3 py-2 font-display text-body-sm font-medium text-ink transition-colors hover:bg-snow"
            aria-label={`${formatNewsDateLabel(next)} 뉴스 보기`}
          >
            다음 →
          </Link>
        ) : (
          <div className="w-[4.25rem]" aria-hidden />
        )}
      </div>

      {dates.length > 1 ? (
        <label className="mt-4 block">
          <span className="mb-1.5 block font-display text-[12px] font-medium text-smoke">
            다른 날짜 선택
          </span>
          <select
            value={selected}
            onChange={(event) => {
              router.push(`/news?date=${event.target.value}`);
            }}
            className="w-full rounded-[var(--radius-buttons)] border border-mist bg-surface px-3 py-2.5 font-display text-body-sm text-ink outline-none focus:border-carbon"
            aria-label="뉴스 날짜 선택"
          >
            {dates.map((date) => {
              const count = countsByDate[date] ?? 0;
              return (
                <option key={date} value={date}>
                  {formatNewsDateLabel(date)}
                  {count > 0 ? ` · ${count}건` : ""}
                </option>
              );
            })}
          </select>
        </label>
      ) : null}
    </div>
  );
}
