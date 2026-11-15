import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  dailyPoolUsesRounds,
  getDailyEligiblePool,
  getDailyPool,
} from "@/lib/daily-challenge/pool";

describe("history daily eligible pool", () => {
  it("limits history to the latest 10 rounds (~500 questions)", () => {
    const pool = getDailyEligiblePool("history", "simhwa");
    const rounds = [
      ...new Set(
        pool
          .map((question) => question.round)
          .filter((round): round is number => typeof round === "number"),
      ),
    ].sort((a, b) => b - a);

    expect(dailyPoolUsesRounds("history", "simhwa")).toBe(true);
    expect(rounds).toEqual([80, 79, 78, 77, 76, 75, 74, 73, 72, 71]);
    expect(pool.length).toBe(500);
    expect(pool.every((question) => question.round != null && question.round >= 71)).toBe(
      true,
    );
  });

  it("keeps salt subject id as history:simhwa via subjectId field", () => {
    const full = getDailyPool("history").filter((q) => q.subjectId === "simhwa");
    expect(full.length).toBe(800);
    expect(full.every((q) => q.subjectId === "simhwa")).toBe(true);
  });
});
