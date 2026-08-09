"use client";

import Link from "next/link";
import { formatDDay, clampDDay, DDAY_MIN, DDAY_MAX } from "@/lib/exam";

interface DDayNavigatorProps {
  days: number;
  entryCount: number;
  baseHref?: string;
}

export function DDayNavigator({
  days,
  entryCount,
  baseHref = "/diary",
}: DDayNavigatorProps) {
  const current = clampDDay(days);
  const prev = current < DDAY_MAX ? current + 1 : null;
  const next = current > DDAY_MIN ? current - 1 : null;

  return (
    <div className="rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper px-4 py-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between gap-3">
        {prev != null ? (
          <Link
            href={`${baseHref}?d=${prev}`}
            className="flex min-w-[72px] flex-col items-start rounded-[var(--radius-buttons)] border border-mist px-3 py-2 transition-colors hover:bg-snow"
            aria-label={`${formatDDay(prev)}로 이동`}
          >
            <span className="font-display text-[11px] text-fog">← 이전</span>
            <span className="font-display text-body-sm font-semibold text-ink">
              {formatDDay(prev)}
            </span>
          </Link>
        ) : (
          <div className="min-w-[72px]" />
        )}

        <div className="text-center">
          <p className="font-handwritten text-[1.2rem] text-electric-blue">공개 일기</p>
          <p className="font-display text-[40px] font-bold leading-none text-ink md:text-[48px]">
            {formatDDay(current)}
          </p>
          <p className="mt-2 font-display text-body-sm text-smoke">
            {entryCount > 0
              ? `${entryCount}명의 기록이 있어요`
              : "아직 기록이 없어요. 첫 일기를 남겨보세요!"}
          </p>
        </div>

        {next != null ? (
          <Link
            href={`${baseHref}?d=${next}`}
            className="flex min-w-[72px] flex-col items-end rounded-[var(--radius-buttons)] border border-mist px-3 py-2 transition-colors hover:bg-snow"
            aria-label={`${formatDDay(next)}로 이동`}
          >
            <span className="font-display text-[11px] text-fog">다음 →</span>
            <span className="font-display text-body-sm font-semibold text-ink">
              {formatDDay(next)}
            </span>
          </Link>
        ) : (
          <div className="min-w-[72px]" />
        )}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2 border-t border-mist pt-4">
        {[300, 200, 100, 50, 30, 7, 0].map((jump) => (
          <Link
            key={jump}
            href={`${baseHref}?d=${jump}`}
            className={`rounded-[var(--radius-tags)] border px-2.5 py-1 font-display text-[12px] font-medium transition-colors ${
              current === jump
                ? "border-carbon bg-carbon text-paper"
                : "border-mist text-smoke hover:border-carbon hover:text-ink"
            }`}
          >
            {formatDDay(jump)}
          </Link>
        ))}
      </div>
    </div>
  );
}
