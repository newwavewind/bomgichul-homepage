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

  it("restores multiple numbered 보기 boxes flattened by OCR", () => {
    const result = parseQuestionStem(
      [
        "두 보기의 연결이 가장 적절한 것은?",
        "<보기 1>",
        "주요대상가. 범죄자 나. 우범자 다. 일반대중",
        "<보기 2>",
        "예방전략 및 내용",
        "㉠ 상습범 대책 ㉡ 잠재적 범죄자 개입 ㉢ 환경 개선",
      ].join("\n")
    );

    expect(result.intro).toBe("두 보기의 연결이 가장 적절한 것은?");
    expect(result.boxLines).toEqual([
      "<보기 1>",
      "주요대상",
      "가. 범죄자",
      "나. 우범자",
      "다. 일반대중",
      "<보기 2>",
      "예방전략 및 내용",
      "㉠ 상습범 대책",
      "㉡ 잠재적 범죄자 개입",
      "㉢ 환경 개선",
    ]);
  });
  it("boxes a blank-fill statute passage that follows the question mark", () => {
    const result = parseQuestionStem(
      "국토의 계획 및 이용에 관한 법령상 도시·군관리계획결정의 실효에 관한 설명이다. ( )에 들어갈 공통된 숫자로 옳은 것은? 지구단위계획(주민이 입안을 제안한 것에 한정한다)에 관한 도시·군관리계획결정의 고시일부터 ( )년 이내에 「국토의 계획 및 이용에 관한 법률」 또는 다른 법률에 따라 허가·인가·승인 등을 받아 사업이나 공사에 착수하지 아니하면 그 ( )년이 된 날의 다음날에 그 지구단위계획에 관한 도시·군관리계획결정은 효력을 잃는다."
    );
    expect(result.intro).toBe(
      "국토의 계획 및 이용에 관한 법령상 도시·군관리계획결정의 실효에 관한 설명이다. ( )에 들어갈 공통된 숫자로 옳은 것은?"
    );
    expect(result.boxLines).toEqual([
      "지구단위계획(주민이 입안을 제안한 것에 한정한다)에 관한 도시·군관리계획결정의 고시일부터 ( )년 이내에 「국토의 계획 및 이용에 관한 법률」 또는 다른 법률에 따라 허가·인가·승인 등을 받아 사업이나 공사에 착수하지 아니하면 그 ( )년이 된 날의 다음날에 그 지구단위계획에 관한 도시·군관리계획결정은 효력을 잃는다.",
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
