"use client";

import { QuestionMemoComposer } from "@/components/exam/QuestionMemoComposer";
import { parseDiscussion, formatDiscussion } from "@/lib/question-discussion";
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
type Viewer = { pending: boolean; userId: string | null; isAdmin?: boolean };

function LoginHint({ href, action }: { href: string; action: string }) {
  return (
    <p className="font-display text-[12px] text-fog">
      {action}{" "}
      <Link href={href} className="font-medium text-[color:light-dark(#6366f1,var(--color-carbon))] hover:underline dark:text-iris">
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
  const [reviewTarget, setReviewTarget] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [busy, setBusy] = useState(false);
  const discussion = parseDiscussion(memo.content);
  const [actionError, setActionError] = useState("");
  const resolveQuestion = async (acceptedId?: string) => {
    if (viewer.userId !== memo.user_id || busy) return;
    setBusy(true);
    const { error } = await createClient().from("question_public_memos").update({content:formatDiscussion(discussion.text, !discussion.resolved || Boolean(acceptedId), acceptedId)}).eq("id",memo.id).eq("user_id",viewer.userId);
    setBusy(false);
    setActionError(error ? "질문 상태를 저장하지 못했습니다." : "");
    if (!error) onChanged();
  };
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
    const {error} = await supabase.from("question_public_memo_comments").insert({
      memo_id: memo.id,
      user_id: viewer.userId,
      content: reviewTarget && viewer.isAdmin ? `[검수 확인:${reviewTarget}]\n${trimmed}` : trimmed,
    });
    if(error){setActionError("답변을 등록하지 못했습니다. 다시 시도해 주세요.");setBusy(false);return;}
    setActionError("");
    setReviewTarget(null);
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
              ? "border-[#6366f1] bg-[#6366f1]/10 text-[color:light-dark(#6366f1,var(--color-carbon))]"
              : "border-mist bg-paper text-smoke hover:border-carbon"
          } ${resolvedAnon ? "cursor-default opacity-80" : ""}`}
        >
          👍 {memo.like_count}
        </button>
      </div>

      {discussion.question && <div className="web-actions"><strong>{discussion.resolved ? "해결됨 · 작성자 확인" : "질문 · 미해결"}</strong>{viewer.userId === memo.user_id && <button disabled={busy} onClick={() => resolveQuestion()}>{discussion.resolved ? "다시 질문 열기" : "해결됨으로 표시"}</button>}</div>}
      {actionError && <p role="alert">{actionError}</p>}
      <p className="mt-3 whitespace-pre-wrap font-display text-body-sm leading-relaxed text-ink">
        {discussion.text}
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
              {memo.comments.some(c=>c.verifiedByStaff && c.content.startsWith(`[검수 확인:${comment.id}]\n`)) && <strong className="block text-sm">운영자 검수 확인</strong>}
              {viewer.isAdmin && !comment.verifiedByStaff && <button className="text-sm underline" onClick={()=>{setReviewTarget(comment.id);setCommentText("");}}>이 답변 검수 의견 작성</button>}
              {discussion.acceptedId === comment.id && <strong className="text-sm">질문자가 채택한 답변</strong>}
              {discussion.question && viewer.userId === memo.user_id && discussion.acceptedId !== comment.id && <button className="text-sm underline" disabled={busy} onClick={() => resolveQuestion(comment.id)}>이 답변 채택</button>}
              <p className="mt-1 whitespace-pre-wrap font-display text-[12px] leading-relaxed text-smoke">
                {comment.verifiedByStaff ? comment.content.replace(/^\[검수 확인:[a-zA-Z0-9-]+\]\n/, "검수 의견: ") : comment.content}
              </p>
            </div>
          ))
        )}

        {viewer.userId || viewer.pending ? (
          <div className="space-y-2 border-t border-mist/60 pt-3">
            <Textarea
              id={`memo-comment-${memo.id}`}
              label={reviewTarget ? "운영자 검수 의견 (공개)" : "답변·댓글"}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={2}
              placeholder="댓글을 남겨보세요"
              disabled={viewer.pending}
            />
            <div className="flex justify-end">
              {reviewTarget && <button onClick={()=>setReviewTarget(null)}>검수 취소</button>}
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

async function fetchQuestionMemos(subject: string, year: number, questionNo: number, signal?: AbortSignal) {
  try {
    const response = await fetch(
      `/api/exam/my-memos?subject=${encodeURIComponent(subject)}&year=${year}&no=${questionNo}`,
      { cache: "no-store", signal },
    );
    if (!response.ok) return null;
    const { memos } = (await response.json()) as { memos: PublicQuestionMemo[] | null };
    return memos;
  } catch {
    return null;
  }
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
    ? { pending: me.pending, userId: me.pending ? null : (me.user?.id ?? null), isAdmin: me.user?.isAdmin }
    : { pending: false, userId, isAdmin: me.user?.id === userId && me.user?.isAdmin };
  const [memos, setMemos] = useState<PublicQuestionMemo[]>(initialMemos);
  // 이전·다음 문항으로 소프트 내비게이션하면 이 컴포넌트 인스턴스가 재사용된다 —
  // 목록을 상태로 들고 있으므로, 문항이 바뀌면 새 문항의 초기 목록으로 되돌린다.
  const identity = `${subject}:${year}:${questionNo}`;
  const [prevIdentity, setPrevIdentity] = useState(identity);
  if (prevIdentity !== identity) {
    setPrevIdentity(identity);
    setMemos(initialMemos);
  }
  const returnTo = loginNext ?? `/exam/${subject}/${year}/${questionNo}`;
  const loginHref = `/login?next=${encodeURIComponent(returnTo)}`;

  /**
   * 등록·좋아요·댓글 뒤의 새로고침. 예전에는 router.refresh() 였는데, 페이지가
   * 정적(ISR)이 되면서 refresh 는 서버 캐시를 무효화하지 못해 방금 쓴 것이
   * 안 보이게 됐다 — 개인화 GET 으로 목록을 통째로 다시 받아 갈아끼운다.
   */
  const reload = useCallback(async () => {
    const nextMemos = await fetchQuestionMemos(subject, year, questionNo);
    if (nextMemos) setMemos(nextMemos);
  }, [subject, year, questionNo]);

  // 정적 문항에 로그인 사용자의 최신 메모와 좋아요 상태를 덧입힌다.
  useEffect(() => {
    if (!selfResolve || !viewer.userId) return;
    const controller = new AbortController();
    void fetchQuestionMemos(subject, year, questionNo, controller.signal).then((nextMemos) => {
      if (nextMemos && !controller.signal.aborted) setMemos(nextMemos);
    });
    return () => controller.abort();
  }, [selfResolve, viewer.userId, subject, year, questionNo]);

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
    requestRevalidate();
    void reload();
    return true;
  };

  return (
    <div className="rounded-[var(--radius-cards)] border border-carbon bg-paper px-5 py-4">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-body font-semibold text-ink">
          이 문제에 대한 이야기
        </h2>
        <p className="min-w-0 font-display text-[12px] text-fog">
          공개 글은 누구나 보고, 비공개 메모는 본인만 볼 수 있어요.
        </p>
      </div>

      {viewer.userId || viewer.pending ? (
        <QuestionMemoComposer
          key={`${identity}:${viewer.userId}`}
          subject={subject}
          year={year}
          questionNo={questionNo}
          userId={viewer.userId}
          loginNext={returnTo}
          postPublic={handlePost}
        />
      ) : (
        <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-display text-body-sm text-smoke">
          <span>로그인하면 이 문제에 대해 자유롭게 글을 남길 수 있어요.</span>
          <Link
            href={loginHref}
            className="font-medium text-[color:light-dark(#6366f1,var(--color-carbon))] hover:underline dark:text-iris"
          >
            로그인
          </Link>
        </div>
      )}

      {memos.length === 0 ? (
        <p className="py-4 text-center font-display text-body-sm text-fog">
          아직 공개 글이 없어요.
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
