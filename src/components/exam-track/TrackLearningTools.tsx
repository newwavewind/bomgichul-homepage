"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ExamOxQuestion } from "@/components/exam/ExamOxQuestion";
import { QuestionStem } from "@/components/exam/QuestionStem";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ExamTrackExam } from "@/lib/exam-track/types";
import { examRenderKind } from "@/lib/exam-track/exam-render";

type Mode = "random" | "wrong" | "review" | "bookmarks" | "mock" | "stats";
type Attempt = { subject: string; year: number; question_no: number; result: "correct" | "wrong" };
type Bookmark = { subject: string; year: number; question_no: number };
type ReviewMemo = Bookmark & { content: string };

const MODE_LABELS: { id: Mode; label: string; icon: string }[] = [
  { id: "random", label: "랜덤 문제", icon: "🎲" },
  { id: "wrong", label: "오답노트", icon: "📕" },
  { id: "review", label: "오늘의 복습", icon: "📅" },
  { id: "bookmarks", label: "북마크", icon: "★" },
  { id: "mock", label: "모의고사", icon: "⏱" },
  { id: "stats", label: "학습 통계", icon: "📊" },
];

function storageSubject(scope: string, subjectId: string, sourceCode: string) {
  return `${scope}:${subjectId}:${sourceCode}`;
}

function examKey(exam: ExamTrackExam) {
  return `${exam.sourceCode}:${exam.year}:${exam.questionNo}`;
}

function rowKey(row: Pick<Attempt | Bookmark, "subject" | "year" | "question_no">) {
  const source = row.subject.split(":").slice(2).join(":");
  return `${source}:${row.year}:${row.question_no}`;
}

function seededDaily<T>(items: T[], seed: string, count: number) {
  let hash = [...seed].reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 7);
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const swap = hash % (index + 1);
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy.slice(0, count);
}

export function TrackLearningTools({
  scope,
  subjectId,
  basePath,
  exams: allExams,
  userId,
}: {
  scope: "public_service" | "police" | "housing" | "social_worker" | "history" | "english";
  subjectId: string;
  basePath: string;
  exams: ExamTrackExam[];
  userId: string | null;
}) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [reviewMemos, setReviewMemos] = useState<ReviewMemo[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(Boolean(userId));
  const prefix = `${scope}:${subjectId}:`;
  const loginHref = `/login?next=${encodeURIComponent(`${basePath}/exam/${subjectId}`)}`;

  const refresh = useCallback(async () => {
    if (!userId || !isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    const [{ data: attemptRows }, { data: bookmarkRows }, { data: memoRows }] = await Promise.all([
      supabase.from("question_attempts").select("subject,year,question_no,result").eq("user_id", userId).like("subject", `${prefix}%`),
      supabase.from("question_bookmarks").select("subject,year,question_no").eq("user_id", userId).like("subject", `${prefix}%`),
      supabase.from("question_public_memos").select("subject,year,question_no,content").eq("user_id", userId).like("subject", `${prefix}%`),
    ]);
    setAttempts((attemptRows ?? []) as Attempt[]);
    setBookmarks((bookmarkRows ?? []) as Bookmark[]);
    setReviewMemos((memoRows ?? []) as ReviewMemo[]);
    setLoading(false);
  }, [prefix, userId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const attemptMap = useMemo(() => new Map(attempts.map((row) => [rowKey(row), row.result])), [attempts]);
  const bookmarkSet = useMemo(() => new Set(bookmarks.map(rowKey)), [bookmarks]);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());

  const pool = useMemo(() => {
    if (!mode) return [];
    // 선택지를 고르는 도구라 객관식만 담는다. 주관식(단답형)은 상세 페이지에서만 본다.
    const exams = allExams.filter((exam) => examRenderKind(exam) === "objective");
    if (mode === "wrong") return exams.filter((exam) => attemptMap.get(examKey(exam)) === "wrong");
    if (mode === "bookmarks") return exams.filter((exam) => bookmarkSet.has(examKey(exam)));
    if (mode === "review") {
      const priority = exams.filter((exam) => attemptMap.get(examKey(exam)) === "wrong" || bookmarkSet.has(examKey(exam)));
      const remaining = exams.filter((exam) => !priority.includes(exam));
      return seededDaily([...priority, ...remaining], `${today}:${prefix}`, 10);
    }
    if (mode === "mock") {
      const latest = [...exams].sort((a, b) => b.year - a.year || a.questionNo - b.questionNo)[0];
      return latest ? exams.filter((exam) => exam.year === latest.year && exam.sourceCode === latest.sourceCode) : [];
    }
    if (mode === "random") return seededDaily(exams, `${Date.now()}:${prefix}`, 10);
    return [];
  }, [allExams, attemptMap, bookmarkSet, mode, prefix, today]);

  const current = pool[index] ?? null;
  const selectMode = (next: Mode) => { setMode(next); setIndex(0); };

  const saveAttempt = async (exam: ExamTrackExam, result: "correct" | "wrong") => {
    if (!userId || !isSupabaseConfigured()) return;
    const subject = storageSubject(scope, subjectId, exam.sourceCode);
    const supabase = createClient();
    await supabase.from("question_attempts").upsert(
      { user_id: userId, subject, year: exam.year, question_no: exam.questionNo, result },
      { onConflict: "user_id,subject,year,question_no" },
    );
    setAttempts((rows) => [...rows.filter((row) => rowKey(row) !== examKey(exam)), { subject, year: exam.year, question_no: exam.questionNo, result }]);
  };

  const toggleBookmark = async (exam: ExamTrackExam) => {
    if (!userId || !isSupabaseConfigured()) return;
    const subject = storageSubject(scope, subjectId, exam.sourceCode);
    const active = bookmarkSet.has(examKey(exam));
    const supabase = createClient();
    if (active) {
      await supabase.from("question_bookmarks").delete().eq("user_id", userId).eq("subject", subject).eq("year", exam.year).eq("question_no", exam.questionNo);
      setBookmarks((rows) => rows.filter((row) => rowKey(row) !== examKey(exam)));
    } else {
      await supabase.from("question_bookmarks").insert({ user_id: userId, subject, year: exam.year, question_no: exam.questionNo });
      setBookmarks((rows) => [...rows, { subject, year: exam.year, question_no: exam.questionNo }]);
    }
  };

  const correct = attempts.filter((row) => row.result === "correct").length;
  const wrong = attempts.filter((row) => row.result === "wrong").length;
  const total = correct + wrong;
  const reviewItemCount = bookmarks.length + reviewMemos.length;
  const reviewPdfHref = `/api/review-pdf/track/${scope}/${subjectId}`;

  return (
    <section className="mt-10 pt-8" id="learning-tools">
      <div className="flex justify-end">
        {!userId ? (
          <Link href={loginHref} className="rounded-full border border-carbon px-4 py-2 font-display text-body-sm font-semibold text-ink">복습 PDF 저장 · 로그인</Link>
        ) : loading ? (
          <span className="rounded-full border border-mist px-4 py-2 font-display text-body-sm font-semibold text-fog">복습 PDF 준비 중…</span>
        ) : reviewItemCount === 0 ? (
          <span className="rounded-full border border-mist px-4 py-2 font-display text-body-sm font-semibold text-fog">복습 PDF (북마크·메모 없음)</span>
        ) : (
          <a href={reviewPdfHref} className="rounded-full border border-carbon px-4 py-2 font-display text-body-sm font-semibold text-ink">복습 PDF 저장</a>
        )}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {MODE_LABELS.map((item) => (
          <button key={item.id} type="button" onClick={() => selectMode(item.id)} className={`rounded-2xl border px-3 py-3 font-display text-body-sm font-semibold ${mode === item.id ? "border-ios-blue bg-ios-blue/[0.08] text-ios-blue" : "border-mist bg-paper text-ink hover:border-carbon"}`}>
            <span aria-hidden className="mr-1">{item.icon}</span>{item.label}
          </button>
        ))}
      </div>
      {!userId && mode ? (
        <div className="mt-5 rounded-2xl border border-ios-blue/25 bg-ios-blue/[0.06] p-6 text-center">
          <p className="font-display text-body font-semibold text-ink">
            홈페이지 기능은 전부 무료예요. 로그인만 하면 학습 기록·오답노트·북마크·랜덤·복습·PDF를
            결제 없이 쓸 수 있어요.
          </p>
          <Link href={loginHref} className="mt-4 inline-flex rounded-full bg-ios-blue px-5 py-2.5 font-display text-body-sm font-semibold text-white">무료로 로그인</Link>
        </div>
      ) : loading && mode ? <p className="mt-5 font-display text-body-sm text-fog">학습 기록을 불러오는 중…</p> : null}
      {userId && mode === "stats" ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          {[["풀이", total], ["정답", correct], ["오답", wrong], ["정답률", total ? `${Math.round(correct / total * 100)}%` : "—"]].map(([label, value]) => <div key={label} className="rounded-2xl border border-mist bg-paper p-5"><p className="font-display text-body-sm text-fog">{label}</p><p className="mt-2 font-display text-[26px] font-semibold text-ink">{value}</p></div>)}
        </div>
      ) : null}
      {userId && mode && mode !== "stats" && !current && !loading ? <p className="mt-5 rounded-2xl border border-mist bg-paper p-6 font-display text-body text-smoke">아직 표시할 문제가 없어요. 먼저 기출문제를 풀어 주세요.</p> : null}
      {userId && current ? (
        <div className="mt-6 rounded-[var(--radius-largecards)] border border-mist bg-paper p-5 md:p-7">
          <div className="mb-4 flex items-center justify-between gap-3 font-display text-body-sm text-fog"><span>{index + 1} / {pool.length} · {current.year}년 {current.sourceCode}</span><button type="button" onClick={() => void toggleBookmark(current)} className="font-semibold text-ios-blue">{bookmarkSet.has(examKey(current)) ? "★ 북마크됨" : "☆ 북마크"}</button></div>
          <QuestionStem stem={current.stem ?? ""} questionNo={current.questionNo} />
          <div className="mt-5"><ExamOxQuestion key={`${mode}:${examKey(current)}`} examId={current.id} items={current.items} correctChoice={current.correctChoice} explanationSummary={current.explanationSummary} initialAttemptResult={attemptMap.get(examKey(current)) ?? null} onAttempt={(result) => saveAttempt(current, result)} userId={userId} /></div>
          <div className="mt-5 flex justify-end"><button type="button" onClick={() => setIndex((value) => Math.min(value + 1, pool.length - 1))} disabled={index >= pool.length - 1} className="rounded-full bg-carbon px-5 py-2.5 font-display text-body-sm font-semibold text-paper disabled:opacity-30">다음 문제 →</button></div>
        </div>
      ) : null}
    </section>
  );
}
