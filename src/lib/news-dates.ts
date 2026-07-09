const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export function formatNewsDateLabel(dateStr: string): string {
  const [, month, day] = dateStr.split("-");
  const date = new Date(`${dateStr}T12:00:00+09:00`);
  const weekday = WEEKDAYS[date.getDay()] ?? "";
  return `${Number(month)}월 ${Number(day)}일 (${weekday})`;
}

export function getAdjacentNewsDates(
  dates: string[],
  selected: string | null
): { prev: string | null; next: string | null } {
  if (!selected) return { prev: null, next: null };
  const index = dates.indexOf(selected);
  if (index < 0) return { prev: null, next: null };
  // dates는 최신순 — 이전=더 오래된 날, 다음=더 최근 날
  return {
    prev: index < dates.length - 1 ? (dates[index + 1] ?? null) : null,
    next: index > 0 ? (dates[index - 1] ?? null) : null,
  };
}
