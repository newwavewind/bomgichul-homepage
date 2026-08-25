"use client";

import { ExamOxQuestion } from "@/components/exam/ExamOxQuestion";
import { toExamOxCombos } from "@/lib/exam-track/combo-choices";
import type { ExamTrackExam } from "@/lib/exam-track/types";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function ExamTrackQuestion({
  exam,
  revealSubject,
  userId = null,
  storageSubject,
  initialAttemptResult = null,
  passageLead = [],
  passageLabel,
}: {
  exam: ExamTrackExam;
  revealSubject?: string;
  subjectLabel?: string;
  userId?: string | null;
  storageSubject?: string;
  initialAttemptResult?: "correct" | "wrong" | null;
  passageLead?: string[];
  passageLabel?: string;
}) {
  const saveAttempt = async (result: "correct" | "wrong") => {
    if (!userId || !storageSubject || !isSupabaseConfigured()) return;
    const supabase = createClient();
    await supabase.from("question_attempts").upsert(
      { user_id: userId, subject: storageSubject, year: exam.year, question_no: exam.questionNo, result },
      { onConflict: "user_id,subject,year,question_no" },
    );
  };
  return (
    <ExamOxQuestion
      examId={exam.id}
      revealEvent={revealSubject ? {
        subject: revealSubject,
        year: exam.year,
        questionNo: exam.questionNo,
      } : undefined}
      items={exam.items}
      correctChoice={exam.correctChoice}
      comboChoices={toExamOxCombos(exam.comboChoices, exam.correctChoice)}
      passageLead={passageLead}
      passageLabel={passageLabel}
      choiceHeaders={exam.choiceHeaders}
      explanationSummary={exam.explanationSummary}
      initialAttemptResult={initialAttemptResult}
      onAttempt={saveAttempt}
      renderExplanation={!revealSubject}
      userId={userId}
    />
  );
}
