import { describe, expect, it } from "vitest";
import { compareExamSessionsNewestFirst } from "./session-order";
import { getHistoryExamSessions } from "@/lib/history-content";

const session = (year: number, sourceCode: string) => ({ year, sourceCode });

describe("latest exam sessions first", () => {
  it("orders the actual history rounds newest first without losing questions", () => {
    const sessions = getHistoryExamSessions("simhwa");
    expect(sessions.slice(0, 4).map(s => s.sourceCode)).toEqual(["제80회", "제79회", "제78회", "제77회"]);
    expect(sessions.reduce((n, s) => n + s.count, 0)).toBe(800);
    expect(new Set(sessions.map(s => `${s.year}:${s.sourceCode}`)).size).toBe(sessions.length);
  });

  it("compares round numbers numerically and puts the year first", () => {
    const sessions = [session(2025, "제99회"), session(2026, "제9회"), session(2026, "제10회")];
    expect(sessions.sort(compareExamSessionsNewestFirst).map(s => s.sourceCode)).toEqual(["제10회", "제9회", "제99회"]);
  });

  it("places the later police sitting first within the same year", () => {
    expect([session(2026, "1차"), session(2026, "2차")].sort(compareExamSessionsNewestFirst).map(s => s.sourceCode)).toEqual(["2차", "1차"]);
  });

  it("keeps source-name order when the names do not express chronology", () => {
    const sessions = [session(2026, "지방직"), session(2026, "국가직")];
    expect(sessions.sort(compareExamSessionsNewestFirst).map(s => s.sourceCode)).toEqual(["국가직", "지방직"]);
  });
});
