import type { ExamComboChoice, ExamQuestion } from "@/lib/exam-questions";
import { REALESTATE_TABLE_COMPOSITES } from "@/lib/realestate-table-composites";

/** 연도-번호별 표 헤더 (realestate-table-composites와 동기화) */
const TABLE_HEADERS_BY_QUESTION: Record<string, string[]> = Object.fromEntries(
  Object.entries(REALESTATE_TABLE_COMPOSITES).map(([key, value]) => [key, value.tableHeader])
);

export function inferTableHeadersFromStem(stem: string): string[] | null {
  if (/유량\s*\(flow\).*저량\s*\(stock\)|유량.*저량/i.test(stem)) {
    return ["유량변수", "저량변수"];
  }
  if (/부동산의 개념/.test(stem) && /짝지어진/.test(stem)) {
    return ["경제적 개념", "물리적(기술적) 개념"];
  }
  if (/\(가\).*순영업소득.*\(나\)|현금흐름 계산에서 \(가\)/.test(stem)) {
    return ["(가)", "(나)"];
  }
  if (/4P|마케팅 4P/i.test(stem) && /연결/.test(stem)) {
    return ["마케팅 활동", "4P 전략"];
  }
  if (/공공주택특별법/.test(stem) && /\( ㄱ \)/.test(stem)) {
    return ["ㄱ", "ㄴ"];
  }
  return null;
}

type TableQuestionMeta = Pick<ExamQuestion, "tableHeader" | "stem" | "comboChoices"> & {
  year?: number;
  questionNo?: number;
};

export function resolveTableHeaders(question: TableQuestionMeta): string[] {
  if (question.tableHeader && question.tableHeader.length >= 2) {
    return question.tableHeader;
  }
  if (question.year != null && question.questionNo != null) {
    const key = `${question.year}-${question.questionNo}`;
    if (TABLE_HEADERS_BY_QUESTION[key]) {
      return TABLE_HEADERS_BY_QUESTION[key];
    }
  }
  if (question.stem) {
    const inferred = inferTableHeadersFromStem(question.stem);
    if (inferred) return inferred;
  }
  return ["왼쪽", "오른쪽"];
}

export function getComboColumnCells(choice: ExamComboChoice): string[] {
  if (choice.left != null || choice.right != null) {
    const cells = [choice.left, choice.middle, choice.right].map((v) =>
      v == null || v === "" ? null : String(v).trim()
    );
    if (cells[1] == null) return [cells[0], cells[2]].filter(Boolean) as string[];
    return cells.filter((v) => v != null) as string[];
  }

  const parts = (choice.text ?? "")
    .split(/\s*\/\s*/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length ? parts : [choice.text ?? ""];
}

export function isTableCompositeQuestion(
  question: Pick<ExamQuestion, "compositeLayout" | "comboChoices" | "stem">
): boolean {
  if (question.compositeLayout === "table") return true;
  const first = question.comboChoices[0];
  if (!first) return false;
  if (first.left?.trim() && first.right?.trim()) return true;
  const text = first.text ?? "";
  if (!/\s\/\s/.test(text)) return false;
  return getComboColumnCells(first).length >= 2;
}

export function defaultTableHeaders(question: TableQuestionMeta): string[] {
  return resolveTableHeaders(question);
}

export function tableColumnCount(question: TableQuestionMeta): number {
  const headers = defaultTableHeaders(question);
  const fromChoices = Math.max(
    0,
    ...question.comboChoices.map((c) => getComboColumnCells(c).length)
  );
  return Math.max(2, headers.length, fromChoices);
}
