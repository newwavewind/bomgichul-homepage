import hangjunghak from "@/data/public-service/hangjunghak.json";
import haengjeongbeop from "@/data/public-service/haengjeongbeop.json";
import gwansebeop from "@/data/public-service/gwansebeop.json";
import sebeop from "@/data/public-service/sebeop.json";
import hoegyehak from "@/data/public-service/hoegyehak.json";
import hyeongbeop from "@/data/public-service/hyeongbeop.json";
import hyeongso from "@/data/public-service/hyeongso.json";
import hyeongsogaeron from "@/data/public-service/hyeongsogaeron.json";
import gyojeonghak from "@/data/public-service/gyojeonghak.json";
import gyoyukhak from "@/data/public-service/gyoyukhak.json";
import gukjebeop from "@/data/public-service/gukjebeop.json";
import nodongbeop from "@/data/public-service/nodongbeop.json";
import bokji from "@/data/public-service/bokji.json";
import sobang from "@/data/public-service/sobang.json";
import sobangbeop from "@/data/public-service/sobangbeop.json";
import hoegyewonri from "@/data/public-service/hoegyewonri.json";

export interface PublicServiceConcept {
  slug: string;
  chapterKo?: string;
  sectionKo?: string;
  category: string;
  subcategory: string;
  titleKo: string;
  titleEn?: string;
  definition: string;
  intuition?: string;
  keyPoints?: string[];
  pitfalls?: string | string[];
  example?: string;
  pitfallCards?: { wrong: string; correct: string }[];
  questionRefs?: { examId?: string; year: number; sourceCode?: string; questionNo: number }[];
  sources?: import("@/lib/exam-track/types").ConceptSourceValue[];
  parentSlug?: string;
  amendmentNotice?: string;
  compareCard?: import("@/lib/exam-track/types").ConceptCompareCard;
  deepDive?: import("@/lib/exam-track/types").ConceptDeepDiveItem[];
  processFlow?: string[];
  typologyTable?: import("@/lib/exam-track/types").ConceptTypologyTable;
  spectrum?: import("@/lib/exam-track/types").ConceptSpectrum;
}

export interface PublicServiceExamItem {
  key: string;
  label?: string;
  text: string;
  answer?: "O" | "X" | string;
  explanation?: string;
  taxonomy_unit_id?: string;
}

export type PublicServiceTableCell =
  | string
  | { text?: string; colSpan?: number; rowSpan?: number; align?: "left" | "center" };

export interface PublicServiceExamTable {
  caption?: string;
  lead?: string;
  headers?: string[];
  headerRows?: Array<Array<string | { text?: string; colSpan?: number; rowSpan?: number }>>;
  rows: PublicServiceTableCell[][];
  notes?: string[];
}

export interface PublicServiceTAccount {
  title: string;
  debit?: [string, string][];
  credit?: [string, string][];
}

export interface PublicServiceExam {
  id: string;
  year: number;
  sourceCode: string;
  source?: string;
  questionNo: number;
  material?: { image: string; width?: number; height?: number; figureFirst?: boolean };
  table?: PublicServiceExamTable | PublicServiceExamTable[];
  stemTail?: string;
  tAccounts?: PublicServiceTAccount[];
  choiceHeaders?: string[];
  stem: string;
  questionType?: string;
  correctChoice?: number;
  category?: string;
  subcategory?: string;
  explanationTopic?: string;
  explanationSummary?: string;
  items: PublicServiceExamItem[];
  comboChoices?: unknown[];
}

export interface PublicServiceSubjectContent {
  subject: { id: string; label: string; track: string };
  years: number[];
  sources: string[];
  concepts: PublicServiceConcept[];
  exams: PublicServiceExam[];
}

const contentBySubject = {
  hangjunghak,
  haengjeongbeop,
  gwansebeop,
  sebeop,
  hoegyehak,
  hyeongbeop,
  hyeongso,
  hyeongsogaeron,
  gyojeonghak,
  gyoyukhak,
  gukjebeop,
  nodongbeop,
  bokji,
  sobang,
  sobangbeop,
  hoegyewonri,
} as unknown as Record<string, PublicServiceSubjectContent>;

export const PUBLIC_SERVICE_SUBJECT_IDS = Object.keys(contentBySubject);

export function getPublicServiceSubject(subjectId: string) {
  return contentBySubject[subjectId] ?? null;
}

export function getPublicServiceConcept(subjectId: string, slug: string) {
  return getPublicServiceSubject(subjectId)?.concepts.find((concept) => concept.slug === slug) ?? null;
}

export function getPublicServiceExam(
  subjectId: string,
  year: number,
  sourceCode: string,
  questionNo: number,
) {
  return getPublicServiceSubject(subjectId)?.exams.find(
    (exam) => exam.year === year && exam.sourceCode === sourceCode && exam.questionNo === questionNo,
  ) ?? null;
}

export function getPublicServiceExamSessions(subjectId: string) {
  const subject = getPublicServiceSubject(subjectId);
  if (!subject) return [];
  const sessions = new Map<string, { year: number; sourceCode: string; count: number }>();
  for (const exam of subject.exams) {
    const key = `${exam.year}-${exam.sourceCode}`;
    const current = sessions.get(key) ?? { year: exam.year, sourceCode: exam.sourceCode, count: 0 };
    current.count += 1;
    sessions.set(key, current);
  }
  return [...sessions.values()].sort((a, b) => b.year - a.year || a.sourceCode.localeCompare(b.sourceCode, "ko"));
}
