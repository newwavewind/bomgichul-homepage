import civillaw from "@/data/exam-questions/civillaw.json";
import realestate from "@/data/exam-questions/realestate.json";
import brokerLaw from "@/data/exam-questions/broker-law.json";
import registryLaw from "@/data/exam-questions/registry-law.json";
import realestateTax from "@/data/exam-questions/realestate-tax.json";
import realestatePublicLaw from "@/data/exam-questions/realestate-public-law.json";
import type { ArchiveSubject } from "@/lib/constants";

export type ExamSubject = Exclude<ArchiveSubject, "all" | "other">;

export interface ExamQuestionItem {
  key: string;
  label: string;
  text: string;
  answer: "O" | "X";
  explanation: string;
}

export interface ExamComboChoice {
  no: number;
  label: string;
  text: string;
  isCorrect: boolean;
}

export interface ExamQuestion {
  subject: ExamSubject;
  year: number;
  round: number;
  questionNo: number;
  stem: string;
  category: string;
  subcategory: string;
  questionType: "correct" | "wrong" | "composite";
  correctChoice: string;
  items: ExamQuestionItem[];
  comboChoices: ExamComboChoice[];
  free: boolean;
}

/** ㄱ·ㄴ·ㄷ 보기 + ①②③ 조합 선지 형태의 조합형 문항 */
export function isStatementCompositeQuestion(question: Pick<ExamQuestion, "questionType" | "comboChoices">): boolean {
  return question.questionType === "composite" && question.comboChoices.length > 0;
}

const QUESTIONS_BY_SUBJECT: Record<ExamSubject, ExamQuestion[]> = {
  civillaw: civillaw as ExamQuestion[],
  realestate: realestate as ExamQuestion[],
  "broker-law": brokerLaw as ExamQuestion[],
  "registry-law": registryLaw as ExamQuestion[],
  "realestate-tax": realestateTax as ExamQuestion[],
  "realestate-public-law": realestatePublicLaw as ExamQuestion[],
};

export function getExamQuestionsForSubject(subject: ExamSubject): ExamQuestion[] {
  return QUESTIONS_BY_SUBJECT[subject] ?? [];
}

export function getExamYears(subject: ExamSubject): number[] {
  const years = new Set(getExamQuestionsForSubject(subject).map((q) => q.year));
  return [...years].sort((a, b) => b - a);
}

export function getExamQuestionsForYear(subject: ExamSubject, year: number): ExamQuestion[] {
  return getExamQuestionsForSubject(subject)
    .filter((q) => q.year === year)
    .sort((a, b) => a.questionNo - b.questionNo);
}

export function getExamQuestion(
  subject: ExamSubject,
  year: number,
  questionNo: number
): ExamQuestion | undefined {
  return getExamQuestionsForSubject(subject).find(
    (q) => q.year === year && q.questionNo === questionNo
  );
}

export function getAllExamParams(): { subject: ExamSubject; year: string; no: string }[] {
  return (Object.keys(QUESTIONS_BY_SUBJECT) as ExamSubject[]).flatMap((subject) =>
    getExamQuestionsForSubject(subject).map((q) => ({
      subject,
      year: String(q.year),
      no: String(q.questionNo),
    }))
  );
}

export function getExamYearParams(): { subject: ExamSubject; year: string }[] {
  return (Object.keys(QUESTIONS_BY_SUBJECT) as ExamSubject[]).flatMap((subject) =>
    getExamYears(subject).map((year) => ({ subject, year: String(year) }))
  );
}

export function getCategoriesForSubject(subject: ExamSubject): string[] {
  const categories = new Set(
    getExamQuestionsForSubject(subject)
      .map((q) => q.category)
      .filter((c) => c && c !== "미분류")
  );
  return [...categories].sort((a, b) => a.localeCompare(b, "ko"));
}

export function filterExamQuestions(
  subject: ExamSubject,
  options: { years?: number[]; categories?: string[] }
): ExamQuestion[] {
  return getExamQuestionsForSubject(subject).filter((q) => {
    if (options.years?.length && !options.years.includes(q.year)) return false;
    if (options.categories?.length && !options.categories.includes(q.category)) return false;
    return true;
  });
}

export function shuffleQuestions<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
