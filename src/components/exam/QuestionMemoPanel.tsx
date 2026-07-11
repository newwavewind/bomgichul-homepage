"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Textarea } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/Button";
import type { ExamSubject } from "@/lib/exam-questions";
import type { PublicQuestionMemo } from "@/types/database";
import { formatKstDateTimeShort } from "@/lib/datetime";

function formatMemoDate(iso: string): string {
  return formatKstDateTimeShort(iso);
}

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
  userId,
  loginHref,
  onChanged,
}: {
  memo: PublicQuestionMemo;
  userId: string | null;
  loginHref: string;
  onChanged: () => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [busy, setBusy] = useState(false);

  const toggleLike = async () => {
    if (!userId) return;
    if (!isSupabaseConfigured() || busy) return;
    setBusy(true);
    const supabase = createClient();
    if (memo.liked_by_viewer) {
      await supabase
        .from("question_public_memo_likes")
        .delete()
        .eq("memo_id", memo.id)
        .eq("user_id", userId);
    } else {
      await supabase.from("question_public_memo_likes").insert({
        memo_id: memo.id,
        user_id: userId,
      });
    }
    setBusy(false);
    onChanged();
  };

  const submitComment = async () => {
    const trimmed = commentText.trim();
    if (!userId || !trimmed || !isSupabaseConfigured() || busy) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.from("question_public_memo_comments").insert({
      memo_id: memo.id,
      user_id: userId,
      content: trimmed,
    });
    setCommentText("");
    setShowComments(true);
    setBusy(false);
    onChanged();
  };

  return (
    <article className="border-b border-mist/60 py-4 last:border-b-0">
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
          onClick={() => (userId ? toggleLike() : undefined)}
          disabled={busy}
          title={userId ? (memo.liked_by_viewer ? "좋아요 취소" : "좋아요") : "로그인 후 좋아요"}
          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 font-display text-[12px] font-medium transition-colors ${
            memo.liked_by_viewer
              ? "border-[#6366f1] bg-[#6366f1]/10 text-[#6366f1]"
              : "border-mist bg-paper text-smoke hover:border-carbon"
          } ${!userId ? "cursor-default opacity-80" : ""}`}
        >
          👍 {memo.like_count}
        </button>
      </div>

      <p className="mt-3 whitespace-pre-wrap font-display text-body-sm leading-relaxed text-ink">
        {memo.content}
      </p>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setShowComments((v) => !v)}
          className="font-display text-[12px] font-medium text-smoke hover:text-ink"
        >
          💬 댓글 {memo.comments.length > 0 ? memo.comments.length : ""}{" "}
          {showComments ? "접기" : "보기"}
        </button>
      </div>

      {showComments && (
        <div className="mt-3 space-y-3 rounded-[var(--radius-buttons)] bg-surface px-3 py-3">
          {memo.comments.length === 0 ? (
            <p className="font-display text-[12px] text-fog">아직 댓글이 없어요.</p>
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

          {userId ? (
            <div className="space-y-2 border-t border-mist/60 pt-3">
              <Textarea
                id={`memo-comment-${memo.id}`}
                label="댓글"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={2}
                placeholder="댓글을 남겨보세요"
              />
              <div className="flex justify-end">
                <PrimaryButton
                  size="sm"
                  onClick={submitComment}
                  disabled={busy || !commentText.trim()}
                >
                  댓글 등록
                </PrimaryButton>
              </div>
            </div>
          ) : (
            <LoginHint href={loginHref} action="댓글을 남기려면" />
          )}
        </div>
      )}

      {!userId && memo.like_count === 0 && memo.comments.length === 0 && (
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
}: {
  subject: ExamSubject;
  year: number;
  questionNo: number;
  userId: string | null;
  initialMemos: PublicQuestionMemo[];
}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const loginHref = `/login?next=/exam/${subject}/${year}/${questionNo}`;

  const handlePost = async () => {
    const trimmed = content.trim();
    if (!userId || !trimmed || saving || !isSupabaseConfigured()) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("question_public_memos").insert({
      user_id: userId,
      subject,
      year,
      question_no: questionNo,
      content: trimmed,
    });
    if (!error) {
      setContent("");
      router.refresh();
    }
    setSaving(false);
  };

  return (
    <div className="mt-4 rounded-[var(--radius-cards)] border border-carbon bg-paper px-5 py-4">
      <div className="mb-4">
        <h2 className="font-display text-body font-semibold text-ink">나만의 메모</h2>
        <p className="mt-1 font-display text-body-sm text-smoke">
          이 문제에 남긴 메모는 누구나 볼 수 있어요. 헷갈린 포인트·암기 팁을 함께 쌓아보세요.
        </p>
      </div>

      {userId ? (
        <div className="mb-5 rounded-[var(--radius-buttons)] border border-mist bg-surface px-4 py-4">
          <Textarea
            id={`public-memo-${subject}-${year}-${questionNo}`}
            label="메모 남기기"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="이 문제에 대한 메모를 남겨보세요 (헷갈렸던 포인트, 암기 팁 등)"
          />
          <div className="mt-3 flex justify-end">
            <PrimaryButton size="sm" onClick={handlePost} disabled={saving || !content.trim()}>
              {saving ? "등록 중..." : "메모 등록"}
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <div className="mb-5 rounded-[var(--radius-buttons)] border border-dashed border-mist bg-surface px-4 py-4 text-center">
          <p className="font-display text-body-sm text-smoke">
            로그인하면 메모를 남길 수 있어요. 메모 목록은 로그인 없이 볼 수 있습니다.
          </p>
          <div className="mt-3">
            <Link
              href={loginHref}
              className="font-display text-body-sm font-medium text-[#6366f1] hover:underline"
            >
              로그인하기
            </Link>
          </div>
        </div>
      )}

      {initialMemos.length === 0 ? (
        <p className="py-6 text-center font-display text-body-sm text-fog">
          아직 남긴 메모가 없어요. 첫 메모를 남겨보세요.
        </p>
      ) : (
        <div>
          {initialMemos.map((memo) => (
            <MemoCard
              key={memo.id}
              memo={memo}
              userId={userId}
              loginHref={loginHref}
              onChanged={() => router.refresh()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
