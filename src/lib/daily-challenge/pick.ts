/** 날짜 씨앗으로 같은 날 같은 10문항을 고른다. 최근 날짜와 겹치지 않게 앞에서부터 채운다. */

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

/**
 * `ids` 순서는 호출마다 같아야 한다.
 * 하루 세트는 그 날짜를 포함한 직전 `lookback`일의 세트에 없는 문항을 먼저 쓴다.
 */
export function pickDailyIds(
  ids: string[],
  dateKey: string,
  salt: string,
  count: number,
  lookback = 14,
): string[] {
  if (count <= 0 || ids.length === 0) return [];
  const take = Math.min(count, ids.length);
  const memo = new Map<string, string[]>();
  const start = shiftDateKey(dateKey, -lookback);

  let cursor = start;
  while (cursor <= dateKey) {
    const used = new Set<string>();
    for (let i = 1; i <= lookback; i++) {
      const prev = memo.get(shiftDateKey(cursor, -i));
      prev?.forEach((id) => used.add(id));
    }
    const fresh = ids.filter((id) => !used.has(id));
    const source = fresh.length >= take ? fresh : ids;
    memo.set(cursor, seededOrder(source, `${salt}:${cursor}`).slice(0, take));
    cursor = shiftDateKey(cursor, 1);
  }

  return memo.get(dateKey) ?? [];
}
