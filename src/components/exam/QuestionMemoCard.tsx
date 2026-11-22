"use client";

import Link from "next/link";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { PrimaryButton } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { formatKstDateTimeShort } from "@/lib/datetime";
import { formatDiscussion, parseDiscussion } from "@/lib/question-discussion";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { PublicMemoComment, PublicQuestionMemo } from "@/types/database";

export type MemoViewer = { pending: boolean; userId: string | null; isAdmin?: boolean };

const actionClass = "inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-body-sm text-smoke transition-colors hover:bg-snow hover:text-ink focus-visible:outline-2 focus-visible:outline-ios-blue disabled:opacity-50";
const menuItemClass = "block w-full rounded-md px-3 py-2 text-left text-body-sm hover:bg-snow focus-visible:outline-2 focus-visible:outline-ios-blue disabled:opacity-50";
const staffPrefix = /^\[검수 확인:([a-zA-Z0-9-]+)\]\n/;

const icons = {
  heart: "M20.8 4.6a5.2 5.2 0 0 0-7.4 0L12 6l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4l1.4 1.4L12 21l7.4-7.6 1.4-1.4a5.2 5.2 0 0 0 0-7.4Z",
  comment: "M20 11.5a7.7 7.7 0 0 1-8 7.5 8.7 8.7 0 0 1-3-.5L5 20l.8-3A7.3 7.3 0 0 1 4 11.5 7.8 7.8 0 0 1 12 4a7.8 7.8 0 0 1 8 7.5Z",
  link: "M10 7l2-2a4 4 0 0 1 6 6l-2 2m-2 4-2 2a4 4 0 0 1-6-6l2-2m1 4 6-6",
};

function MemoIcon({ name, filled }: { name: keyof typeof icons; filled?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} className="size-4 shrink-0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={icons[name]} />
    </svg>
  );
}

function MemoIdentity({ nickname, createdAt, avatar = true }: { nickname: string; createdAt: string; avatar?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      {avatar && (
        <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-teal-500/15 text-body-sm font-bold text-[color:light-dark(#14685e,#92ebd9)]">
          {Array.from(nickname.trim())[0] || "?"}
        </span>
      )}
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
        <span className="break-all font-display text-body-sm font-semibold text-ink">{nickname}</span>
        <time dateTime={createdAt} className="text-reading-note text-fog">{formatKstDateTimeShort(createdAt)}</time>
      </div>
    </div>
  );
}

function MemoActions({ label, busy, onEdit, onDelete }: { label: string; busy: boolean; onEdit: () => void; onDelete: () => void }) {
  return (
    <details className="relative shrink-0">
      <summary aria-label={`${label} 관리`} className="grid size-9 cursor-pointer list-none place-items-center rounded-lg border border-mist bg-paper text-smoke hover:bg-snow focus-visible:outline-2 focus-visible:outline-ios-blue [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true">···</span>
      </summary>
      <div className="absolute right-0 z-10 mt-1 w-24 rounded-lg border border-mist bg-paper p-1 shadow-md">
        <button type="button" className={menuItemClass} disabled={busy} onClick={(event) => {
          event.currentTarget.closest("details")?.removeAttribute("open");
          onEdit();
        }}>수정</button>
        <button type="button" className={`${menuItemClass} text-[color:light-dark(#b91c3c,#fda4af)]`} disabled={busy} onClick={(event) => {
          event.currentTarget.closest("details")?.removeAttribute("open");
          onDelete();
        }}>삭제</button>
      </div>
    </details>
  );
}

function MemoDraft({ label, value, onChange, onSubmit, onCancel, submitLabel, rows = 3, busy }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (text: string) => void;
  onCancel: () => void;
  submitLabel: string;
  rows?: number;
  busy: boolean;
}) {
  const id = useId();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = value.trim();
    if (text && !busy) onSubmit(text);
  };

  return (
    <form className="space-y-3 rounded-xl border border-mist bg-paper p-3 sm:p-4" onSubmit={submit}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="font-display text-body-sm font-semibold text-ink">{label}</label>
        <button type="button" className={actionClass} onClick={onCancel} disabled={busy}>닫기</button>
      </div>
      <Textarea id={id} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} placeholder="내용을 입력해 주세요." disabled={busy} autoFocus />
      <div className="flex justify-end">
        <PrimaryButton type="submit" size="sm" disabled={busy || !value.trim()}>{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}

export function QuestionMemoCard({ memo, viewer, loginHref, onChanged }: {
  memo: PublicQuestionMemo;
  viewer: MemoViewer;
  loginHref: string;
  onChanged: () => Promise<void>;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [edit, setEdit] = useState<{ id: string; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const discussion = parseDiscussion(memo.content);
  const userId = viewer.userId;
  const isAuthor = userId === memo.user_id;
  const authorCanLike = !isAuthor || memo.liked_by_viewer;
  const canInteract = !viewer.pending && !busy;
  const repliesId = `memo-replies-${memo.id}`;

  async function mutate(failure: string, write: () => Promise<void>, afterWrite?: () => void) {
    if (!userId || !canInteract || !isSupabaseConfigured()) return;
    setBusy(true);
    setError("");
    try {
      await write();
      afterWrite?.();
      await onChanged();
    } catch {
      setError(failure);
    } finally {
      setBusy(false);
    }
  }

  function toggleLike() {
    if (!userId || !authorCanLike) return;
    void mutate("좋아요를 저장하지 못했어요. 다시 시도해 주세요.", async () => {
      const likes = createClient().from("question_public_memo_likes");
      const { error } = memo.liked_by_viewer
        ? await likes.delete().eq("memo_id", memo.id).eq("user_id", userId)
        : await likes.insert({ memo_id: memo.id, user_id: userId });
      if (error && (memo.liked_by_viewer || error.code !== "23505")) throw error;
    });
  }

  function updatePost(content: string, afterWrite?: () => void) {
    if (!isAuthor) return;
    void mutate("글을 수정하지 못했어요. 다시 시도해 주세요.", async () => {
      const { error } = await createClient().from("question_public_memos")
        .update({ content }).eq("id", memo.id).eq("user_id", memo.user_id).eq("content", memo.content)
        .select("id").single();
      if (error) throw error;
    }, afterWrite);
  }

  function resolveQuestion(acceptedId?: string) {
    updatePost(formatDiscussion(discussion.text, !discussion.resolved || Boolean(acceptedId), acceptedId));
  }

  function submitReply(content: string) {
    if (!userId) return;
    void mutate("답글을 등록하지 못했어요. 다시 시도해 주세요.", async () => {
      const { error } = await createClient().from("question_public_memo_comments").insert({
        memo_id: memo.id,
        user_id: userId,
        content: reviewTarget && viewer.isAdmin ? `[검수 확인:${reviewTarget}]\n${content}` : content,
      });
      if (error) throw error;
    }, () => {
      setReplyText("");
      setReviewTarget(null);
    });
  }

  function editReply(reply: PublicMemoComment, prefix: string, text: string) {
    if (userId !== reply.user_id) return;
    void mutate("답글을 수정하지 못했어요. 다시 시도해 주세요.", async () => {
      const { error } = await createClient().from("question_public_memo_comments")
        .update({ content: prefix + text }).eq("id", reply.id).eq("user_id", reply.user_id).eq("content", reply.content)
        .select("id").single();
      if (error) throw error;
    }, () => setEdit(null));
  }

  function remove(target: PublicQuestionMemo | PublicMemoComment, isReply: boolean) {
    if (userId !== target.user_id || !canInteract) return;
    const label = isReply ? "답글" : "글";
    if (!window.confirm(isReply ? "이 답글을 삭제할까요?" : "이 글과 달린 답글을 함께 삭제할까요?")) return;
    void mutate(`${label}을 삭제하지 못했어요. 다시 시도해 주세요.`, async () => {
      const table = isReply ? "question_public_memo_comments" : "question_public_memos";
      const { error } = await createClient().from(table).delete()
        .eq("id", target.id).eq("user_id", target.user_id).select("id").single();
      if (error) throw error;
    }, () => {
      if (edit?.id === target.id) setEdit(null);
      if (reviewTarget === target.id) setReviewTarget(null);
    });
  }

  async function copyLink() {
    try {
      const url = new URL(window.location.href);
      url.hash = `memo-${memo.id}`;
      await navigator.clipboard.writeText(url.href);
      setShareStatus("글 링크를 복사했어요.");
    } catch {
      setShareStatus("링크를 복사하지 못했어요.");
    }
  }

  function editDraft(id: string, label: string, onSubmit: (text: string) => void): ReactNode {
    if (edit?.id !== id) return null;
    return (
      <MemoDraft label={label} value={edit.text} onChange={(text) => setEdit({ id, text })} onSubmit={onSubmit}
        onCancel={() => setEdit(null)} submitLabel="수정 저장" busy={busy} />
    );
  }

  const verifiedReplies = new Set(memo.comments
    .filter((reply) => reply.verifiedByStaff)
    .flatMap((reply) => reply.content.match(staffPrefix)?.[1] ?? []));

  return (
    <article id={`memo-${memo.id}`} className="scroll-mt-24 rounded-2xl border border-mist bg-paper p-4 target:border-ios-blue">
      <div className="flex items-center justify-between gap-2">
        <MemoIdentity nickname={memo.author.nickname} createdAt={memo.created_at} />
        {isAuthor && (
          <MemoActions label="글" busy={busy} onEdit={() => { setError(""); setEdit({ id: memo.id, text: discussion.text }); }}
            onDelete={() => remove(memo, false)} />
        )}
      </div>
      <div className="mt-2 space-y-2">
        {discussion.question && (
          <div className="flex flex-wrap items-center gap-x-3 text-body-sm text-smoke">
            <strong>{discussion.resolved ? "해결됨 · 작성자 확인" : "질문 · 미해결"}</strong>
            {isAuthor && <button type="button" className={actionClass} disabled={busy} onClick={() => resolveQuestion()}>
              {discussion.resolved ? "다시 질문 열기" : "해결됨으로 표시"}
            </button>}
          </div>
        )}
        {edit?.id === memo.id
          ? editDraft(memo.id, "글 수정", (text) => updatePost(memo.content.slice(0, memo.content.length - discussion.text.length) + text, () => setEdit(null)))
          : <p className="whitespace-pre-wrap break-words font-system text-body-sm leading-relaxed text-ink">{discussion.text}</p>}
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-1">
        {userId || viewer.pending ? (
          <button type="button" aria-label={`좋아요 ${memo.like_count}개`} aria-pressed={memo.liked_by_viewer}
            title={memo.liked_by_viewer ? "좋아요 취소" : isAuthor ? "내 글에는 좋아요를 누를 수 없어요" : "좋아요"}
            disabled={!canInteract || !authorCanLike} onClick={toggleLike}
            className={`${actionClass} ${memo.liked_by_viewer ? "!text-[color:light-dark(#be2850,#fda4af)]" : ""}`}>
            <MemoIcon name="heart" filled={memo.liked_by_viewer} /> {memo.like_count}
          </button>
        ) : <Link href={loginHref} aria-label={`좋아요 ${memo.like_count}개 · 로그인`} className={actionClass}>
          <MemoIcon name="heart" /> {memo.like_count}
        </Link>}
        <button type="button" aria-expanded={replyOpen} aria-controls={replyOpen ? repliesId : undefined}
          aria-label={`답글 ${memo.comments.length}개`} onClick={() => setReplyOpen(!replyOpen)} className={actionClass}>
          <MemoIcon name="comment" /> {memo.comments.length}
        </button>
        <button type="button" aria-label="글 링크 복사" title="글 링크 복사" onClick={() => void copyLink()} className={actionClass}>
          <MemoIcon name="link" />
        </button>
        {shareStatus && <span role="status" className="text-reading-detail text-smoke">{shareStatus}</span>}
      </div>
      {error && <p role="alert" className="my-2 text-body-sm text-[color:light-dark(#b91c3c,#fda4af)]">{error}</p>}

      {replyOpen && (
        <div id={repliesId} className="mt-2 space-y-3 rounded-xl border border-mist bg-snow p-3 sm:ml-5">
          {memo.comments.map((reply) => {
            const prefix = reply.verifiedByStaff ? reply.content.match(staffPrefix)?.[0] ?? "" : "";
            const text = reply.content.slice(prefix.length);
            return (
              <div key={reply.id} className="space-y-1 border-b border-mist pb-3">
                <div className="flex items-start justify-between gap-2">
                  <MemoIdentity nickname={reply.author.nickname} createdAt={reply.created_at} avatar={false} />
                  {userId === reply.user_id && <MemoActions label="답글" busy={busy} onEdit={() => {
                    setError("");
                    setEdit({ id: reply.id, text });
                  }} onDelete={() => remove(reply, true)} />}
                </div>
                {verifiedReplies.has(reply.id) && <strong className="block text-reading-detail text-ink">운영자 검수 확인</strong>}
                {discussion.acceptedId === reply.id && <strong className="block text-reading-detail text-ink">질문자가 채택한 답변</strong>}
                {edit?.id === reply.id
                  ? editDraft(reply.id, "답글 수정", (nextText) => editReply(reply, prefix, nextText))
                  : <p className="whitespace-pre-wrap break-words font-system text-body-sm leading-relaxed text-ink">{prefix && "검수 의견: "}{text}</p>}
                {(viewer.isAdmin && !reply.verifiedByStaff) || (discussion.question && isAuthor && discussion.acceptedId !== reply.id) ? (
                  <div className="flex flex-wrap">
                    {viewer.isAdmin && !reply.verifiedByStaff && <button type="button" className={actionClass} disabled={busy}
                      onClick={() => { setReviewTarget(reply.id); setReplyText(""); }}>이 답변 검수 의견 작성</button>}
                    {discussion.question && isAuthor && discussion.acceptedId !== reply.id && <button type="button" className={actionClass}
                      disabled={busy} onClick={() => resolveQuestion(reply.id)}>이 답변 채택</button>}
                  </div>
                ) : null}
              </div>
            );
          })}
          {userId ? <MemoDraft
            label={reviewTarget ? "운영자 검수 의견 작성" : `${memo.author.nickname}님에게 답글 쓰기`}
            value={replyText} onChange={setReplyText} onSubmit={submitReply}
            onCancel={() => {
              if (reviewTarget) { setReviewTarget(null); setReplyText(""); }
              else setReplyOpen(false);
            }}
            submitLabel="답글 등록" busy={busy} rows={4} />
            : !viewer.pending && <p className="text-body-sm text-smoke">
              <Link href={loginHref} className="font-semibold text-[color:light-dark(#005dbf,#a5ceff)] hover:underline">로그인</Link>하면 답글을 남길 수 있어요.
            </p>}
        </div>
      )}
    </article>
  );
}
