import { describe, expect, it } from "vitest";
import { formatElapsed } from "@/lib/daily-challenge/format";
import { INVALID_ELAPSED_MS } from "@/lib/daily-challenge/timing";

describe("formatElapsed", () => {
  it("formats a measured duration below 30 minutes", () => {
    expect(formatElapsed(5 * 60 * 1000 + 39 * 1000)).toBe("5분 39초");
  });

  it("labels measured durations at or above 30 minutes without false precision", () => {
    expect(formatElapsed(30 * 60 * 1000)).toBe("30분 이상");
    expect(formatElapsed(45 * 60 * 1000)).toBe("30분 이상");
  });

  it("labels an invalid timing separately", () => {
    expect(formatElapsed(INVALID_ELAPSED_MS)).toBe("시간 확인 불가");
  });
});
