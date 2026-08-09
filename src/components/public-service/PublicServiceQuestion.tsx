"use client";

import { ExamOxQuestion } from "@/components/exam/ExamOxQuestion";
import type { PublicServiceExam } from "@/lib/public-service-content";

export function PublicServiceQuestion({
  exam,
}: {
  exam: PublicServiceExam;
  subjectLabel?: string;
}) {
  return (
    <ExamOxQuestion
      examId={exam.id}
      items={exam.items}
      correctChoice={exam.correctChoice}
      explanationSummary={exam.explanationSummary}
    />
  );
}
