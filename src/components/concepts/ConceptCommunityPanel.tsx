"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Textarea } from "@/components/ui/Input";
import { PrimaryButton, OutlineButton } from "@/components/ui/Button";
import { ConceptCommunityEditor } from "@/components/concepts/ConceptCommunityEditor";
import { fetchMe, useMe, requestRevalidate } from "@/lib/client-session";
import type { ConceptCommunityComment, ConceptCommunityPost } from "@/types/database";
import { formatKstDateTimeShort } from "@/lib/datetime";
import { sanitizeConceptCommunityHtml } from "@/lib/concept-community-html";
import { OceanRankBadge } from "@/components/ranks/OceanRankBadge";
import type { OceanRank } from "@/lib/ocean-ranks";

function formatDate(iso: string): string {
  return formatKstDateTimeShort(iso);
}

type ViewerSnippet = { nickname: string; avatar_url: string | null };

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
  loginPending,
  viewer,
  loginHref,
  authorRanks,
  onChanged,
}: {
  post: ConceptCommunityPost;
  userId: string | null;
  /** 로그인 상태를 아직 조회 중 — 비로그인용 안내를 미리 그려 깜빡이게 하지 않는다 */
  loginPending: boolean;
  /** 로컬 갱신 모드에서 새 댓글의 작성자 표시에 쓴다(서버 재렌더가 없으므로) */
  viewer: ViewerSnippet | null;
  loginHref: string;
  authorRanks: Record<string, OceanRank>;
  onChanged: (next: ConceptCommunityPost | null) => void;
}) {
  const authorRank = authorRanks[post.user_id];

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [busy, setBusy] = useState(false);
  const [viewCount, setViewCount] = useState(post.view_count);
  const viewedRef = useRef(false);

  // 조회가 끝나기 전에는 「로그인 후 이용」류를 그리지 않는다(깜빡임 방지).
  const showLoggedOutUi = !userId && !loginPending;

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
    const { error } = post.liked_by_viewer
      ? await supabase
          .from("concept_community_post_likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", userId)
      : await supabase.from("concept_community_post_likes").insert({
          post_id: post.id,
          user_id: userId,
        });
    setBusy(false);
    if (error) return;
    onChanged({
      ...post,
      liked_by_viewer: !post.liked_by_viewer,
      like_count: Math.max(0, post.like_count + (post.liked_by_viewer ? -1 : 1)),
    });
  };

  const toggleRecommend = async () => {
    if (!userId || !isSupabaseConfigured() || busy) return;
    setBusy(true);
    const supabase = createClient();
    const { error } = post.recommended_by_viewer
      ? await supabase
          .from("concept_community_post_recommends")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", userId)
      : await supabase.from("concept_community_post_recommends").insert({
          post_id: post.id,
          user_id: userId,
        });
    setBusy(false);
    if (error) return;
    onChanged({
      ...post,
      recommended_by_viewer: !post.recommended_by_viewer,
      recommend_count: Math.max(
        0,
        post.recommend_count + (post.recommended_by_viewer ? -1 : 1)
      ),
    });
  };

  const submitComment = async () => {
    const trimmed = commentText.trim();
    if (!userId || !trimmed || !isSupabaseConfigured() || busy) return;
    setBusy(true);
    const supabase = createClient();
    // 삽입한 행을 되돌려 받아 로컬 목록에 그대로 붙인다 — 정적 페이지에서는
    // router.refresh() 가 캐시된(뷰어 없는) 페이로드만 돌려주기 때문이다.
    const { data, error } = await supabase
      .from("concept_community_post_comments")
      .insert({
        post_id: post.id,
        user_id: userId,
        content: trimmed,
      })
      .select("id, created_at")
      .single();
    setBusy(false);
    if (error || !data) return;
    setCommentText("");
    setShowComments(true);
    const newComment: ConceptCommunityComment = {
      id: data.id,
      post_id: post.id,
      user_id: userId,
      content: trimmed,
      created_at: data.created_at,
      author: viewer ?? { nickname: "익명", avatar_url: null },
    };
    onChanged({ ...post, comments: [...post.comments, newComment] });
  };

  const deleteOwn = async () => {
    if (!userId || userId !== post.user_id || !isSupabaseConfigured() || busy) return;
    if (!window.confirm("이 글을 삭제할까요?")) return;
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("concept_community_posts")
      .delete()
      .eq("id", post.id);
    setBusy(false);
    if (error) return;
    onChanged(null);
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
            showLoggedOutUi ? " is-disabled" : ""
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
            showLoggedOutUi ? " is-disabled" : ""
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
          ) : showLoggedOutUi ? (
            <LoginHint href={loginHref} action="댓글을 남기려면" />
          ) : null}
        </div>
      ) : null}

      {showLoggedOutUi && post.like_count === 0 && post.recommend_count === 0 && post.comments.length === 0 ? (
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
  userId: userIdProp,
  initialPosts,
  authorRanks,
  returnTo,
}: {
  subject: string;
  conceptSlug: string;
  sectionIndex: number;
  /**
   * 트랙 페이지(동적 렌더)만 내려준다 — 그때는 예전처럼 router.refresh() 로 갱신한다.
   * 정적 개념 페이지는 생략: useMe 로 스스로 알아내고, 갱신은 로컬 상태로 한다
   * (정적 페이지의 refresh 는 캐시된 뷰어 없는 페이로드를 돌려줄 뿐이다).
   */
  userId?: string | null;
  initialPosts: ConceptCommunityPost[];
  authorRanks: Record<string, OceanRank>;
  returnTo: string;
}) {
  const router = useRouter();
  const me = useMe();
  const selfResolve = userIdProp === undefined;
  const userId = selfResolve ? (me.user?.id ?? null) : userIdProp;
  const loginPending = selfResolve && me.pending;
  const viewer: ViewerSnippet | null =
    selfResolve && me.user
      ? { nickname: me.user.nickname || "익명", avatar_url: me.user.avatar_url }
      : null;

  const [localPosts, setLocalPosts] = useState(initialPosts);
  // 다른 개념으로 옮겨도 컴포넌트가 남아 있을 수 있다 — 서버 페이로드가 바뀌면
  // 렌더 중에 바로 다시 심는다(effect 로 심으면 한 프레임 이전 글이 보인다).
  const [seededFrom, setSeededFrom] = useState(initialPosts);
  if (seededFrom !== initialPosts) {
    setSeededFrom(initialPosts);
    setLocalPosts(initialPosts);
  }
  const posts = selfResolve ? localPosts : initialPosts;

  // 좋아요·추천 이후에 도착한 「이전 시점」 personal 응답이 방금 누른 상태를
  // 되돌리지 않도록, 변이가 있었으면 그 응답은 버린다.
  const mutationSeq = useRef(0);

  // 정적 렌더에는 「내 좋아요·추천」이 없다(뷰어 없이 구웠으므로) — 로그인
  // 사용자에게만 개인화 조각을 따로 물어 덧입힌다.
  useEffect(() => {
    if (!selfResolve || !userId) return;
    let alive = true;
    const seqAtStart = mutationSeq.current;
    void fetch(
      `/api/concept-community/personal?subject=${encodeURIComponent(subject)}&slug=${encodeURIComponent(conceptSlug)}`,
      { cache: "no-store" }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { likedPostIds?: string[]; recommendedPostIds?: string[] } | null) => {
        if (!alive || !data || mutationSeq.current !== seqAtStart) return;
        const liked = new Set(data.likedPostIds ?? []);
        const recommended = new Set(data.recommendedPostIds ?? []);
        setLocalPosts((prev) =>
          prev.map((post) => ({
            ...post,
            liked_by_viewer: liked.has(post.id),
            recommended_by_viewer: recommended.has(post.id),
          }))
        );
      });
    return () => {
      alive = false;
    };
  }, [selfResolve, userId, subject, conceptSlug, initialPosts]);

  const applyPostChange = (postId: string) => (next: ConceptCommunityPost | null) => {
    // 좋아요·추천·댓글·삭제가 성공하면 이 페이지의 정적 캐시를 비워
    // 다른 방문자도 다음 방문부터 바로 본다(안 비우면 최대 1시간 늦는다).
    requestRevalidate();
    if (!selfResolve) {
      router.refresh();
      return;
    }
    mutationSeq.current += 1;
    setLocalPosts((prev) =>
      next === null
        ? prev.filter((post) => post.id !== postId)
        : prev.map((post) => (post.id === postId ? next : post))
    );
  };

  const [contentHtml, setContentHtml] = useState("");
  const [contentPlain, setContentPlain] = useState("");
  const [saving, setSaving] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [status, setStatus] = useState<{ tone: "ok" | "err"; text: string } | null>(
    null
  );
  const loginHref = `/login?next=${encodeURIComponent(returnTo)}`;

  // 조회가 끝나기 전 클릭이면 fetchMe(문서당 1회 왕복 공유)로 확정한다 —
  // 로그인해 둔 사람에게 로그인 모달이 잘못 뜨면 안 된다.
  const resolveUserId = async (): Promise<string | null> => {
    if (!selfResolve || !me.pending) return userId;
    return (await fetchMe()).user?.id ?? null;
  };

  const handleRequireLogin = async () => {
    if ((await resolveUserId()) != null) return;
    setLoginOpen(true);
  };

  const handlePost = async () => {
    const plain = contentPlain.trim();
    const html = sanitizeConceptCommunityHtml(contentHtml).trim();
    if ((!plain && !html.includes("<img")) || saving) return;

    const uid = await resolveUserId();
    if (!uid) {
      setLoginOpen(true);
      return;
    }

    if (!isSupabaseConfigured()) return;
    setSaving(true);
    setStatus(null);
    const supabase = createClient();
    const content = html || plain;
    const { data, error } = await supabase
      .from("concept_community_posts")
      .insert({
        user_id: uid,
        subject,
        concept_slug: conceptSlug,
        content,
      })
      .select("id, view_count, created_at, updated_at")
      .single();
    if (error || !data) {
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
      // 새 글은 다른 방문자에게도 바로 보여야 한다 — 정적 캐시를 비운다.
      requestRevalidate();
      if (selfResolve) {
        // 정적 페이지 — 서버 재렌더 대신 방금 등록한 글을 로컬 목록 맨 앞에 붙인다.
        mutationSeq.current += 1;
        const newPost: ConceptCommunityPost = {
          id: data.id,
          user_id: uid,
          subject,
          concept_slug: conceptSlug,
          content,
          view_count: data.view_count ?? 0,
          created_at: data.created_at,
          updated_at: data.updated_at,
          author: viewer ?? { nickname: "익명", avatar_url: null },
          like_count: 0,
          liked_by_viewer: false,
          recommend_count: 0,
          recommended_by_viewer: false,
          comments: [],
        };
        setLocalPosts((prev) => [newPost, ...prev]);
      } else {
        router.refresh();
      }
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
          <span className="hp-cx-questions-count">{posts.length}개</span>
        </div>
        <div className="hp-cx-section__body">
          <div className="hp-cx-community-compose">
            <ConceptCommunityEditor
              userId={userId}
              resetToken={resetToken}
              onRequireLogin={() => void handleRequireLogin()}
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

          {posts.length > 0 ? (
            <div className="hp-cx-community-list">
              {posts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  post={post}
                  userId={userId}
                  loginPending={loginPending}
                  viewer={viewer}
                  loginHref={loginHref}
                  authorRanks={authorRanks}
                  onChanged={applyPostChange(post.id)}
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
