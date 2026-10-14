import { describe, expect, it } from "vitest";
import { pickDailyIds, shiftDateKey } from "./pick";

describe("pickDailyIds", () => {
  const ids = Array.from({ length: 200 }, (_, index) => `q${index}`);

  it("같은 날짜는 같은 10문항이다", () => {
    const a = pickDailyIds(ids, "2026-10-14", "real-estate", 10);
    const b = pickDailyIds(ids, "2026-10-14", "real-estate", 10);
    expect(a).toEqual(b);
    expect(a).toHaveLength(10);
    expect(new Set(a).size).toBe(10);
  });

  it("바로 다음 날은 직전 세트와 겹치지 않는다", () => {
    const today = pickDailyIds(ids, "2026-10-14", "police", 10);
    const next = pickDailyIds(ids, shiftDateKey("2026-10-14", 1), "police", 10);
    expect(next.some((id) => today.includes(id))).toBe(false);
  });

  it("연습 소금은 공식 10문제와 다른 세트를 고른다", () => {
    const ranked = pickDailyIds(ids, "2026-10-14", "housing", 10);
    const practice = pickDailyIds(ids, "2026-10-14", "housing:practice", 10);
    expect(practice).not.toEqual(ranked);
  });
});
