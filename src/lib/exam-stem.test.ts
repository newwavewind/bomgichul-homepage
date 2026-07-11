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
      "다음 중 옳은 것은? ○ 첫 번째 조건입니다 ○ 두 번째 조건입니다"
    );
    expect(result.intro).toBe("다음 중 옳은 것은?");
    expect(result.boxLines).toEqual(["○ 첫 번째 조건입니다", "○ 두 번째 조건입니다"]);
  });

  it("normalizes a lowercase inline 'o' bullet box to ○", () => {
    const result = parseQuestionStem(
      "다음 중 옳은 것은? o 첫 번째 조건입니다 o 두 번째 조건입니다"
    );
    expect(result.boxLines).toEqual(["○ 첫 번째 조건입니다", "○ 두 번째 조건입니다"]);
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
      "다음 중 옳은 것은? (다만, 특별한 사정은 없음) ○ 첫 번째 조건입니다"
    );
    expect(result.intro).toBe("다음 중 옳은 것은?(다만, 특별한 사정은 없음)");
    expect(result.boxLines).toEqual(["○ 첫 번째 조건입니다"]);
  });

  it("puts ㄱ.ㄴ.ㄷ.ㄹ. material lines into a box under the question", () => {
    const result = parseQuestionStem(
      [
        "용적률의 최대한도가 큰 순서대로 나열한 것은?(단, 조례는 고려하지 않음)",
        "ㄱ. 준주거지역",
        "ㄴ. 일반공업지역",
        "ㄷ. 준공업지역",
        "ㄹ. 생산녹지지역",
      ].join("\n")
    );
    expect(result.intro).toBe(
      "용적률의 최대한도가 큰 순서대로 나열한 것은?(단, 조례는 고려하지 않음)"
    );
    expect(result.boxLines).toEqual([
      "ㄱ. 준주거지역",
      "ㄴ. 일반공업지역",
      "ㄷ. 준공업지역",
      "ㄹ. 생산녹지지역",
    ]);
  });

  it("splits paired ㄱ./ㄴ. lines inside the material box", () => {
    const result = parseQuestionStem(
      "순서를 고르시오?\nㄱ. 준주거지역   ㄴ. 일반공업지역\nㄷ. 준공업지역   ㄹ. 생산녹지지역"
    );
    expect(result.boxLines).toEqual([
      "ㄱ. 준주거지역",
      "ㄴ. 일반공업지역",
      "ㄷ. 준공업지역",
      "ㄹ. 생산녹지지역",
    ]);
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
