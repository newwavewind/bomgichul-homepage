import papers from "@/data/public-service-original-papers.json";
import type { OriginalExamPaper } from "@/lib/exam-track/original-paper";

const byExamId: Readonly<Record<string, OriginalExamPaper>> = papers;

export function getPublicServiceOriginalPaper(examId: string): OriginalExamPaper | undefined {
  return byExamId[examId];
}
