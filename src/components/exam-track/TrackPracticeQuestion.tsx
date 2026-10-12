"use client";

import { ExamMaterialFigure } from "@/components/exam/ExamMaterialFigure";
import { ExamOxQuestion } from "@/components/exam/ExamOxQuestion";
import { ExamStructuredMaterials } from "@/components/exam/ExamStructuredMaterials";
import { ExamSubjectNotice } from "@/components/exam/ExamSubjectNotice";
import { QuestionStem } from "@/components/exam/QuestionStem";
import type { ExamTrackExam } from "@/lib/exam-track/types";
import { getTrackQuestionPresentation } from "./questionPresentation";

export function TrackPracticeQuestion({ exam, loginNext, initialAttemptResult, onAttempt }: {
  exam: ExamTrackExam;
  loginNext: string;
  initialAttemptResult: "correct" | "wrong" | null;
  onAttempt: (result: "correct" | "wrong") => void | Promise<void>;
}) {
  const presentation = getTrackQuestionPresentation(exam);
  return (
    <>
      <ExamSubjectNotice notice={exam.notice} className="mb-4" />
      <QuestionStem
        stem={exam.stem ?? ""}
        questionNo={exam.questionNo}
        underlines={exam.underlines ?? null}
        renderBox={presentation.passageLead.length === 0}
        keepLineBreaks={exam.keepStemLines}
      />
      <ExamStructuredMaterials table={exam.table} stemTail={exam.stemTail} />
      <div className="mt-5">
        <ExamMaterialFigure material={exam.material} questionNo={exam.questionNo} />
        <ExamOxQuestion
          examId={exam.id}
          loginNext={loginNext}
          items={exam.items}
          correctChoice={exam.correctChoice}
          correctChoices={exam.correctChoices}
          examDate={exam.examDate}
          lawVersions={exam.lawVersions}
          {...presentation}
          choiceHeaders={exam.choiceHeaders}
          explanationSummary={exam.explanationSummary}
          initialAttemptResult={initialAttemptResult}
          onAttempt={onAttempt}
        />
      </div>
    </>
  );
}
