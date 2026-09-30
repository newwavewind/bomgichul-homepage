import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("@/lib/web-funnel", () => ({ trackWebFunnel: vi.fn() }));
import {
  EXAM_CHOICES,
  calculatePlan,
  weeklyReport,
  studyStreak,
  latestWrong,
  recordWebStudy,
  readWebStudy,
  saveWebStudy,
  scopeForPath,
  type StudyEntry,
} from "./web-study";
import { parseDiscussion, formatDiscussion } from "./question-discussion";
const entry = (
  day: string,
  result: StudyEntry["result"] = "wrong",
  id = "a",
): StudyEntry => ({
  id,
  href: "/exam/civillaw/2025/41",
  scope: "real-estate",
  title: "민법",
  day,
  result,
});
describe("web-only study records", () => {
  beforeEach(() => {
    const data = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => data.get(key) || null,
      setItem: (key: string, value: string) => data.set(key, value),
    });
    vi.stubGlobal("window", { dispatchEvent: vi.fn() });
  });
  it("counts actual activity dates, tolerating duplicates and yesterday", () => {
    expect(
      studyStreak(
        [entry("2026-09-29"), entry("2026-09-29"), entry("2026-09-28", "read")],
        "2026-09-30",
      ),
    ).toBe(2);
    expect(studyStreak([], "2026-09-30")).toBe(0);
  });
  it("separates accounts and rejects corrupt storage without crashing", () => {
    saveWebStudy("a", { entries: [entry("2026-09-30")] });
    expect(readWebStudy("b").entries).toEqual([]);
    localStorage.setItem("bom:web-study:v1:b", "oops");
    expect(readWebStudy("b").entries).toEqual([]);
  });
  it("keeps a daily outcome, records review, and removes corrected errors from the summary", () => {
    recordWebStudy("a", { ...entry("2026-09-30"), result: "wrong" });
    recordWebStudy("a", { ...entry("2026-09-30"), result: "correct" });
    const rows = readWebStudy("a").entries;
    expect(rows).toHaveLength(1);
    expect(rows[0].review).toBe(true);
    expect(latestWrong(rows)).toEqual([]);
  });
  it("does not mix concepts into question accuracy or leak older weeks", () => {
    const report = weeklyReport(
      [
        entry("2026-09-30", "correct"),
        entry("2026-09-29", "read", "b"),
        entry("2026-09-23", "wrong", "c"),
      ],
      "2026-09-30",
    );
    expect(report.accuracy).toBe(100);
    expect(report.previousAccuracy).toBe(0);
    expect(report.current).toHaveLength(2);
  });
  it("redistributes missed work and reports insufficient time, without counting repeats", () => {
    const plan = {
      scope: "real-estate",
      deadline: "2026-10-01",
      minutes: 10,
      total: 20,
      started: "2026-09-01",
    };
    const rows = [entry("2026-09-28"), entry("2026-09-29")];
    expect(calculatePlan(plan, rows, "2026-09-30")).toMatchObject({
      done: 1,
      remaining: 19,
      daily: 10,
      days: 2,
      overloaded: true,
    });
    expect(calculatePlan(plan, rows, "2026-10-02").days).toBe(0);
  });
  it("maps all fourteen website exams to separate scopes", () => {
    expect(EXAM_CHOICES).toHaveLength(14);
    for (const [scope] of EXAM_CHOICES)
      expect(scopeForPath(`/${scope}/exam/test`)).toBe(scope);
    expect(scopeForPath("/exam/civillaw")).toBe("real-estate");
  });
  it("prioritizes repeated errors and retains the learner's summary", () => {
    recordWebStudy("a", { ...entry("2026-09-30"), note: "내 요약" });
    recordWebStudy("a", { ...entry("2026-09-30") });
    recordWebStudy("a", { ...entry("2026-09-30", "wrong", "b") });
    const wrong = latestWrong(readWebStudy("a").entries);
    expect(wrong[0]).toMatchObject({ id: "a", wrongCount: 2, note: "내 요약" });
  });
  it("preserves legacy public tips and round-trips question status", () => {
    expect(parseDiscussion("예전 공개 메모")).toMatchObject({
      question: false,
      text: "예전 공개 메모",
    });
    expect(
      parseDiscussion(formatDiscussion("질문 본문", true, "comment-1")),
    ).toEqual({
      question: true,
      resolved: true,
      acceptedId: "comment-1",
      text: "질문 본문",
    });
  });
});
