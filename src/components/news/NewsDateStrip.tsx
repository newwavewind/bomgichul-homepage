import Link from "next/link";

interface NewsDateStripProps {
  dates: string[];
  selected: string | null;
}

function formatDateChip(dateStr: string): string {
  const [, month, day] = dateStr.split("-");
  return `${Number(month)}.${Number(day)}`;
}

function formatWeekday(dateStr: string): string {
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"] as const;
  const date = new Date(`${dateStr}T12:00:00+09:00`);
  return weekdays[date.getDay()] ?? "";
}

function formatDateChipLabel(dateStr: string): string {
  return `${formatDateChip(dateStr)} ${formatWeekday(dateStr)}`;
}

export function NewsDateStrip({ dates, selected }: NewsDateStripProps) {
  if (dates.length === 0) return null;

  return (
    <div className="mb-5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div
        className="flex min-w-min gap-2"
        role="tablist"
        aria-label="뉴스 날짜 선택"
      >
        {dates.map((date) => {
          const isActive = date === selected;
          const href = `/news?date=${date}`;

          return (
            <Link
              key={date}
              href={href}
              role="tab"
              aria-selected={isActive}
              className={`
                inline-flex shrink-0 items-center whitespace-nowrap rounded-[var(--radius-tags)]
                px-3.5 py-2 font-display text-body-sm font-semibold transition-colors
                ${
                  isActive
                    ? "bg-midnight text-paper"
                    : "border border-mist bg-surface text-ink hover:bg-snow"
                }
              `}
            >
              {formatDateChipLabel(date)}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
