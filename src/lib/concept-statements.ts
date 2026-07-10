import type { Concept } from "@/lib/concepts";
import type { ExamQuestion } from "@/lib/exam-questions";

export interface ConceptStatement {
  text: string;
  year: number;
  questionNo: number;
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function normalizeKey(text: string): string {
  return normalizeText(text).replace(/[·\s]/g, "").toLowerCase();
}

/** 선지 번호·개수 답 등 실제 지문이 아닌 항목 제외 */
export function isMeaningfulStatement(text: string): boolean {
  const t = normalizeText(text);
  if (t.length < 10) return false;
  if (/^\d+개$/.test(t)) return false;
  if (/^[①②③④⑤⑥⑦⑧⑨⑩]$/.test(t)) return false;
  return true;
}

/** questionRefs가 없을 때 이 개념과 관련된 지문만 골라낸다. */
export function buildConceptSearchTerms(concept: Concept): string[] {
  const terms = new Set<string>();

  const add = (raw: string) => {
    const t = raw.replace(/\s+/g, "").trim();
    if (t.length >= 4) terms.add(t);
  };

  for (const part of concept.titleKo.split(/[·()]/)) {
    add(part);
  }

  for (const point of concept.keyPoints) {
    for (const match of point.match(/[가-힣]{4,}/g) ?? []) {
      add(match);
    }
  }

  for (const match of concept.pitfalls.match(/[가-힣]{4,}/g) ?? []) {
    add(match);
  }

  const sub = concept.subcategory.replace(/\s+/g, "");
  if (sub.length >= 4) add(sub);

  return [...terms].sort((a, b) => b.length - a.length);
}

export function isStatementRelevantToConcept(text: string, concept: Concept): boolean {
  if (concept.questionRefs?.length) return true;

  const terms = buildConceptSearchTerms(concept);
  if (terms.length === 0) return true;

  const norm = normalizeKey(text);
  return terms.some((term) => norm.includes(term.toLowerCase()));
}

export function extractStatementsFromQuestions(
  questions: ExamQuestion[],
  concept: Concept
): { correct: ConceptStatement[]; incorrect: ConceptStatement[] } {
  const correct = new Map<string, ConceptStatement>();
  const incorrect = new Map<string, ConceptStatement>();

  const consider = (text: string, answer: "O" | "X", year: number, questionNo: number) => {
    if (!isMeaningfulStatement(text)) return;
    if (!isStatementRelevantToConcept(text, concept)) return;

    const key = normalizeKey(text);
    const stmt: ConceptStatement = {
      text: normalizeText(text),
      year,
      questionNo,
    };

    if (answer === "O") {
      if (!correct.has(key)) correct.set(key, stmt);
    } else if (!incorrect.has(key)) {
      incorrect.set(key, stmt);
    }
  };

  for (const q of questions) {
    for (const item of q.items) {
      consider(item.text, item.answer, q.year, q.questionNo);
    }
  }

  const sort = (a: ConceptStatement, b: ConceptStatement) =>
    b.year - a.year || a.questionNo - b.questionNo;

  return {
    correct: [...correct.values()].sort(sort),
    incorrect: [...incorrect.values()].sort(sort),
  };
}
