import { describe, expect, it } from "vitest";
import {
  parseQuestionStem,
  stemHasInconsistentBoxStyles,
  stemNeedsConditionBox,
} from "@/lib/exam-stem";

describe("parseQuestionStem", () => {
  it("returns the whole stem as intro when there is no bullet box", () => {
    const result = parseQuestionStem("다음 중 옳은 것은?");
    expect(result).toEqual({ intro: "다음 중 옳은 것은?", boxLines: [] });
  });

  it("splits an inline ○ bullet box out of a single-line stem", () => {
    const result = parseQuestionStem(
      "다음 중 옳은 것은? ○ 첫 번째 조건이다 ○ 두 번째 조건이다"
    );
    expect(result.intro).toBe("다음 중 옳은 것은?");
    expect(result.boxLines).toEqual(["○ 첫 번째 조건이다", "○ 두 번째 조건이다"]);
  });

  it("normalizes a lowercase inline 'o' bullet box to ○", () => {
    const result = parseQuestionStem(
      "다음 중 옳은 것은? o 첫 번째 조건이다 o 두 번째 조건이다"
    );
    expect(result.boxLines).toEqual(["○ 첫 번째 조건이다", "○ 두 번째 조건이다"]);
  });

  it("splits a multi-line stem at the first bullet line", () => {
    const result = parseQuestionStem(
      "다음 중 옳은 것은?\nㅇ 첫 번째 조건\nㅇ 두 번째 조건"
    );
    expect(result.intro).toBe("다음 중 옳은 것은?");
    expect(result.boxLines).toEqual(["ㅇ 첫 번째 조건", "ㅇ 두 번째 조건"]);
  });

  it("folds a short disclaimer parenthetical into the intro instead of the box", () => {
    const result = parseQuestionStem(
      "다음 중 옳은 것은? (다만, 특별한 사정은 없음) ○ 첫 번째 조건이다"
    );
    expect(result.intro).toBe("다음 중 옳은 것은?(다만, 특별한 사정은 없음)");
    expect(result.boxLines).toEqual(["○ 첫 번째 조건이다"]);
  });
});

describe("stemNeedsConditionBox", () => {
  it("is false for stems without a bullet box", () => {
    expect(stemNeedsConditionBox("다음 중 옳은 것은?")).toBe(false);
  });

  it("is true once a bullet box is detected", () => {
    expect(stemNeedsConditionBox("다음 중 옳은 것은? ○ 조건 하나")).toBe(true);
  });
});

describe("stemHasInconsistentBoxStyles", () => {
  it("is false when there is no box", () => {
    expect(stemHasInconsistentBoxStyles("다음 중 옳은 것은?")).toBe(false);
  });

  it("is false when every box line is a proper bullet", () => {
    expect(
      stemHasInconsistentBoxStyles("다음 중 옳은 것은?\nㅇ 조건 하나\nㅇ 조건 둘")
    ).toBe(false);
  });
});
