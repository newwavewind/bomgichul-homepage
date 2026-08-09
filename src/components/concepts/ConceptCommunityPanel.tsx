"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Textarea } from "@/components/ui/Input";
import { PrimaryButton, OutlineButton } from "@/components/ui/Button";
import { ConceptCommunityEditor } from "@/components/concepts/ConceptCommunityEditor";
import type { ConceptCommunityPost } from "@/types/database";
import { formatKstDateTimeShort } from "@/lib/datetime";
import { sanitizeConceptCommunityHtml } from "@/lib/concept-community-html";
import { OceanRankBadge } from "@/components/ranks/OceanRankBadge";
import type { OceanRank } from "@/lib/ocean-ranks";

function formatDate(iso: string): string {
  return formatKstDateTimeShort(iso);
}

function CommunityLoginModal({
  open,
  loginHref,
  onClose,
}: {
  open: boolean;
  loginHref: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="hp-cx-login-modal" role="presentation">
      <button
        type="button"
        className="hp-cx-login-modal__backdrop"
        aria-label="닫기"
        onClick={onClose}
      />
      <div
        className="hp-cx-login-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hp-cx-community-login-title"
        aria-describedby="hp-cx-community-login-desc"
      >
        <h3 id="hp-cx-community-login-title" className="hp-cx-login-modal__title">
          로그인이 필요해요
        </h3>
        <p id="hp-cx-community-login-desc" className="hp-cx-login-modal__desc">
          글 열람은 누구나 가능합니다.
          <br />
          글을 등록하려면 로그인해 주세요.
        </p>
        <div className="hp-cx-login-modal__actions">
          <OutlineButton onClick={onClose}>닫기</OutlineButton>
          <PrimaryButton href={loginHref}>로그인</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function LoginHint({ href, action }: { href: string; action: string }) {
  return (
    <p className="font-display text-[12px] text-fog">
      {action}{" "}
      <Link href={href} className="font-medium text-[#0f766e] hover:underline">
        로그인
      </Link>
    </p>
  );
}

function CommunityPostCard({
  post,
  userId,
  loginHref,
  authorRanks,
  onChanged,
}: {
  post: ConceptCommunityPost;
  userId: string | null;
  loginHref: string;
  authorRanks: Record<string, OceanRank>;
  onChanged: () => void;
}) {
  const authorRank = authorRanks[post.user_id];

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [busy, setBusy] = useState(false);
  const [viewCount, setViewCount] = useState(post.view_count);
  const viewedRef = useRef(false);

  useEffect(() => {
    setViewCount(post.view_count);
  }, [post.view_count, post.id]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const key = `cx-community-view:${post.id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      if (viewedRef.current) return;
    }
    viewedRef.current = true;
    const supabase = createClient();
    void supabase
      .rpc("increment_concept_community_post_view", { p_post_id: post.id })
      .then(({ error }) => {
        if (!error) setViewCount((n) => n + 1);
      });
  }, [post.id]);

  const toggleLike = async () => {
    if (!userId || !isSupabaseConfigured() || busy) return;
    setBusy(true);
    const supabase = createClient();
    if (post.liked_by_viewer) {
      await supabase
        .from("concept_community_post_likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", userId);
    } else {
      await supabase.from("concept_community_post_likes").insert({
        post_id: post.id,
        user_id: userId,
      });
    }
    setBusy(false);
    onChanged();
  };

  const toggleRecommend = async () => {
    if (!userId || !isSupabaseConfigured() || busy) return;
    setBusy(true);
    const supabase = createClient();
    if (post.recommended_by_viewer) {
      await supabase
        .from("concept_community_post_recommends")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", userId);
    } else {
      await supabase.from("concept_community_post_recommends").insert({
        post_id: post.id,
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
    await supabase.from("concept_community_post_comments").insert({
      post_id: post.id,
      user_id: userId,
      content: trimmed,
    });
    setCommentText("");
    setShowComments(true);
    setBusy(false);
    onChanged();
  };

  const deleteOwn = async () => {
    if (!userId || userId !== post.user_id || !isSupabaseConfigured() || busy) return;
    if (!window.confirm("이 글을 삭제할까요?")) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.from("concept_community_posts").delete().eq("id", post.id);
    setBusy(false);
    onChanged();
  };

  return (
    <article className="hp-cx-community-post">
      <div className="hp-cx-community-post__head">
        <div className="min-w-0 flex-1">
          <p className="hp-cx-community-post__author">
            <span className="hp-cx-community-post__author-name">
              {post.author.nickname}
            </span>
            {authorRank ? <OceanRankBadge rank={authorRank} /> : null}
          </p>
          <p className="hp-cx-community-post__meta">
            {formatDate(post.created_at)} · 조회 {viewCount}
          </p>
        </div>
        {userId === post.user_id ? (
          <button
            type="button"
            className="hp-cx-community-post__delete"
            onClick={deleteOwn}
            disabled={busy}
          >
            삭제
          </button>
        ) : null}
      </div>

      <div
        className="hp-cx-community-post__body"
        dangerouslySetInnerHTML={{
          __html: sanitizeConceptCommunityHtml(post.content),
        }}
      />

      <div className="hp-cx-community-post__actions">
        <button
          type="button"
          onClick={() => (userId ? toggleLike() : undefined)}
          disabled={busy}
          title={userId ? (post.liked_by_viewer ? "좋아요 취소" : "좋아요") : "로그인 후 좋아요"}
          className={`hp-cx-community-chip${post.liked_by_viewer ? " is-active" : ""}${
            !userId ? " is-disabled" : ""
          }`}
        >
          좋아요 {post.like_count}
        </button>
        <button
          type="button"
          onClick={() => (userId ? toggleRecommend() : undefined)}
          disabled={busy}
          title={
            userId
              ? post.recommended_by_viewer
                ? "추천 취소"
                : "추천"
              : "로그인 후 추천"
          }
          className={`hp-cx-community-chip${post.recommended_by_viewer ? " is-active" : ""}${
            !userId ? " is-disabled" : ""
          }`}
        >
          추천 {post.recommend_count}
        </button>
        <button
          type="button"
          className="hp-cx-community-chip"
          onClick={() => setShowComments((v) => !v)}
        >
          댓글 {post.comments.length > 0 ? post.comments.length : ""}{" "}
          {showComments ? "접기" : "보기"}
        </button>
      </div>

      {showComments ? (
        <div className="hp-cx-community-comments">
          {post.comments.length === 0 ? (
            <p className="hp-cx-community-empty">아직 댓글이 없어요.</p>
          ) : (
            post.comments.map((comment) => {
              const commentRank = authorRanks[comment.user_id];
              return (
                <div key={comment.id} className="hp-cx-community-comment">
                  <p className="hp-cx-community-comment__author">
                    <span className="hp-cx-community-comment__author-line">
                      <span className="hp-cx-community-comment__author-name">
                        {comment.author.nickname}
                      </span>
                      {commentRank ? <OceanRankBadge rank={commentRank} /> : null}
                    </span>
                    <span className="hp-cx-community-comment__date">
                      {formatDate(comment.created_at)}
                    </span>
                  </p>
                  <p className="hp-cx-community-comment__body">{comment.content}</p>
                </div>
              );
            })
          )}

          {userId ? (
            <div className="hp-cx-community-comment-form">
              <Textarea
                id={`concept-community-comment-${post.id}`}
                label="댓글"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={2}
                placeholder="댓글을 남겨보세요"
              />
              <div className="mt-2 flex justify-end">
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
      ) : null}

      {!userId && post.like_count === 0 && post.recommend_count === 0 && post.comments.length === 0 ? (
        <div className="mt-2">
          <LoginHint href={loginHref} action="좋아요·추천·댓글은" />
        </div>
      ) : null}
    </article>
  );
}

export function ConceptCommunityPanel({
  subject,
  conceptSlug,
  sectionIndex,
  userId,
  initialPosts,
  authorRanks,
  returnTo,
}: {
  subject: string;
  conceptSlug: string;
  sectionIndex: number;
  userId: string | null;
  initialPosts: ConceptCommunityPost[];
  authorRanks: Record<string, OceanRank>;
  returnTo: string;
}) {
  const router = useRouter();
  const [contentHtml, setContentHtml] = useState("");
  const [contentPlain, setContentPlain] = useState("");
  const [saving, setSaving] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [status, setStatus] = useState<{ tone: "ok" | "err"; text: string } | null>(
    null
  );
  const loginHref = `/login?next=${encodeURIComponent(returnTo)}`;

  const handlePost = async () => {
    const plain = contentPlain.trim();
    const html = sanitizeConceptCommunityHtml(contentHtml).trim();
    if ((!plain && !html.includes("<img")) || saving) return;

    if (!userId) {
      setLoginOpen(true);
      return;
    }

    if (!isSupabaseConfigured()) return;
    setSaving(true);
    setStatus(null);
    const supabase = createClient();
    const { error } = await supabase.from("concept_community_posts").insert({
      user_id: userId,
      subject,
      concept_slug: conceptSlug,
      content: html || plain,
    });
    if (error) {
      setStatus({
        tone: "err",
        text: "등록에 실패했어요. 잠시 후 다시 시도해 주세요.",
      });
    } else {
      setContentHtml("");
      setContentPlain("");
      setResetToken((n) => n + 1);
      setStatus({
        tone: "ok",
        text: "등록됐어요. 바다 레벨 +3점이 반영됩니다.",
      });
      router.refresh();
    }
    setSaving(false);
  };

  return (
    <article className="hp-cx-card">
      <section className="hp-cx-section">
        <div className="hp-cx-questions-head">
          <h2 className="hp-cx-section__label">
            <span className="hp-cx-section__index" aria-hidden>
              {String(sectionIndex).padStart(2, "0")}
            </span>
            <span>모두의 개념</span>
          </h2>
          <span className="hp-cx-questions-count">{initialPosts.length}개</span>
        </div>
        <div className="hp-cx-section__body">
          <div className="hp-cx-community-compose">
            <ConceptCommunityEditor
              userId={userId}
              resetToken={resetToken}
              onRequireLogin={() => setLoginOpen(true)}
              onHtmlChange={(html, plain) => {
                setContentHtml(html);
                setContentPlain(plain);
              }}
            />
            <div className="mt-3 flex items-center justify-end gap-3">
              {status ? (
                <p
                  className={`font-display text-[12px] ${
                    status.tone === "ok" ? "text-[#0f766e]" : "text-burnt"
                  }`}
                  role="status"
                >
                  {status.text}
                </p>
              ) : null}
              <PrimaryButton
                size="sm"
                onClick={handlePost}
                disabled={saving || (!contentPlain.trim() && !contentHtml.includes("<img"))}
              >
                {saving ? "등록 중..." : "등록"}
              </PrimaryButton>
            </div>
          </div>

          {initialPosts.length > 0 ? (
            <div className="hp-cx-community-list">
              {initialPosts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  post={post}
                  userId={userId}
                  loginHref={loginHref}
                  authorRanks={authorRanks}
                  onChanged={() => router.refresh()}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <CommunityLoginModal
        open={loginOpen}
        loginHref={loginHref}
        onClose={() => setLoginOpen(false)}
      />
    </article>
  );
}
