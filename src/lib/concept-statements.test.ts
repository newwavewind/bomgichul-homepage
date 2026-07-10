import { describe, expect, it } from "vitest";
import {
  buildConceptSearchTerms,
  extractStatementsFromQuestions,
  isMeaningfulStatement,
  isStatementRelevantToConcept,
} from "@/lib/concept-statements";
import type { Concept } from "@/lib/concepts";
import type { ExamQuestion } from "@/lib/exam-questions";

const baseConcept: Concept = {
  slug: "property-tax-base-date",
  category: "재산세",
  subcategory: "재산세 과세표준",
  titleKo: "재산세·종합부동산세의 과세기준일",
  titleEn: "Assessment Base Date",
  definition: "과세기준일은 6월 1일",
  intuition: "",
  keyPoints: ["재산세·종합부동산세 공통 과세기준일은 매년 6월 1일이다."],
  pitfalls: "7월 1일로 바꿔 내는 지문 주의",
  example: "",
};

describe("isMeaningfulStatement", () => {
  it("filters count answers and very short strings", () => {
    expect(isMeaningfulStatement("1개")).toBe(false);
    expect(isMeaningfulStatement("①")).toBe(false);
    expect(isMeaningfulStatement("과세기준일은 매년 6월 1일이다.")).toBe(true);
  });
});

describe("buildConceptSearchTerms", () => {
  it("includes title and key point phrases", () => {
    const terms = buildConceptSearchTerms(baseConcept);
    expect(terms.some((t) => t.includes("과세기준일"))).toBe(true);
  });
});

describe("isStatementRelevantToConcept", () => {
  it("skips filtering when questionRefs exist", () => {
    const concept = { ...baseConcept, questionRefs: [{ year: 2020, questionNo: 1 }] };
    expect(isStatementRelevantToConcept("아무 문장", concept)).toBe(true);
  });

  it("matches statements containing concept terms", () => {
    expect(
      isStatementRelevantToConcept("재산세의 과세기준일은 매년 6월 1일이다.", baseConcept)
    ).toBe(true);
    expect(isStatementRelevantToConcept("취득세 납세의무는 취득한 날에 성립한다.", baseConcept)).toBe(
      false
    );
  });
});

describe("extractStatementsFromQuestions", () => {
  const sampleQuestion: ExamQuestion = {
    subject: "realestate-tax",
    year: 2016,
    round: 27,
    questionNo: 38,
    stem: "지방세법상 재산세에 관한 설명으로 옳은 것은?",
    category: "재산세",
    subcategory: "재산세 징수",
    questionType: "correct",
    correctChoice: "5",
    items: [
      {
        key: "1",
        label: "①",
        text: "과세기준일은 매년 7월 1일이다.",
        answer: "X",
        explanation: "6월 1일",
      },
      {
        key: "5",
        label: "⑤",
        text: "지방자치단체의 장은 재산세의 납부세액이 500만원을 초과하는 경우 분납하게 할 수 있다.",
        answer: "O",
        explanation: "옳다",
      },
    ],
    comboChoices: [],
    free: false,
  };

  it("splits O and X statements and deduplicates", () => {
    const result = extractStatementsFromQuestions([sampleQuestion], {
      ...baseConcept,
      questionRefs: [{ year: 2016, questionNo: 38 }],
    });

    expect(result.incorrect.map((s) => s.text)).toContain("과세기준일은 매년 7월 1일이다.");
    expect(result.correct.map((s) => s.text)).toContain(
      "지방자치단체의 장은 재산세의 납부세액이 500만원을 초과하는 경우 분납하게 할 수 있다."
    );
  });

  it("filters unrelated statements when questionRefs are absent", () => {
    const result = extractStatementsFromQuestions([sampleQuestion], baseConcept);
    expect(result.incorrect.map((s) => s.text)).toContain("과세기준일은 매년 7월 1일이다.");
    expect(result.correct).toHaveLength(0);
  });
});
