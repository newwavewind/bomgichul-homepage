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
  free: boolean;
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
