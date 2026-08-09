"use client";

import { ExamOxQuestion } from "@/components/exam/ExamOxQuestion";
import type { ExamTrackExam } from "@/lib/exam-track/types";

export function ExamTrackQuestion({
  exam,
}: {
  exam: ExamTrackExam;
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
