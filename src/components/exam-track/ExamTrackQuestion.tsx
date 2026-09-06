"use client";

import { useEffect, useState } from "react";
import { ExamOxQuestion } from "@/components/exam/ExamOxQuestion";
import { toExamOxCombos } from "@/lib/exam-track/combo-choices";
import type { ExamTrackExam } from "@/lib/exam-track/types";
import { useMe } from "@/lib/client-session";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/*
 * 로그인·풀이기록을 서버에서 받지 않고 스스로 알아낸다.
 *
 * 예전에는 페이지가 getUser 로 사용자와 지난 풀이 결과를 읽어 프롭으로 내려
 * 주었는데, 그 쿠키 조회 하나 때문에 문항 페이지 전체가 동적 렌더가 되어
 * CDN 캐시가 죽었다. 페이지는 정적으로 두고, 개인화는 여기서 클라이언트로
 * 한 번만 조회한다.
 */
export function ExamTrackQuestion({
  exam,
  revealSubject,
  storageSubject,
  passageLead = [],
  passageLabel,
}: {
  exam: ExamTrackExam;
  revealSubject?: string;
  subjectLabel?: string;
  storageSubject?: string;
  passageLead?: string[];
  passageLabel?: string;
}) {
  const { user } = useMe();
  const [attemptResult, setAttemptResult] = useState<"correct" | "wrong" | null>(null);
  useEffect(() => {
    if (!user || !storageSubject || !isSupabaseConfigured()) return;
    let alive = true;
    const supabase = createClient();
    void supabase
      .from("question_attempts")
      .select("result")
      .eq("user_id", user.id)
      .eq("subject", storageSubject)
      .eq("year", exam.year)
      .eq("question_no", exam.questionNo)
      .maybeSingle()
      .then(({ data }) => {
        if (alive && (data?.result === "correct" || data?.result === "wrong")) {
          setAttemptResult(data.result);
        }
      });
    return () => {
      alive = false;
    };
  }, [user, storageSubject, exam.year, exam.questionNo]);
  const saveAttempt = async (result: "correct" | "wrong") => {
    if (!user || !storageSubject || !isSupabaseConfigured()) return;
    const supabase = createClient();
    await supabase.from("question_attempts").upsert(
      { user_id: user.id, subject: storageSubject, year: exam.year, question_no: exam.questionNo, result },
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
      initialAttemptResult={attemptResult}
      onAttempt={saveAttempt}
      renderExplanation={!revealSubject}
    />
  );
}
