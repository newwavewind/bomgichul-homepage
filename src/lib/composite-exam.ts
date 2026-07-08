import type { ExamComboChoice, ExamQuestion } from "@/lib/exam-questions";
import { REALESTATE_TABLE_COMPOSITES } from "@/lib/realestate-table-composites";

/** 연도-번호별 표 헤더 (realestate-table-composites와 동기화) */
const TABLE_HEADERS_BY_QUESTION: Record<string, string[]> = Object.fromEntries(
  Object.entries(REALESTATE_TABLE_COMPOSITES).map(([key, value]) => [key, value.tableHeader])
);

type TableQuestionMeta = Pick<ExamQuestion, "tableHeader" | "comboChoices"> & {
  stem?: string;
  year?: number;
  questionNo?: number;
};

/**
 * 표 헤더 해석 순서: 문항 데이터의 명시적 tableHeader → 알려진 표형 문항 매핑
 * (REALESTATE_TABLE_COMPOSITES) → 안전한 기본값. 과거에는 지문 텍스트를 정규식으로
 * 패턴매칭해 헤더를 "추측"하는 3번째 단계가 있었으나, 새 기출이 추가될 때마다
 * 깨지는 문제가 있어 제거했다. 새 표형 문항은 반드시 tableHeader를 명시하거나
 * REALESTATE_TABLE_COMPOSITES에 등록해야 하며, 등록되지 않으면 아래 기본값이
 * 그대로 노출되어(잘못된 추측이 아니라) 데이터 누락이 바로 눈에 띈다.
 */
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
  question: Pick<ExamQuestion, "compositeLayout" | "comboChoices"> & { stem?: string }
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
