import { describe, expect, it } from "vitest";
import {
  buildConceptSearchTerms,
  correctStatementFromExplanation,
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

describe("correctStatementFromExplanation", () => {
  it("turns a wrong-statement explanation into a clean correct sentence", () => {
    expect(
      correctStatementFromExplanation(
        "무경험은 특정 영역에서의 경험 부족이 아니라 거래 일반에 대한 경험 부족을 의미한다. (판례) 즉, 해당 법률행위가 속한 특정 영역에서의 경험부족만을 뜻하는 것이 아니다.",
        "무경험은 거래일반에 대한 경험부족이 아니라 해당 법률행위가 속한 특정영역에서의 경험부족을 뜻한다."
      )
    ).toBe("무경험은 특정 영역에서의 경험 부족이 아니라 거래 일반에 대한 경험 부족을 의미한다.");
  });

  it("removes quoted '틀린 설명이다' meta and keeps the rule", () => {
    expect(
      correctStatementFromExplanation(
        "대리인에 의해 법률행위가 이루어진 경우, 궁박·경솔·무경험 상태는 본인을 기준으로 판단한다. (판례) '대리인을 기준으로 판단해야 한다'는 것은 틀린 설명이다."
      )
    ).toBe(
      "대리인에 의해 법률행위가 이루어진 경우, 궁박·경솔·무경험 상태는 본인을 기준으로 판단한다."
    );
  });

  it("applies short date corrections into the wrong statement", () => {
    expect(
      correctStatementFromExplanation("6월 1일", "과세기준일은 매년 7월 1일이다.")
    ).toBe("과세기준일은 매년 6월 1일이다.");
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
        explanation: "재산세의 과세기준일은 매년 6월 1일이며, 7월 1일이 아니다.",
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

  it("merges O texts and corrected X explanations into one correct list", () => {
    const result = extractStatementsFromQuestions([sampleQuestion], {
      ...baseConcept,
      questionRefs: [{ year: 2016, questionNo: 38 }],
    });

    expect(result.map((s) => s.text)).toContain(
      "지방자치단체의 장은 재산세의 납부세액이 500만원을 초과하는 경우 분납하게 할 수 있다."
    );
    expect(result.map((s) => s.text)).toContain(
      "재산세의 과세기준일은 매년 6월 1일이며, 7월 1일이 아니다."
    );
    expect(result.every((s) => !s.text.includes("매년 7월 1일이다"))).toBe(true);
    const corrected = result.find((s) =>
      s.text.includes("재산세의 과세기준일은 매년 6월 1일")
    );
    expect(corrected?.modified).toBe(true);
    const plainO = result.find((s) => s.text.includes("분납하게 할 수 있다"));
    expect(plainO?.modified).toBe(false);
  });

  it("filters unrelated statements when questionRefs are absent", () => {
    const result = extractStatementsFromQuestions([sampleQuestion], baseConcept);
    expect(result.map((s) => s.text)).toContain(
      "재산세의 과세기준일은 매년 6월 1일이며, 7월 1일이 아니다."
    );
    expect(result.map((s) => s.text)).not.toContain(
      "지방자치단체의 장은 재산세의 납부세액이 500만원을 초과하는 경우 분납하게 할 수 있다."
    );
  });
});
