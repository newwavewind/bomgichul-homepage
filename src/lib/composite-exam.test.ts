import { describe, expect, it } from "vitest";
import {
  getComboColumnCells,
  isTableCompositeQuestion,
  resolveTableHeaders,
  tableColumnCount,
} from "@/lib/composite-exam";
import type { ExamComboChoice } from "@/lib/exam-questions";

function choice(overrides: Partial<ExamComboChoice> & { no: number }): ExamComboChoice {
  return { label: "①", text: "", isCorrect: false, ...overrides };
}

describe("resolveTableHeaders", () => {
  it("prefers an explicit tableHeader on the question", () => {
    const headers = resolveTableHeaders({
      tableHeader: ["A", "B"],
      comboChoices: [],
      year: 2016,
      questionNo: 34,
    });
    expect(headers).toEqual(["A", "B"]);
  });

  it("ignores a tableHeader with fewer than 2 entries", () => {
    const headers = resolveTableHeaders({
      tableHeader: ["A"],
      comboChoices: [],
      year: 2016,
      questionNo: 34,
    });
    expect(headers).toEqual(["마케팅 활동", "4P 전략"]);
  });

  it("falls back to the known table-composite map by year/questionNo", () => {
    const headers = resolveTableHeaders({
      tableHeader: undefined,
      comboChoices: [],
      year: 2018,
      questionNo: 25,
    });
    expect(headers).toEqual(["(가)", "(나)"]);
  });

  it("falls back to a generic default for unknown questions", () => {
    const headers = resolveTableHeaders({
      tableHeader: undefined,
      comboChoices: [],
      year: 1999,
      questionNo: 999,
    });
    expect(headers).toEqual(["왼쪽", "오른쪽"]);
  });
});

describe("getComboColumnCells", () => {
  it("reads left/right fields when present", () => {
    expect(getComboColumnCells(choice({ no: 1, left: "가", right: "나" }))).toEqual([
      "가",
      "나",
    ]);
  });

  it("includes the middle cell when present", () => {
    expect(
      getComboColumnCells(choice({ no: 1, left: "가", middle: "다", right: "나" }))
    ).toEqual(["가", "다", "나"]);
  });

  it("splits slash-delimited text when left/right are absent", () => {
    expect(getComboColumnCells(choice({ no: 1, text: "유량변수 / 저량변수" }))).toEqual([
      "유량변수",
      "저량변수",
    ]);
  });

  it("returns the raw text as a single cell when there is no delimiter", () => {
    expect(getComboColumnCells(choice({ no: 1, text: "단일 선택지" }))).toEqual([
      "단일 선택지",
    ]);
  });
});

describe("isTableCompositeQuestion", () => {
  it("respects an explicit compositeLayout", () => {
    expect(
      isTableCompositeQuestion({
        compositeLayout: "table",
        comboChoices: [choice({ no: 1, text: "x" })],
      })
    ).toBe(true);
  });

  it("detects table shape from left/right fields", () => {
    expect(
      isTableCompositeQuestion({
        comboChoices: [choice({ no: 1, left: "가", right: "나" })],
      })
    ).toBe(true);
  });

  it("detects table shape from slash-delimited text", () => {
    expect(
      isTableCompositeQuestion({
        comboChoices: [choice({ no: 1, text: "유량변수 / 저량변수" })],
      })
    ).toBe(true);
  });

  it("returns false for plain statement composites", () => {
    expect(
      isTableCompositeQuestion({
        comboChoices: [choice({ no: 1, text: "ㄱ, ㄴ" })],
      })
    ).toBe(false);
  });

  it("returns false when there are no combo choices", () => {
    expect(isTableCompositeQuestion({ comboChoices: [] })).toBe(false);
  });
});

describe("tableColumnCount", () => {
  it("is at least the number of resolved headers", () => {
    const count = tableColumnCount({
      tableHeader: ["A", "B", "C"],
      comboChoices: [choice({ no: 1, text: "x / y" })],
    });
    expect(count).toBe(3);
  });

  it("grows to fit the widest combo choice row", () => {
    const count = tableColumnCount({
      tableHeader: ["A", "B"],
      comboChoices: [choice({ no: 1, left: "가", middle: "다", right: "나" })],
    });
    expect(count).toBe(3);
  });
});
