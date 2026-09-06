"use client";

import { useEffect, useState } from "react";
import { ExamOxQuestion } from "@/components/exam/ExamOxQuestion";
import type { PublicServiceExam } from "@/lib/public-service-content";
import { useMe } from "@/lib/client-session";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/*
 * 로그인·풀이기록을 서버에서 받지 않고 스스로 알아낸다.
 *
 * 페이지가 getUser 로 쿠키를 읽으면 문항 페이지 전체가 동적 렌더가 되어
 * CDN 캐시가 죽는다. 페이지는 정적으로 두고, 개인화는 여기서 클라이언트로
 * 한 번만 조회한다.
 */
export function PublicServiceQuestion({
  exam,
  revealSubject,
  storageSubject,
}: {
  exam: PublicServiceExam;
  revealSubject?: string;
  subjectLabel?: string;
  storageSubject?: string;
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
      explanationSummary={exam.explanationSummary}
      choiceHeaders={exam.choiceHeaders}
      initialAttemptResult={attemptResult}
      onAttempt={saveAttempt}
      renderExplanation={!revealSubject}
    />
  );
}
