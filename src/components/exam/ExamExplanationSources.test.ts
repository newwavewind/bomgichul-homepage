import { describe, expect, it } from "vitest";
import { prepareExplanationSources } from "./ExamExplanationSources";

describe("choice explanation sources", () => {
  it("moves citations to the choice and keeps the exam-date address", () => {
    const historical = "https://www.law.go.kr/법령/대한민국헌법/(19880225,00010)/제8조";
    const result = prepareExplanationSources(
      "헌법이 쓰는 표현을 구별한다(헌법 제4조, 제8조 제4항).",
      [],
      { "대한민국헌법|8": historical },
    );
    expect(result.body).toBe("헌법이 쓰는 표현을 구별한다.");
    expect(result.links.map(({ label }) => label)).toEqual(["헌법 제4조", "헌법 제8조 제4항"]);
    expect(result.links[1].url).toBe(historical);
  });

  it("leaves explanatory parentheses and amendment citations in the body", () => {
    const explanation = "그 처분의 뜻을 구별한다(예외도 있다, 헌법 제8조). [개정] 지금은 헌법 제4조를 참고한다.";
    const result = prepareExplanationSources(explanation);
    expect(result.body).toBe(explanation);
    expect(result.links).toEqual([]);
    expect(result.hasEvidence).toBe(true);
  });

  it("keeps attached references without duplicating identical entries", () => {
    const source = { label: "IAS 1 문단 25", url: "https://www.ifrs.org/example" };
    const result = prepareExplanationSources("계속기업을 평가한다.", [source, source]);
    expect(result.links).toEqual([source]);
  });

  it("does not repeat a source already linked in explanatory text", () => {
    const result = prepareExplanationSources("헌법 제8조의 내용이다(헌법 제8조).");
    expect(result.links).toEqual([]);
  });
});
