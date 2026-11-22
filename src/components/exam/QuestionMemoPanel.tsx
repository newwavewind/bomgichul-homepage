"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { QuestionMemoCard, type MemoViewer } from "@/components/exam/QuestionMemoCard";
import { QuestionMemoComposer, type QuestionMemoVisibility } from "@/components/exam/QuestionMemoComposer";
import { requestRevalidate, useMe } from "@/lib/client-session";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { QuestionDiscussionMemo } from "@/types/database";

type MemoPanelProps = {
  subject: string;
  year: number;
  questionNo: number;
  userId?: string | null;
  loginNext?: string;
};

type SortOrder = "latest" | "recommended";

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "recommended", label: "추천순" },
];

async function fetchQuestionMemos(subject: string, year: number, questionNo: number, signal: AbortSignal) {
  try {
    const params = new URLSearchParams({ subject, year: String(year), no: String(questionNo) });
    const response = await fetch(`/api/exam/my-memos?${params}`, { cache: "no-store", signal });
    if (!response.ok) return null;
    const { memos } = (await response.json()) as { memos: QuestionDiscussionMemo[] | null };
    return memos;
  } catch {
    return null;
  }
}

export function QuestionMemoPanel(props: MemoPanelProps) {
  const me = useMe();
  const userId = props.userId === undefined ? (me.user?.id ?? null) : props.userId;
  const viewer: MemoViewer = {
    pending: props.userId === undefined && me.pending,
    userId,
    isAdmin: me.user?.id === userId && me.user?.isAdmin,
  };
  return <QuestionMemoDiscussion {...props} viewer={viewer}
    key={JSON.stringify([props.subject, props.year, props.questionNo, userId])} />;
}

function QuestionMemoDiscussion({ subject, year, questionNo, loginNext, viewer }: MemoPanelProps & { viewer: MemoViewer }) {
  const headingId = useId();
  const [memos, setMemos] = useState<QuestionDiscussionMemo[]>([]);
  const [threadState, setThreadState] = useState<"loading" | "ready" | "error">("loading");
  const [visibility, setVisibility] = useState<QuestionMemoVisibility>("public");
  const isPublic = visibility === "public";
  const [sort, setSort] = useState<SortOrder>("latest");
  const latestRequest = useRef<AbortController | null>(null);
  const returnTo = loginNext ?? `/exam/${subject}/${year}/${questionNo}`;
  const loginHref = `/login?next=${encodeURIComponent(returnTo)}`;

  const loadCurrentThread = useCallback(async () => {
    latestRequest.current?.abort();
    const controller = new AbortController();
    latestRequest.current = controller;
    const nextMemos = await fetchQuestionMemos(subject, year, questionNo, controller.signal);
    return { nextMemos, signal: controller.signal };
  }, [subject, year, questionNo]);

  useEffect(() => {
    if (viewer.pending) return;
    void loadCurrentThread().then(({ nextMemos, signal }) => {
      if (signal.aborted) return;
      if (nextMemos) setMemos(nextMemos);
      setThreadState(nextMemos ? "ready" : "error");
    });
    return () => latestRequest.current?.abort();
  }, [loadCurrentThread, viewer.pending, viewer.userId]);

  useEffect(() => {
    const anchor = window.location.hash.slice(1);
    if (anchor.startsWith("memo-")) document.getElementById(anchor)?.scrollIntoView({ block: "start" });
  }, [memos]);

  const handleChange = async () => {
    requestRevalidate(returnTo);
    const { nextMemos, signal } = await loadCurrentThread();
    if (signal.aborted) return;
    if (nextMemos) setMemos(nextMemos);
    setThreadState(nextMemos ? "ready" : "error");
  };

  const handlePost = async (content: string) => {
    if (!viewer.userId || !isSupabaseConfigured()) return false;
    const { error } = await createClient().from("question_public_memos").insert({
      user_id: viewer.userId,
      subject,
      year,
      question_no: questionNo,
      content,
    });
    if (error) return false;
    await handleChange();
    return true;
  };

  const publicMemos = memos.filter((memo) => memo.visibility !== "private");
  const count = publicMemos.reduce((total, memo) => total + 1 + memo.comments.length, 0);
  const visibleMemos = memos.filter((memo) => isPublic ? memo.visibility !== "private" : memo.visibility === "private");
  const orderedMemos = visibleMemos.sort((left, right) =>
    (isPublic && sort === "recommended" ? right.like_count - left.like_count : 0)
    || Date.parse(right.created_at) - Date.parse(left.created_at)
    || left.id.localeCompare(right.id)
  );

  return (
    <section aria-labelledby={headingId} className="rounded-2xl border border-mist bg-paper px-4 py-3 sm:px-5">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h2 id={headingId} className="font-display text-body font-semibold text-ink">이 문제에 대한 이야기</h2>
          {isPublic && <p aria-live="polite" className="font-display text-body-sm text-smoke">
            댓글 <span className="font-semibold tabular-nums text-[color:light-dark(#155bd7,#a5ceff)]">{count.toLocaleString("ko-KR")}</span>
          </p>}
        </div>
        {isPublic && <div role="group" aria-label="댓글 정렬" className="inline-flex rounded-full bg-surface p-1">
          {sortOptions.map(({ value, label }) => (
            <button key={value} type="button" aria-pressed={sort === value} onClick={() => setSort(value)}
              className={`rounded-full px-3 py-1 font-display text-body-sm focus-visible:outline-2 focus-visible:outline-ios-blue ${sort === value
                ? "bg-paper font-semibold text-ink shadow-sm"
                : "text-smoke hover:text-ink"}`}>
              {label}
            </button>
          ))}
        </div>}
      </div>

      {viewer.userId || viewer.pending ? (
        <QuestionMemoComposer subject={subject} year={year} questionNo={questionNo}
          userId={viewer.userId} loginNext={returnTo} postPublic={handlePost}
          visibility={visibility} onVisibilityChange={setVisibility} onPublished={handleChange} />
      ) : (
        <p className="mb-2 font-display text-body-sm text-smoke">
          <Link href={loginHref} className="font-semibold text-[color:light-dark(#005dbf,#a5ceff)] hover:underline">로그인</Link>하면 이 문제에 대해 글을 남길 수 있어요.
        </p>
      )}

      {orderedMemos.length > 0 && (
        <div className="space-y-3">
          {orderedMemos.map((memo) => (
            <QuestionMemoCard key={memo.id} memo={memo} viewer={viewer} loginHref={loginHref}
              onChanged={handleChange} onVisibilityChanged={(next) => {
                setMemos((current) => current.map((row) => row.id === memo.id ? { ...row, visibility: next } : row));
                setVisibility(next);
              }} />
          ))}
        </div>
      )}
      {threadState === "error" && <p role="alert" className="py-1.5 text-body-sm text-smoke">글을 불러오지 못했어요. 새로고침 후 다시 시도해 주세요.</p>}
      {isPublic && orderedMemos.length === 0 && threadState !== "error" && (
        <p className="py-1.5 text-center font-display text-body-sm text-fog">
          {threadState === "loading" ? "글을 불러오고 있어요." : "아직 공개 글이 없어요."}
        </p>
      )}
    </section>
  );
}
