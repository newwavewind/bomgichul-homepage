import { describe, expect, it } from "vitest";
import { calculateStudyStreak, resolveAttemptDestination } from "./personal-home";

describe("personal home", () => {
  it("counts a streak ending today", () => expect(calculateStudyStreak(["2026-08-21", "2026-08-20", "2026-08-19"], "2026-08-21")).toBe(3));
  it("keeps yesterday's streak before today's study", () => expect(calculateStudyStreak(["2026-08-20", "2026-08-19"], "2026-08-21")).toBe(2));
  it("builds a shared track question URL", () => expect(resolveAttemptDestination("housing:civil-law:제28회", 2025, 49).href).toContain("/housing/exam/civil-law/2025/"));
});
