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

  it("keeps a Korean question that begins with a circled reference as the prompt", () => {
    const intro = "㉠ ～ ㉣에 대한 이해로 적절하지 않은 것은?";
    expect(parseQuestionStem(intro)).toEqual({ intro, boxLines: [] });
    expect(parseQuestionStem(`${intro}\n㉠ 첫 번째 보기\n㉡ 두 번째 보기`)).toEqual({
      intro,
      boxLines: ["㉠ 첫 번째 보기", "㉡ 두 번째 보기"],
    });
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
  it("does not cut a two-sentence 보기 line at the sentence-ending 「다.」", () => {
    const result = parseQuestionStem(
      [
        "이에 관한 설명으로 옳은 것을 모두 고른 것은?",
        "ㄱ. 현재 구매력평가 환율은 1,000(원/달러)이다.",
        "ㄴ. 현재 환율이 1,100(원/달러)이다. 장기적으로 한국의 햄버거 가격은 상승한다.",
      ].join("\n")
    );
    expect(result.boxLines).toEqual([
      "ㄱ. 현재 구매력평가 환율은 1,000(원/달러)이다.",
      "ㄴ. 현재 환율이 1,100(원/달러)이다. 장기적으로 한국의 햄버거 가격은 상승한다.",
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

  it("puts (가)·(나) definitions and ㉠·㉡ statements into two separate boxes", () => {
    const result = parseQuestionStem(
      [
        "(가)와 (나)에 관한 다음 설명 중 옳고 그름의 표시(O, X)가 바르게 된 것은? (다툼이 있는 경우 판례에 의함)",
        "",
        "(가) 구성요건적 실행행위에 의해 법익의 침해가 발생하여 범죄가 기수에 이르고 범죄행위도 종료되지만 법익침해 상태는 기수 이후에도 존속되는 범죄",
        "(나) 범죄가 기수에 이른 후에도 범죄행위와 법익침해 상태가 범행 종료시까지 계속되는 범죄",
        "㉠ (가)의 경우 기수 이후 법익침해 상태가 계속되는 시점에도 공범성립이 가능하다.",
        "㉡ (나)의 공소시효는 기수시부터가 아니라 범죄종료시로부터 진행하므로 범죄가 종료한 때로부터 공소시효가 진행된다.",
        "㉢ (가)와 (나)의 경우 정당방위는 기수시까지 가능하다.",
        "㉣ (가)는 범죄의 기수시기와 종료시기가 일치하지만, (나)는 범죄의 기수시기와 종료시기가 일치하지 않고 분리된다.",
      ].join("\n")
    );
    expect(result.intro).toBe(
      "(가)와 (나)에 관한 다음 설명 중 옳고 그름의 표시(O, X)가 바르게 된 것은? (다툼이 있는 경우 판례에 의함)"
    );
    expect(result.boxSections).toEqual([
      {
        title: null,
        lines: [
          "(가) 구성요건적 실행행위에 의해 법익의 침해가 발생하여 범죄가 기수에 이르고 범죄행위도 종료되지만 법익침해 상태는 기수 이후에도 존속되는 범죄",
          "(나) 범죄가 기수에 이른 후에도 범죄행위와 법익침해 상태가 범행 종료시까지 계속되는 범죄",
        ],
      },
      {
        title: null,
        lines: [
          "㉠ (가)의 경우 기수 이후 법익침해 상태가 계속되는 시점에도 공범성립이 가능하다.",
          "㉡ (나)의 공소시효는 기수시부터가 아니라 범죄종료시로부터 진행하므로 범죄가 종료한 때로부터 공소시효가 진행된다.",
          "㉢ (가)와 (나)의 경우 정당방위는 기수시까지 가능하다.",
          "㉣ (가)는 범죄의 기수시기와 종료시기가 일치하지만, (나)는 범죄의 기수시기와 종료시기가 일치하지 않고 분리된다.",
        ],
      },
    ]);
  });

  it("keeps the disclaimer in the intro and boxes (가)/(나) definition lines", () => {
    const result = parseQuestionStem(
      [
        "(가)와 (나)에 관한 설명으로 가장 적절하지 않은 것은? (다툼이 있는 경우 판례에 의함)",
        "",
        "(가) 일정한 기간 내에 잘못된 상태를 바로 잡으라는 행정청의 지시를 이행하지 않았다는 것을 구성요건으로 하는 범죄",
        "(나) ｢형법｣ 제250조 제1항의 살인죄와 같이 그 규정 형식으로 보아 작위를 내용으로 하는 범죄를 부작위에 의하여 범하는 범죄",
      ].join("\n")
    );
    expect(result.intro).toBe(
      "(가)와 (나)에 관한 설명으로 가장 적절하지 않은 것은? (다툼이 있는 경우 판례에 의함)"
    );
    expect(result.boxLines).toEqual([
      "(가) 일정한 기간 내에 잘못된 상태를 바로 잡으라는 행정청의 지시를 이행하지 않았다는 것을 구성요건으로 하는 범죄",
      "(나) ｢형법｣ 제250조 제1항의 살인죄와 같이 그 규정 형식으로 보아 작위를 내용으로 하는 범죄를 부작위에 의하여 범하는 범죄",
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
