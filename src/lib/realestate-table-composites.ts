import type { ExamComboChoice } from "@/lib/exam-questions";

export interface TableCompositeOverride {
  tableHeader: string[];
  comboChoices: Array<{
    no: number;
    left?: string;
    middle?: string;
    right?: string;
  }>;
}

/** 부동산학개론 표형 복합문항 6개 — ox-quiz-app 원본 table 메타 */
export const REALESTATE_TABLE_COMPOSITES: Record<string, TableCompositeOverride> = {
  "2016-34": {
    tableHeader: ["마케팅 활동", "4P 전략"],
    comboChoices: [
      { no: 1, left: "ㄱ: 제품, ㄴ: 판매촉진,", right: "ㄷ: 가격, ㄹ: 유통경로" },
      { no: 2, left: "ㄱ: 유통경로, ㄴ: 판매촉진,", right: "ㄷ: 가격, ㄹ: 제품" },
      { no: 3, left: "ㄱ: 유통경로, ㄴ: 제품,", right: "ㄷ: 가격, ㄹ: 판매촉진" },
      { no: 4, left: "ㄱ: 제품, ㄴ: 유통경로,", right: "ㄷ: 가격, ㄹ: 판매촉진" },
      { no: 5, left: "ㄱ: 제품, ㄴ: 유통경로,", right: "ㄷ: 판매촉진, ㄹ: 가격" },
    ],
  },
  "2018-7": {
    tableHeader: ["A", "B", "A와 B의 관계"],
    comboChoices: [
      { no: 1, left: "수렴형", middle: "순환형", right: "보완재" },
      { no: 2, left: "수렴형", middle: "발산형", right: "보완재" },
      { no: 3, left: "발산형", middle: "순환형", right: "대체재" },
      { no: 4, left: "발산형", middle: "수렴형", right: "대체재" },
      { no: 5, left: "순환형", middle: "발산형", right: "대체재" },
    ],
  },
  "2018-25": {
    tableHeader: ["(가)", "(나)"],
    comboChoices: [
      { no: 1, left: "가: ㄷ", right: "나: ㄹ" },
      { no: 2, left: "가: ㄱ, ㅁ", right: "나: ㄴ, ㄹ" },
      { no: 3, left: "가: ㄱ, ㅁ", right: "나: ㄴ, ㅂ" },
      { no: 4, left: "가: ㄱ, ㄷ, ㅁ", right: "나: ㄴ, ㅂ" },
      { no: 5, left: "가: ㄱ, ㄷ, ㅁ", right: "나: ㄴ, ㄹ, ㅂ" },
    ],
  },
  "2019-1": {
    tableHeader: ["경제적 개념", "물리적(기술적) 개념"],
    comboChoices: [
      { no: 1, left: "ㄱ, ㄴ, ㄷ, ㅂ", right: "ㄹ, ㅁ, ㅅ" },
      { no: 2, left: "ㄱ, ㄴ, ㄹ, ㅂ", right: "ㄷ, ㅁ, ㅅ" },
      { no: 3, left: "ㄱ, ㄹ, ㅁ, ㅅ", right: "ㄴ, ㄷ, ㅂ" },
      { no: 4, left: "ㄴ, ㄹ, ㅁ, ㅂ", right: "ㄱ, ㄷ, ㅅ" },
      { no: 5, left: "ㄷ, ㄹ, ㅂ, ㅅ", right: "ㄱ, ㄴ, ㅁ" },
    ],
  },
  "2023-20": {
    tableHeader: ["ㄱ", "ㄴ"],
    comboChoices: [
      { no: 1, left: "국민임대주택", right: "장기전세주택" },
      { no: 2, left: "장기전세주택", right: "기존주택전세임대주택" },
      { no: 3, left: "기존주택전세임대주택", right: "국민임대주택" },
      { no: 4, left: "국민임대주택", right: "민간매입임대주택" },
      { no: 5, left: "장기전세주택", right: "민간매입임대주택" },
    ],
  },
  "2025-7": {
    tableHeader: ["유량변수", "저량변수"],
    comboChoices: [
      { no: 1, left: "ㄱ, ㄴ, ㄹ", right: "ㄷ, ㅁ, ㅂ" },
      { no: 2, left: "ㄱ, ㄷ, ㅂ", right: "ㄴ, ㄹ, ㅁ" },
      { no: 3, left: "ㄱ, ㄹ, ㅁ", right: "ㄴ, ㄷ, ㅂ" },
      { no: 4, left: "ㄴ, ㄷ, ㅂ", right: "ㄱ, ㄹ, ㅁ" },
      { no: 5, left: "ㄴ, ㄹ, ㅁ", right: "ㄱ, ㄷ, ㅂ" },
    ],
  },
};

export function enrichTableCompositeQuestion<
  T extends {
    year: number;
    questionNo: number;
    comboChoices: ExamComboChoice[];
    tableHeader?: string[];
    compositeLayout?: "table" | "statements";
  },
>(question: T): T {
  const key = `${question.year}-${question.questionNo}`;
  const override = REALESTATE_TABLE_COMPOSITES[key];
  if (!override) return question;

  return {
    ...question,
    compositeLayout: "table",
    tableHeader: question.tableHeader?.length ? question.tableHeader : override.tableHeader,
    comboChoices: question.comboChoices.map((choice) => {
      const cells = override.comboChoices.find((c) => c.no === choice.no);
      if (!cells) return choice;
      return {
        ...choice,
        ...(cells.left != null ? { left: cells.left } : {}),
        ...(cells.middle != null ? { middle: cells.middle } : {}),
        ...(cells.right != null ? { right: cells.right } : {}),
      };
    }),
  };
}
