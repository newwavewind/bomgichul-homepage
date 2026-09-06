"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Textarea } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/Button";
import type { PublicQuestionMemo } from "@/types/database";
import { formatKstDateTimeShort } from "@/lib/datetime";
import { useMe, requestRevalidate } from "@/lib/client-session";

function formatMemoDate(iso: string): string {
  return formatKstDateTimeShort(iso);
}

/**
 * 방문자 상태 — pending(로그인 판정 중)을 비로그인과 갈라 둔다.
 * 판정 중에 로그인 유도 문구를 그리면 로그인해 둔 사람에게 깜빡 보인다.
 */
type Viewer = { pending: boolean; userId: string | null };

function LoginHint({ href, action }: { href: string; action: string }) {
  return (
    <p className="font-display text-[12px] text-fog">
      {action}{" "}
      <Link href={href} className="font-medium text-[#6366f1] hover:underline">
        로그인
      </Link>
    </p>
  );
}

function MemoCard({
  memo,
  viewer,
  loginHref,
  onChanged,
}: {
  memo: PublicQuestionMemo;
  viewer: Viewer;
  loginHref: string;
  onChanged: () => void;
}) {
  const [commentText, setCommentText] = useState("");
  const [busy, setBusy] = useState(false);
  const resolvedAnon = !viewer.pending && !viewer.userId;

  const toggleLike = async () => {
    if (!viewer.userId) return;
    if (!isSupabaseConfigured() || busy) return;
    setBusy(true);
    const supabase = createClient();
    if (memo.liked_by_viewer) {
      await supabase
        .from("question_public_memo_likes")
        .delete()
        .eq("memo_id", memo.id)
        .eq("user_id", viewer.userId);
    } else {
      await supabase.from("question_public_memo_likes").insert({
        memo_id: memo.id,
        user_id: viewer.userId,
      });
    }
    setBusy(false);
    onChanged();
  };

  const submitComment = async () => {
    const trimmed = commentText.trim();
    if (!viewer.userId || !trimmed || !isSupabaseConfigured() || busy) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.from("question_public_memo_comments").insert({
      memo_id: memo.id,
      user_id: viewer.userId,
      content: trimmed,
    });
    setCommentText("");
    setBusy(false);
    onChanged();
  };

  return (
    <article
      id={`memo-${memo.id}`}
      className="scroll-mt-24 border-b border-mist/60 py-4 last:border-b-0"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display text-body-sm font-semibold text-ink">
            {memo.author.nickname}
          </p>
          <p className="mt-0.5 font-display text-[11px] text-fog">
            {formatMemoDate(memo.created_at)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => (viewer.userId ? toggleLike() : undefined)}
          disabled={busy}
          title={
            viewer.userId
              ? memo.liked_by_viewer
                ? "좋아요 취소"
                : "좋아요"
              : resolvedAnon
                ? "로그인 후 좋아요"
                : "좋아요"
          }
          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 font-display text-[12px] font-medium transition-colors ${
            memo.liked_by_viewer
              ? "border-[#6366f1] bg-[#6366f1]/10 text-[#6366f1]"
              : "border-mist bg-paper text-smoke hover:border-carbon"
          } ${resolvedAnon ? "cursor-default opacity-80" : ""}`}
        >
          👍 {memo.like_count}
        </button>
      </div>

      <p className="mt-3 whitespace-pre-wrap font-display text-body-sm leading-relaxed text-ink">
        {memo.content}
      </p>

      <div className="mt-3 font-display text-[12px] font-medium text-smoke">
        💬 댓글 {memo.comments.length}
      </div>

      <div className="mt-3 space-y-3 rounded-[var(--radius-buttons)] bg-surface px-3 py-3">
        {memo.comments.length === 0 ? (
          <p className="font-display text-[12px] text-fog">
            아직 댓글이 없어요.
          </p>
        ) : (
          memo.comments.map((comment) => (
            <div key={comment.id}>
              <p className="font-display text-[12px] font-semibold text-ink">
                {comment.author.nickname}
                <span className="ml-2 font-normal text-fog">
                  {formatMemoDate(comment.created_at)}
                </span>
              </p>
              <p className="mt-1 whitespace-pre-wrap font-display text-[12px] leading-relaxed text-smoke">
                {comment.content}
              </p>
            </div>
          ))
        )}

        {viewer.userId || viewer.pending ? (
          <div className="space-y-2 border-t border-mist/60 pt-3">
            <Textarea
              id={`memo-comment-${memo.id}`}
              label="댓글"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={2}
              placeholder="댓글을 남겨보세요"
              disabled={viewer.pending}
            />
            <div className="flex justify-end">
              <PrimaryButton
                size="sm"
                onClick={submitComment}
                disabled={viewer.pending || busy || !commentText.trim()}
              >
                댓글 등록
              </PrimaryButton>
            </div>
          </div>
        ) : (
          <LoginHint href={loginHref} action="댓글을 남기려면" />
        )}
      </div>

      {resolvedAnon && memo.like_count === 0 && memo.comments.length === 0 && (
        <div className="mt-2">
          <LoginHint href={loginHref} action="좋아요·댓글은" />
        </div>
      )}
    </article>
  );
}

export function QuestionMemoPanel({
  subject,
  year,
  questionNo,
  userId,
  initialMemos,
  loginNext,
}: {
  subject: string;
  year: number;
  questionNo: number;
  /**
   * 주어지면(문자열·null) 그대로 믿는다 — 서버가 방문자를 아는 동적 페이지용.
   * 생략하면 스스로 /api/me 로 해결한다 — 정적(ISR) 문항 페이지용.
   */
  userId?: string | null;
  initialMemos: PublicQuestionMemo[];
  /** 로그인 후 돌아올 경로. 없으면 공인중개사 /exam/... 경로 */
  loginNext?: string;
}) {
  const selfResolve = userId === undefined;
  const me = useMe();
  const viewer: Viewer = selfResolve
    ? { pending: me.pending, userId: me.pending ? null : (me.user?.id ?? null) }
    : { pending: false, userId };
  const [memos, setMemos] = useState<PublicQuestionMemo[]>(initialMemos);
  // 이전·다음 문항으로 소프트 내비게이션하면 이 컴포넌트 인스턴스가 재사용된다 —
  // 목록을 상태로 들고 있으므로, 문항이 바뀌면 새 문항의 초기 목록으로 되돌린다.
  const identity = `${subject}:${year}:${questionNo}`;
  const [prevIdentity, setPrevIdentity] = useState(identity);
  if (prevIdentity !== identity) {
    setPrevIdentity(identity);
    setMemos(initialMemos);
  }
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const loginHref = `/login?next=${encodeURIComponent(
    loginNext ?? `/exam/${subject}/${year}/${questionNo}`,
  )}`;

  /**
   * 등록·좋아요·댓글 뒤의 새로고침. 예전에는 router.refresh() 였는데, 페이지가
   * 정적(ISR)이 되면서 refresh 는 서버 캐시를 무효화하지 못해 방금 쓴 것이
   * 안 보이게 됐다 — 개인화 GET 으로 목록을 통째로 다시 받아 갈아끼운다.
   */
  const reload = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/exam/my-memos?subject=${encodeURIComponent(subject)}&year=${year}&no=${questionNo}`,
        { cache: "no-store" },
      );
      if (!res.ok) return;
      const data = (await res.json()) as { memos: PublicQuestionMemo[] | null };
      if (data.memos) setMemos(data.memos);
    } catch {
      /* 실패하면 지금 목록이 그대로 남는다 — 다음 조작에서 다시 시도된다 */
    }
  }, [subject, year, questionNo]);

  // 정적 HTML 의 목록에는 「내가 좋아요한 것」이 없고(서버가 방문자를 모른다)
  // ISR 스냅숏 이후 등록분도 빠져 있다 — 로그인 사용자는 개인화 목록으로
  // 한 번 덧입힌다. 동적 페이지(userId 프롭이 온 경우)는 이미 개인화돼 있다.
  useEffect(() => {
    if (selfResolve && viewer.userId) void reload();
  }, [selfResolve, viewer.userId, reload]);

  const handlePost = async () => {
    const trimmed = content.trim();
    if (!viewer.userId || !trimmed || saving || !isSupabaseConfigured()) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("question_public_memos").insert({
      user_id: viewer.userId,
      subject,
      year,
      question_no: questionNo,
      content: trimmed,
    });
    if (!error) {
      setContent("");
      // 새 메모는 다른 방문자에게도 바로 보여야 한다 — 정적 캐시를 비운다.
      requestRevalidate();
      await reload();
    }
    setSaving(false);
  };

  return (
    <div className="mt-4 rounded-[var(--radius-cards)] border border-carbon bg-paper px-5 py-4">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-body font-semibold text-ink">
          나만의 메모
        </h2>
        <p className="min-w-0 font-display text-[12px] text-fog">
          누구나 볼 수 있어요 · 암기 팁을 함께 쌓아보세요
        </p>
      </div>

      {viewer.userId || viewer.pending ? (
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <Textarea
              id={`public-memo-${subject}-${year}-${questionNo}`}
              label="공개 메모 내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
              placeholder="메모를 남겨보세요 (헷갈린 포인트, 암기 팁 등)"
              className="!py-2.5 text-body-sm"
              disabled={viewer.pending}
            />
          </div>
          <PrimaryButton
            size="sm"
            onClick={handlePost}
            disabled={viewer.pending || saving || !content.trim()}
            className="shrink-0 self-end"
          >
            {saving ? "등록 중..." : "등록"}
          </PrimaryButton>
        </div>
      ) : (
        <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-display text-body-sm text-smoke">
          <span>메모는 무료예요. 로그인만 하면 남길 수 있어요.</span>
          <Link
            href={loginHref}
            className="font-medium text-[#6366f1] hover:underline"
          >
            무료로 로그인
          </Link>
        </div>
      )}

      {memos.length === 0 ? (
        <p className="py-4 text-center font-display text-body-sm text-fog">
          아직 남긴 메모가 없어요.
        </p>
      ) : (
        <div>
          {memos.map((memo) => (
            <MemoCard
              key={memo.id}
              memo={memo}
              viewer={viewer}
              loginHref={loginHref}
              onChanged={() => {
                // 좋아요·댓글은 다른 방문자에게도 바로 보여야 한다 — 캐시를 비운다.
                // reload 자체에는 넣지 않는다: 로그인 진입 때의 개인화 덧입힘도
                // reload 를 타므로, 거기 두면 읽기만 해도 캐시를 비우게 된다.
                requestRevalidate();
                void reload();
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
