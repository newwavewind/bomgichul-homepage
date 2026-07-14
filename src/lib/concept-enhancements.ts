import type { Concept } from "@/lib/concepts";
import type { ExamQuestion } from "@/lib/exam-questions";
import {
  correctStatementFromExplanation,
  isMeaningfulStatement,
} from "@/lib/concept-statements";
import {
  getConceptEnhancement as getAppConceptEnhancement,
  getConceptPitfallOverrides as getAppConceptPitfallOverrides,
} from "@/data/concepts/conceptEnhancements.js";

/** App Kind UI guides are untyped JSON-shaped objects. */
export type ConceptEnhancement = Record<string, unknown> & {
  kind?: string;
  summary?: string;
};

export type PitfallCard = {
  wrong: string;
  correct: string;
  context?: string | null;
  topic?: string | null;
  meta?: string | null;
  generatedFallback?: boolean;
};

export function getConceptEnhancement(
  concept: Concept | null | undefined
): ConceptEnhancement | null {
  if (!concept?.slug) return null;
  return getAppConceptEnhancement(concept) as ConceptEnhancement | null;
}

export function getConceptPitfallOverrides(slug: string): PitfallCard[] | null {
  return (getAppConceptPitfallOverrides(slug) as PitfallCard[] | null) ?? null;
}

function pitfallCardLimit(questionCount: number) {
  if (questionCount >= 10) return 12;
  if (questionCount >= 7) return 8;
  if (questionCount >= 4) return 6;
  if (questionCount >= 2) return 4;
  return 2;
}

export function buildPitfallCards(concept: Concept, questions: ExamQuestion[]): PitfallCard[] {
  const overrides = getConceptPitfallOverrides(concept.slug) || [];
  const limit = pitfallCardLimit(concept.questionRefs?.length || questions.length);
  const cards: PitfallCard[] = [...overrides];
  const seen = new Set(overrides.map((card) => card.wrong.replace(/\s+/g, "")));
  const seenQuestions = new Set<string>();

  for (const question of questions) {
    const qKey = `${question.year}-${question.questionNo}`;
    if (seenQuestions.has(qKey)) continue;
    for (const item of question.items || []) {
      if (cards.length >= limit) return cards;
      if (item.answer !== "X" || !isMeaningfulStatement(item.text)) continue;
      const wrong = String(item.text || "").replace(/\s+/g, " ").trim();
      const key = wrong.replace(/[·ㆍ\s]/g, "").toLowerCase();
      if (seen.has(key)) continue;
      const contextDependent =
        /[甲乙丙丁戊己庚辛]/.test(wrong) ||
        /(?:위|이러한|각각|전자의|후자의)\s/.test(wrong) ||
        wrong.length < 32;
      let correct = correctStatementFromExplanation(item.explanation, wrong);
      if (
        contextDependent &&
        question.explanationSummary &&
        question.explanationSummary.length > (correct?.length || 0)
      ) {
        correct = question.explanationSummary;
      }
      if (!correct || correct === wrong || correct.length < 18) continue;
      cards.push({
        wrong,
        correct,
        context: contextDependent ? question.stem : null,
        topic: contextDependent ? question.subcategory : null,
        meta: contextDependent ? `${question.year}년 · ${question.questionNo}번` : null,
      });
      seen.add(key);
      seenQuestions.add(qKey);
      break;
    }
  }

  return cards;
}
