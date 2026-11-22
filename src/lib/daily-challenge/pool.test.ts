import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  dailyPoolUsesRounds,
  getDailyEligiblePool,
  getDailyExplanation,
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

describe("daily review uses the published exam explanations", () => {
  it.each([
    "public-service", "police", "housing", "social-worker", "english", "history",
  ])("resolves the exact question from the %s route", async (slug) => {
    const daily = getDailyPool(slug).find(({ explanation }) => explanation.length > 0);
    expect(daily).toBeDefined();
    const review = await getDailyExplanation(slug, daily!);
    expect(review?.question).toMatchObject({
      year: daily!.year,
      questionNo: Number(daily!.href.split("/").at(-1)),
      stem: daily!.stem,
    });
  });

  it("preserves choice citations, glossary and statement verdicts", async () => {
    const appraisal = getDailyPool("housing").find(({ href }) => href.endsWith("/accounting/2024/%EC%A0%9C27%ED%9A%8C/1"));
    expect(appraisal).toBeDefined();
    const review = await getDailyExplanation("housing", appraisal!);
    expect(review?.question.items[0]?.sources?.[0]?.label).toContain("계속기업 가정");
    expect(Object.keys(review?.glossaryByChoice ?? {})).not.toHaveLength(0);

    const combined = getDailyPool("real-estate").find(({ href }) => href === "/exam/civillaw/2024/48");
    expect(combined).toBeDefined();
    const combinationReview = await getDailyExplanation("real-estate", combined!);
    expect(combinationReview?.question.comboChoices).toHaveLength(5);
    expect(combinationReview?.question.items.map(({ answer }) => answer)).toEqual(["X", "O", "X"]);
  });
});
