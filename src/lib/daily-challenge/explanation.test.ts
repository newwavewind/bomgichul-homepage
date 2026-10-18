import { describe, expect, it } from "vitest";
import { splitDailyExplanation } from "@/lib/daily-challenge/explanation";

const choices = [
  { key: "1", label: "①" },
  { key: "2", label: "②" },
  { key: "3", label: "③" },
  { key: "4", label: "④" },
  { key: "5", label: "⑤" },
];

describe("splitDailyExplanation", () => {
  it("keeps the common summary and splits labelled choice explanations", () => {
    const result = splitDailyExplanation(
      [
        "공통 기준이다. 나머지는 전인습(①④)과 인습(②⑤) 수준이다.",
        "① 첫 번째 선지 해설이다.",
        "② 두 번째 선지 해설이다.",
        "③ 세 번째 선지 해설이다.",
      ].join("\n\n"),
      choices,
    );

    expect(result.common).toBe(
      "공통 기준이다. 나머지는 전인습(①④)과 인습(②⑤) 수준이다.",
    );
    expect(result.byChoice).toEqual({
      "1": "첫 번째 선지 해설이다.",
      "2": "두 번째 선지 해설이다.",
      "3": "세 번째 선지 해설이다.",
    });
  });

  it("keeps continuation paragraphs with their choice", () => {
    const result = splitDailyExplanation(
      "① 첫 문단이다.\n\n추가 설명이다.\n\n② 다음 선지다.",
      choices,
    );

    expect(result.byChoice["1"]).toBe("첫 문단이다.\n\n추가 설명이다.");
    expect(result.byChoice["2"]).toBe("다음 선지다.");
  });

  it("leaves a common-only explanation unchanged", () => {
    const result = splitDailyExplanation("문항 전체에 적용되는 해설이다.", choices);

    expect(result).toEqual({
      common: "문항 전체에 적용되는 해설이다.",
      byChoice: {},
    });
  });

  it("does not split an isolated choice marker", () => {
    const result = splitDailyExplanation(
      "공통 설명이다.\n\n① 예시 하나만 덧붙인다.",
      choices,
    );

    expect(result).toEqual({
      common: "공통 설명이다.\n\n① 예시 하나만 덧붙인다.",
      byChoice: {},
    });
  });
});
