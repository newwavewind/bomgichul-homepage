"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useMe } from "@/lib/client-session";
import { formatKstDateTimeShort } from "@/lib/datetime";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const PAGE_SIZE = 20;

type CommentRow = {
  id: string;
  question_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: { nickname: string } | { nickname: string }[] | null;
};

function authorName(row: CommentRow) {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  return profile?.nickname || "회원";
}

export function DailyQuestionDiscussion({ questionId }: { questionId: string }) {
  return <QuestionDiscussion key={questionId} questionId={questionId} />;
}

function QuestionDiscussion({ questionId }: { questionId: string }) {
  const viewer = useMe();
  const configured = isSupabaseConfigured();
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(configured);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(configured ? "" : "글을 불러올 수 없습니다.");
  const [loginHref, setLoginHref] = useState("/login");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setLoginHref(`/login?next=${encodeURIComponent(location.pathname + location.search)}`);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!configured) return;
    let active = true;

    void createClient()
      .from("daily_question_comments")
      .select("id, question_id, user_id, content, created_at, profiles:user_id(nickname)", { count: "exact" })
      .eq("question_id", questionId)
      .order("created_at", { ascending: false })
      .limit(PAGE_SIZE + 1)
      .then(({ data, count, error: loadError }) => {
        if (!active) return;
        if (loadError) {
          setError("글을 불러오지 못했습니다. 잠시 후 다시 열어 주세요.");
        } else {
          const rows = (data ?? []) as CommentRow[];
          setComments(rows.slice(0, PAGE_SIZE).reverse());
          setHasMore(rows.length > PAGE_SIZE);
          setTotal(count ?? rows.length);
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [configured, questionId]);

  const loadMore = async () => {
    const oldest = comments[0];
    if (!oldest || !hasMore || loadingMore) return;
    setLoadingMore(true);
    const { data, error: loadError } = await createClient()
      .from("daily_question_comments")
      .select("id, question_id, user_id, content, created_at, profiles:user_id(nickname)")
      .eq("question_id", questionId)
      .lt("created_at", oldest.created_at)
      .order("created_at", { ascending: false })
      .limit(PAGE_SIZE + 1);
    if (loadError) {
      setError("이전 글을 불러오지 못했습니다.");
    } else {
      const rows = (data ?? []) as CommentRow[];
      setComments((current) => [...rows.slice(0, PAGE_SIZE).reverse(), ...current]);
      setHasMore(rows.length > PAGE_SIZE);
      setError("");
    }
    setLoadingMore(false);
  };

  const submit = async () => {
    const content = draft.trim();
    const user = viewer.user;
    if (!user || !content || content.length > 1000 || saving) return;
    setSaving(true);
    setError("");
    const { data, error: saveError } = await createClient()
      .from("daily_question_comments")
      .insert({ question_id: questionId, user_id: user.id, content })
      .select("id, question_id, user_id, content, created_at")
      .single();
    if (saveError || !data) {
      setError("글을 저장하지 못했습니다. 다시 시도해 주세요.");
    } else {
      setComments((current) => [
        ...current,
        { ...data, profiles: { nickname: user.nickname } },
      ]);
      setTotal((current) => current + 1);
      setDraft("");
    }
    setSaving(false);
  };

  return (
    <section className="mt-5 border-t border-[color:light-dark(#E6EDF5,var(--color-mist))] pt-4" aria-label="이 문제에 대한 글">
      <div className="flex items-baseline justify-between gap-2">
        <h4 className="text-sm font-semibold text-[color:light-dark(#334155,var(--color-ink))]">이 문제에 대한 글</h4>
        {!loading && !error ? (
          <span className="text-xs text-[color:light-dark(#8190A3,var(--color-smoke))]">{total}개</span>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-[color:light-dark(#8190A3,var(--color-smoke))]">
        같은 문제가 다시 출제돼도 여기에 남긴 글을 계속 볼 수 있어요.
      </p>

      {loading ? (
        <p className="mt-3 text-sm text-[color:light-dark(#8190A3,var(--color-smoke))]">글을 불러오는 중...</p>
      ) : (
        <div className="mt-3 space-y-2">
          {hasMore ? (
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="text-xs font-medium text-[color:light-dark(#526B89,var(--color-carbon))] hover:underline disabled:opacity-50"
            >
              {loadingMore ? "불러오는 중..." : "이전 글 더 보기"}
            </button>
          ) : null}
          {comments.map((comment) => (
            <article key={comment.id} className="rounded-xl bg-[color:light-dark(#F7F9FC,var(--color-snow))] px-3 py-2.5">
              <div className="flex flex-wrap items-baseline gap-x-2 text-xs">
                <span className="font-semibold text-smoke">{authorName(comment)}</span>
                <time dateTime={comment.created_at} className="text-[color:light-dark(#94A3B8,var(--color-smoke))]">
                  {formatKstDateTimeShort(comment.created_at)}
                </time>
              </div>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-[color:light-dark(#334155,var(--color-ink))]">
                {comment.content}
              </p>
            </article>
          ))}
          {!comments.length && !error ? (
            <p className="text-sm text-[color:light-dark(#8190A3,var(--color-smoke))]">아직 글이 없습니다. 첫 글을 남겨 보세요.</p>
          ) : null}
        </div>
      )}

      {error ? <p role="alert" className="mt-2 text-xs text-[color:light-dark(#B45309,var(--color-amber))]">{error}</p> : null}
      {viewer.pending ? null : viewer.user ? (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="min-w-0 flex-1">
            <span className="sr-only">이 문제에 글 작성</span>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={1000}
              rows={2}
              placeholder="질문이나 풀이 팁을 남겨 보세요."
              className="w-full resize-y rounded-xl border border-[color:light-dark(#DCE6F1,var(--color-mist))] bg-white px-3 py-2 text-sm leading-6 text-[color:light-dark(#334155,var(--color-ink))] outline-none placeholder:text-[color:light-dark(#94A3B8,var(--color-smoke))] focus:border-[#8BB9EA] focus:ring-2 focus:ring-[color:light-dark(#D9EAFB,var(--color-mist))]"
            />
          </label>
          <button
            type="button"
            onClick={submit}
            disabled={!draft.trim() || saving || loading}
            className="self-end rounded-xl bg-[color:light-dark(#EAF3FF,color-mix(in_srgb,var(--color-snow)_90%,#EAF3FF))] px-4 py-2 text-sm font-semibold text-[color:light-dark(#1769C2,var(--color-carbon))] transition-colors hover:bg-[color:light-dark(#DDEEFF,color-mix(in_srgb,var(--color-snow)_90%,#DDEEFF))] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "등록 중..." : "글 등록"}
          </button>
        </div>
      ) : (
        <p className="mt-3 text-sm text-fog">
          <Link href={loginHref} className="font-medium text-[color:light-dark(#1769C2,var(--color-carbon))] hover:underline">
            로그인
          </Link>
          하면 이 문제에 글을 남길 수 있어요.
        </p>
      )}
    </section>
  );
}
