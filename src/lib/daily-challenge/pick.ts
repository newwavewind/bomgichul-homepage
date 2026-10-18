/** 날짜별로 같은 문제 묶음을 재현하고, 전체 문제를 한 번씩 소진한 뒤에만 다시 출제한다. */

const DAILY_SCHEDULE_EPOCH = "2026-01-01";
export const DAILY_ARCHIVE_START_DATE = DAILY_SCHEDULE_EPOCH;
// The previous schedule remains intact for submitted attempts and open quiz tabs.
export const DAILY_ROTATION_START_DATE = "2026-10-17";

export function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function shiftDateKey(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function seededOrder<T>(items: T[], seedKey: string): T[] {
  const arr = [...items];
  let seed = hashString(seedKey) || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const j = seed % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function dayNumber(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

function positiveModulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

function orderedUniqueIds(ids: string[], salt: string): string[] {
  return seededOrder([...new Set(ids)], `${salt}:daily-order:v2`);
}

function legacyDailyIds(
  ids: string[],
  dateKey: string,
  salt: string,
  count: number,
  pageOffset = 0,
): string[] {
  if (count <= 0 || ids.length === 0) return [];
  const ordered = orderedUniqueIds(ids, salt);
  const take = Math.min(count, ordered.length);
  const start = positiveModulo(
    (dayNumber(dateKey) - dayNumber(DAILY_SCHEDULE_EPOCH) + pageOffset) * take,
    ordered.length,
  );
  return Array.from(
    { length: take },
    (_, index) => ordered[(start + index) % ordered.length],
  );
}

/** A continuous stream of shuffled cycles. Every ID appears once per cycle. */
export function pickDailyIds(
  ids: string[],
  dateKey: string,
  salt: string,
  count: number,
  pageOffset = 0,
): string[] {
  if (count <= 0 || ids.length === 0) return [];
  if (dateKey < DAILY_ROTATION_START_DATE || pageOffset !== 0) {
    return legacyDailyIds(ids, dateKey, salt, count, pageOffset);
  }

  const unique = [...new Set(ids)];
  const take = Math.min(count, unique.length);
  const firstPosition =
    (dayNumber(dateKey) - dayNumber(DAILY_ROTATION_START_DATE)) * take;
  const orders: string[][] = [seededOrder(unique, `${salt}:cycle:0`)];
  const orderFor = (cycle: number) => {
    while (orders.length <= cycle) {
      const previous = orders[orders.length - 1];
      const shuffled = seededOrder(unique, `${salt}:cycle:${orders.length}`);
      // A day can straddle two cycles. Keep its two halves distinct.
      const tailCount = unique.length % take || Math.min(take, unique.length);
      const previousTail = new Set(previous.slice(-tailCount));
      orders.push([
        ...shuffled.filter((id) => !previousTail.has(id)),
        ...shuffled.filter((id) => previousTail.has(id)),
      ]);
    }
    return orders[cycle];
  };

  return Array.from({ length: take }, (_, offset) => {
    const position = firstPosition + offset;
    const cycle = Math.floor(position / unique.length);
    return orderFor(cycle)[position % unique.length];
  });
}

export type DailyPick = { id: string; nextDateKey: string | null };

/** The next planned official appearance for each question in today's set. */
export function pickDailyIdsWithNextDate(
  currentIds: string[],
  futureIds: string[],
  dateKey: string,
  salt: string,
  count: number,
  pageOffset = 0,
): DailyPick[] {
  const current = pickDailyIds(currentIds, dateKey, salt, count, pageOffset);
  const future = new Set(futureIds);
  const remaining = new Set(current.filter((id) => future.has(id)));
  const nextDates = new Map<string, string>();
  const daysUntilRotation = Math.max(
    0,
    dayNumber(DAILY_ROTATION_START_DATE) - dayNumber(dateKey),
  );
  const horizon =
    daysUntilRotation + 2 * Math.ceil(future.size / Math.max(1, count)) + 3;
  for (let daysAhead = 1; daysAhead <= horizon && remaining.size; daysAhead++) {
    const nextDate = shiftDateKey(dateKey, daysAhead);
    if (nextDate < DAILY_ROTATION_START_DATE) continue;
    for (const id of pickDailyIds(futureIds, nextDate, salt, count)) {
      if (remaining.delete(id)) nextDates.set(id, nextDate);
    }
  }
  return current.map((id) => ({ id, nextDateKey: nextDates.get(id) ?? null }));
}

/** Days of daily sets needed to encounter every requested ID from a date. */
export function daysToCoverDailyIds(
  ids: string[],
  targets: string[],
  fromDate: string,
  salt: string,
  count: number,
): number {
  const remaining = new Set(targets.filter((id) => ids.includes(id)));
  if (remaining.size === 0) return 0;
  const start = fromDate < DAILY_ROTATION_START_DATE
    ? DAILY_ROTATION_START_DATE
    : fromDate;
  const horizon = 2 * Math.ceil(ids.length / Math.max(1, count)) + 3;
  for (let day = 0; day < horizon; day++) {
    for (const id of pickDailyIds(ids, shiftDateKey(start, day), salt, count)) {
      remaining.delete(id);
    }
    if (remaining.size === 0) return day + 1;
  }
  return horizon;
}
