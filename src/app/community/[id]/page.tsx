import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getPost, getComments, incrementViewCount } from "@/lib/posts";
import { getUser } from "@/lib/auth";
import { getPremiumBadgesForUsers } from "@/lib/badges";
import { CATEGORY_MAP, SITE_NAME } from "@/lib/constants";
import { ElevatedCard } from "@/components/ui/Card";
import { CommentForm } from "@/components/board/CommentForm";
import { CommentItem } from "@/components/board/CommentItem";
import { PostActions } from "@/components/board/PostActions";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import { BackLink } from "@/components/ui/BackLink";
import { absoluteUrl, ROBOTS_NOINDEX, truncateDescription } from "@/lib/seo";
import { formatKstDateLong } from "@/lib/datetime";
import { getCommunityLikeState, getUserActivityScores } from "@/lib/activity";
import { OceanRankBadge } from "@/components/ranks/OceanRankBadge";
import { CommunityLikeButton } from "@/components/board/CommunityLikeButton";
import { RichTextBody } from "@/components/editor/RichTextBody";
import { communityBaseHref, isValidCommunityScope } from "@/lib/exam-track/community";
import type { CommunityScope } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

function scopeFromPost(scope: string | null | undefined): CommunityScope {
  return isValidCommunityScope(scope) ? scope : "real_estate";
}

export async function generateMetadata({
  params,
}: PostDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return {};

  const description = truncateDescription(post.content);
  const title = post.title;
  const categoryLabel = CATEGORY_MAP[post.category] ?? post.category;
  const isAppOnlyCategory = post.category === "bug" || post.category === "feedback";
  const canonicalPath = `${communityBaseHref(scopeFromPost(post.community_scope))}/${id}`;

  return {
    title,
    description: `${categoryLabel} · ${description}`,
    alternates: { canonical: absoluteUrl(canonicalPath) },
    robots: isAppOnlyCategory ? ROBOTS_NOINDEX : undefined,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: absoluteUrl(canonicalPath),
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

/** 트랙 접두 경로(`/police/community/...` 등)와 공인중개사 `/community/...`가 공유 */
export async function CommunityPostDetailPage({
  params,
  expectedScope,
}: PostDetailPageProps & { expectedScope?: CommunityScope }) {
  const { id } = await params;
  const post = await getPost(id);
  const user = await getUser();

  if (!post) notFound();

  const postScope = scopeFromPost(post.community_scope);
  const canonicalHref = `${communityBaseHref(postScope)}/${id}`;

  if (expectedScope) {
    if (postScope !== expectedScope) {
      redirect(canonicalHref);
    }
  } else if (postScope !== "real_estate") {
    redirect(canonicalHref);
  }

  await incrementViewCount(id);
  const comments = await getComments(id);
  const authorIds = [
    post.author_id,
    ...comments.map((c) => c.author_id),
  ];
  const [authorBadges, authorActivity, likeState] = await Promise.all([
    getPremiumBadgesForUsers(authorIds),
    getUserActivityScores(authorIds),
    getCommunityLikeState(id, comments.map((comment) => comment.id), user?.id),
  ]);
  const boardHref = communityBaseHref(scopeFromPost(post.community_scope));
  const postHref = `${boardHref}/${id}`;
  const loginHref = `/login?next=${encodeURIComponent(postHref)}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <BackLink href={boardHref}>목록으로</BackLink>

      <ElevatedCard className="p-6 md:p-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <span className="rounded-[var(--radius-tags)] bg-surface px-3 py-1 font-display text-body-sm font-medium text-ink">
            {CATEGORY_MAP[post.category] ?? post.category}
          </span>
          <PostActions
            postId={post.id}
            authorId={post.author_id}
            currentUserId={user?.id}
            isAdmin={user?.isAdmin}
            listPath={boardHref}
            editPath={`${boardHref}/${id}/edit`}
          />
        </div>

        <h1 className="mb-4 font-display text-heading-sm font-semibold text-ink">
          {post.title}
        </h1>

        <div className="mb-8 flex flex-col gap-2.5 border-b border-mist/60 pb-6 font-display text-body-sm text-fog">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className="max-w-[11rem] truncate font-medium text-ink sm:max-w-[16rem]">
              {post.profiles?.nickname ?? "익명"}
            </span>
            <OceanRankBadge rank={authorActivity[post.author_id].rank} />
            {authorBadges[post.author_id] && (
              <PremiumBadge label={authorBadges[post.author_id]} />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <span className="whitespace-nowrap">{formatKstDateLong(post.created_at)}</span>
            <span className="text-ash" aria-hidden>
              ·
            </span>
            <span className="whitespace-nowrap">조회 {post.view_count + 1}</span>
            <div className="ml-auto shrink-0">
              <CommunityLikeButton
                targetType="post"
                targetId={post.id}
                authorId={post.author_id}
                currentUserId={user?.id}
                initialCount={likeState.post.count}
                initialLiked={likeState.post.likedByViewer}
                loginHref={loginHref}
              />
            </div>
          </div>
        </div>

        <RichTextBody content={post.content} />
      </ElevatedCard>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-subheading font-semibold text-ink">
          댓글 {comments.length}
        </h2>

        {comments.length === 0 ? (
          <p className="mb-6 font-display text-body-sm text-fog">
            아직 댓글이 없어요. 첫 댓글을 남겨보세요!
          </p>
        ) : (
          <div className="mb-6 space-y-3">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={user?.id}
                authorBadge={authorBadges[comment.author_id]}
                authorRank={authorActivity[comment.author_id].rank}
                likeCount={likeState.comments[comment.id]?.count}
                likedByViewer={likeState.comments[comment.id]?.likedByViewer}
                loginHref={loginHref}
              />
            ))}
          </div>
        )}

        <CommentForm
          postId={post.id}
          postAuthorId={post.author_id}
          userId={user?.id}
          loginHref={loginHref}
        />
      </section>
    </div>
  );
}

export default async function PostDetailPage(props: PostDetailPageProps) {
  return <CommunityPostDetailPage {...props} />;
}
