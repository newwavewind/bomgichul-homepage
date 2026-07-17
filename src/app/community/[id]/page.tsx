import { notFound } from "next/navigation";
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
import { absoluteUrl, truncateDescription } from "@/lib/seo";
import { formatKstDateLong } from "@/lib/datetime";
import { getCommunityLikeState, getUserActivityScores } from "@/lib/activity";
import { OceanRankBadge } from "@/components/ranks/OceanRankBadge";
import { CommunityLikeButton } from "@/components/board/CommunityLikeButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
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

  return {
    title,
    description: `${categoryLabel} · ${description}`,
    alternates: { canonical: absoluteUrl(`/community/${id}`) },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: absoluteUrl(`/community/${id}`),
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

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const post = await getPost(id);
  const user = await getUser();

  if (!post) notFound();

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
  const loginHref = `/login?next=${encodeURIComponent(`/community/${id}`)}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <BackLink href="/community">목록으로</BackLink>

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
          />
        </div>

        <h1 className="mb-4 font-display text-heading-sm font-semibold text-ink">
          {post.title}
        </h1>

        <div className="mb-8 flex items-center gap-3 border-b border-mist/60 pb-6 font-display text-body-sm text-fog">
          <span className="flex items-center gap-1.5">
            {post.profiles?.nickname ?? "익명"}
            <OceanRankBadge rank={authorActivity[post.author_id].rank} />
            {authorBadges[post.author_id] && (
              <PremiumBadge label={authorBadges[post.author_id]} />
            )}
          </span>
          <span>·</span>
          <span>{formatKstDateLong(post.created_at)}</span>
          <span>·</span>
          <span>조회 {post.view_count + 1}</span>
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

        <div className="whitespace-pre-wrap font-display text-body leading-relaxed text-ink">
          {post.content}
        </div>
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
        />
      </section>
    </div>
  );
}
