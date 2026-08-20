import type { ExamSubject, ExamQuestion } from "@/lib/exam-questions";
import { getExamQuestionsForSubject, getExamQuestion } from "@/lib/exam-questions";
import {
  extractStatementsFromQuestions,
  type ConceptStatement,
} from "@/lib/concept-statements";
import civillawConcepts from "@/data/concepts/civillaw";
import realestateConcepts from "@/data/concepts/realestate";
import brokerLawConcepts from "@/data/concepts/broker-law";
import registryLawConcepts from "@/data/concepts/registry-law";
import realestateTaxConcepts from "@/data/concepts/realestate-tax";
import realestatePublicLawConcepts from "@/data/concepts/realestate-public-law";

export interface Concept {
  slug: string;
  /** 교재 목차상 PART(대단원) (예: "민법총칙", "물권법", "계약법", "민사특별법") */
  chapterKo?: string;
  /** 교재 목차상 CHAPTER(중단원). 없으면 category를 그대로 중단원명으로 사용한다. */
  sectionKo?: string;
  category: string;
  subcategory: string;
  titleKo: string;
  titleEn?: string;
  definition: string;
  intuition: string;
  keyPoints: string[];
  pitfalls?: string | string[];
  example?: string;
  /**
   * 같은 category+subcategory를 공유하는 다른 개념과 문항을 정확히 나누고 싶을 때,
   * 이 개념에 실제로 속하는 문항만 정확히 지정한다. 지정하면 category+subcategory 매칭 대신
   * 이 목록만 사용한다.
   */
  questionRefs?: { year: number; questionNo: number }[];
  /** 이 개념이 다른 개념(부모)의 하위개념일 때, 부모 개념의 slug를 지정한다. */
  parentSlug?: string;
  /** 법령 개정·제도 폐지 등이 반영된 개념임을 알리는 짧은 안내(상세 상단 배지). */
  amendmentNotice?: string;
  sources?: import("@/lib/exam-track/types").ConceptSourceValue[];
  compareCard?: import("@/lib/exam-track/types").ConceptCompareCard;
  deepDive?: import("@/lib/exam-track/types").ConceptDeepDiveItem[];
  processFlow?: string[];
  typologyTable?: import("@/lib/exam-track/types").ConceptTypologyTable;
  spectrum?: import("@/lib/exam-track/types").ConceptSpectrum;
}

const CONCEPTS_BY_SUBJECT: Record<ExamSubject, Concept[]> = {
  civillaw: civillawConcepts,
  realestate: realestateConcepts,
  "broker-law": brokerLawConcepts,
  "registry-law": registryLawConcepts,
  "realestate-tax": realestateTaxConcepts,
  "realestate-public-law": realestatePublicLawConcepts,
};

export function getConceptsForSubject(subject: ExamSubject): Concept[] {
  return CONCEPTS_BY_SUBJECT[subject] ?? [];
}

export function getConcept(subject: ExamSubject, slug: string): Concept | undefined {
  return getConceptsForSubject(subject).find((c) => c.slug === slug);
}

export function getConceptQuestions(subject: ExamSubject, concept: Concept): ExamQuestion[] {
  if (concept.questionRefs) {
    return concept.questionRefs
      .map((ref) => getExamQuestion(subject, ref.year, ref.questionNo))
      .filter((q): q is ExamQuestion => Boolean(q))
      .sort((a, b) => b.year - a.year || a.questionNo - b.questionNo);
  }
  return getExamQuestionsForSubject(subject)
    .filter((q) => q.category === concept.category && q.subcategory === concept.subcategory)
    .sort((a, b) => b.year - a.year || a.questionNo - b.questionNo);
}

export function getConceptQuestionCount(subject: ExamSubject, concept: Concept): number {
  if (concept.questionRefs) return concept.questionRefs.length;
  return getExamQuestionsForSubject(subject).filter(
    (q) => q.category === concept.category && q.subcategory === concept.subcategory
  ).length;
}

export type { ConceptStatement };

export function getConceptStatements(
  subject: ExamSubject,
  concept: Concept
): ConceptStatement[] {
  return extractStatementsFromQuestions(getConceptQuestions(subject, concept), concept);
}

export function getAllConceptParams(): { subject: ExamSubject; slug: string }[] {
  return (Object.keys(CONCEPTS_BY_SUBJECT) as ExamSubject[]).flatMap((subject) =>
    getConceptsForSubject(subject).map((c) => ({ subject, slug: c.slug }))
  );
}

/** 기출 문항의 category·subcategory에 맞는 개념(기출 all-in-one)을 찾습니다. */
export function findConceptForExamQuestion(
  subject: ExamSubject,
  category: string,
  subcategory: string
): Concept | undefined {
  const matches = getConceptsForSubject(subject).filter(
    (concept) => concept.category === category && concept.subcategory === subcategory
  );
  if (matches.length === 0) return undefined;
  return matches.find((concept) => !concept.parentSlug) ?? matches[0];
}

/** 명시적 questionRefs를 우선하고, refs가 없는 개념만 기존 분류 매칭을 적용합니다. */
export function findConceptsForExamQuestion(
  subject: ExamSubject,
  question: Pick<ExamQuestion, "year" | "questionNo" | "category" | "subcategory">
): Concept[] {
  return getConceptsForSubject(subject).filter((concept) =>
    concept.questionRefs
      ? concept.questionRefs.some(
          (ref) => ref.year === question.year && ref.questionNo === question.questionNo
        )
      : concept.category === question.category && concept.subcategory === question.subcategory
  );
}
