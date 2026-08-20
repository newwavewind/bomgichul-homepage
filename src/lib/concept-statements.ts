import type { Concept } from "@/lib/concepts";
import type { ExamQuestion, ExamQuestionItem } from "@/lib/exam-questions";

export interface ConceptStatement {
  text: string;
  year: number;
  questionNo: number;
  /** 틀린 선지·짧은 O 선지를 해설로 고친 경우 */
  modified?: boolean;
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function normalizeKey(text: string): string {
  return normalizeText(text).replace(/[·ㆍ\s]/g, "").toLowerCase();
}

/** 선지 번호·개수 답 등 실제 지문이 아닌 항목 제외 */
export function isMeaningfulStatement(text: string): boolean {
  const t = normalizeText(text);
  if (t.length < 10) return false;
  if (/^\d+개$/.test(t)) return false;
  if (/^[①②③④⑤⑥⑦⑧⑨⑩]$/.test(t)) return false;
  if (/^(옳다|맞다|틀렸다|틀린\s*설명이다)\.?$/.test(t)) return false;
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

  const pitfalls = Array.isArray(concept.pitfalls)
    ? concept.pitfalls
    : concept.pitfalls ? [concept.pitfalls] : [];
  for (const pitfall of pitfalls) {
    for (const match of pitfall.match(/[가-힣]{4,}/g) ?? []) add(match);
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

/**
 * 틀린 선지 해설을 학습용 '옳은 문장'으로 정리한다.
 * 예: "'…'는 틀린 설명이다" / "(판례)" / "즉, …" 메타 문구를 제거한다.
 */
export function correctStatementFromExplanation(
  explanation: string,
  wrongText?: string
): string | null {
  let e = normalizeText(explanation);
  if (!e) return null;

  if (e.includes("→")) {
    const after = e.split("→").slice(1).join("→").trim();
    if (after.length >= 10) e = after;
  }

  e = e
    .replace(/[''"][^''"]{2,}[''"](?:는|은)\s*틀린\s*설명이다\.?/g, "")
    .replace(/\s*즉,?\s+.+$/u, "")
    .replace(/\s*\([^)]*(?:판례|민법|조항|법령)[^)]*\)\.?/g, "")
    .replace(/\s*\(판례\)\.?/g, "")
    .trim();

  const sentences = e.match(/[^.!?]+[.!?]+/gu);
  if (sentences?.length) {
    e = sentences[0].trim();
    if (e.length < 20 && sentences[1]) {
      e = `${sentences[0].trim()} ${sentences[1].trim()}`;
    }
  }

  if (e && !/[.!?]$/.test(e)) e += ".";

  if (isMeaningfulStatement(e)) return normalizeText(e);

  // 해설이 "6월 1일"처럼 짧은 교정값이면 틀린 지문 안의 대응 표현을 치환한다.
  if (wrongText) {
    const fragment = normalizeText(explanation).replace(/[.。]$/, "");
    if (fragment.length >= 2 && fragment.length <= 40) {
      const dateLike = fragment.match(/\d+월\s*\d+일/);
      const wrongDate = wrongText.match(/\d+월\s*\d+일/);
      if (dateLike && wrongDate && dateLike[0] !== wrongDate[0]) {
        const flipped = normalizeText(wrongText).replace(wrongDate[0], dateLike[0]);
        if (isMeaningfulStatement(flipped) && flipped !== normalizeText(wrongText)) {
          return flipped;
        }
      }
    }
  }

  return null;
}

function statementTextFromItem(
  item: ExamQuestionItem
): { text: string; modified: boolean } | null {
  if (item.answer === "O") {
    const text = normalizeText(item.text);
    // 선지가 너무 짧아 문맥이 없으면 해설을 옳은 문장으로 쓴다.
    if (text.length < 25) {
      const fromExpl = correctStatementFromExplanation(item.explanation, item.text);
      if (fromExpl && fromExpl.length >= 25) {
        return { text: fromExpl, modified: fromExpl !== text };
      }
    }
    return isMeaningfulStatement(text) ? { text, modified: false } : null;
  }

  const corrected = correctStatementFromExplanation(item.explanation, item.text);
  // 해설에서 뽑은 문장은 단편을 피하기 위해 더 길게 요구
  if (!corrected || corrected.length < 25) return null;
  return { text: corrected, modified: true };
}

/**
 * 연결된 기출에서 옳은 지문만 모은다.
 * 틀린 선지는 해설을 옳은 문장으로 바꿔 함께 포함한다.
 */
export function extractStatementsFromQuestions(
  questions: ExamQuestion[],
  concept: Concept
): ConceptStatement[] {
  const correct = new Map<string, ConceptStatement>();

  for (const q of questions) {
    for (const item of q.items) {
      const extracted = statementTextFromItem(item);
      if (!extracted) continue;
      const { text, modified } = extracted;
      if (
        !isStatementRelevantToConcept(item.text, concept) &&
        !isStatementRelevantToConcept(text, concept)
      ) {
        continue;
      }

      const key = normalizeKey(text);
      if (correct.has(key)) continue;

      correct.set(key, {
        text,
        year: q.year,
        questionNo: q.questionNo,
        modified: Boolean(modified),
      });
    }
  }

  return [...correct.values()].sort(
    (a, b) => b.year - a.year || a.questionNo - b.questionNo
  );
}
