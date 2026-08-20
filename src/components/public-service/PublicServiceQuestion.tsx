"use client";

import { ExamOxQuestion } from "@/components/exam/ExamOxQuestion";
import type { PublicServiceExam } from "@/lib/public-service-content";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function PublicServiceQuestion({
  exam,
  revealSubject,
  userId = null,
  storageSubject,
  initialAttemptResult = null,
}: {
  exam: PublicServiceExam;
  revealSubject?: string;
  subjectLabel?: string;
  userId?: string | null;
  storageSubject?: string;
  initialAttemptResult?: "correct" | "wrong" | null;
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
      explanationSummary={exam.explanationSummary}
      choiceHeaders={exam.choiceHeaders}
      initialAttemptResult={initialAttemptResult}
      onAttempt={saveAttempt}
      renderExplanation={!revealSubject}
    />
  );
}
