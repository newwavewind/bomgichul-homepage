import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArchivePost } from "@/lib/archive";
import { getComments, incrementViewCount } from "@/lib/posts";
import { getUser } from "@/lib/auth";
import {
  ARCHIVE_RESOURCE_TYPE_MAP,
  ARCHIVE_SUBJECT_MAP,
  SITE_NAME,
} from "@/lib/constants";
import { ElevatedCard } from "@/components/ui/Card";
import { AttachmentListServer } from "@/components/archive/AttachmentList";
import { CommentForm } from "@/components/board/CommentForm";
import { CommentItem } from "@/components/board/CommentItem";
import { PostActions } from "@/components/board/PostActions";
import { BackLink } from "@/components/ui/BackLink";
import { absoluteUrl, truncateDescription } from "@/lib/seo";
import { formatKstDate } from "@/lib/datetime";
import { getCommunityLikeState, getUserActivityScores } from "@/lib/activity";
import { OceanRankBadge } from "@/components/ranks/OceanRankBadge";
import { CommunityLikeButton } from "@/components/board/CommunityLikeButton";

interface ArchiveDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ArchiveDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getArchivePost(id);
  if (!post) return {};

  const description = truncateDescription(post.content);
  const subjectLabel = post.subject ? ARCHIVE_SUBJECT_MAP[post.subject] : null;
  const typeLabel = post.resource_type
    ? ARCHIVE_RESOURCE_TYPE_MAP[post.resource_type]
    : null;
  const prefix = [subjectLabel, typeLabel].filter(Boolean).join(" ");

  return {
    title: post.title,
    description: prefix ? `${prefix} · ${description}` : description,
    alternates: { canonical: absoluteUrl(`/archive/${id}`) },
    openGraph: {
      title: `${post.title} | ${SITE_NAME}`,
      description,
      url: absoluteUrl(`/archive/${id}`),
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function ArchiveDetailPage({ params }: ArchiveDetailPageProps) {
  const { id } = await params;
  const [post, user] = await Promise.all([getArchivePost(id), getUser()]);

  if (!post) notFound();

  await incrementViewCount(id);
  const comments = await getComments(id);
  const attachments = post.post_attachments ?? [];
  const authorIds = [post.author_id, ...comments.map((comment) => comment.author_id)];
  const [authorActivity, likeState] = await Promise.all([
    getUserActivityScores(authorIds),
    getCommunityLikeState(id, comments.map((comment) => comment.id), user?.id),
  ]);
  const loginHref = `/login?next=${encodeURIComponent(`/archive/${id}`)}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <BackLink href="/archive">자료실로</BackLink>

      <ElevatedCard className="p-6 md:p-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {post.resource_type && (
              <span className="rounded-[var(--radius-tags)] bg-ice/50 px-3 py-1 font-display text-body-sm font-medium text-electric-blue">
                {ARCHIVE_RESOURCE_TYPE_MAP[post.resource_type]}
              </span>
            )}
            {post.subject && (
              <span className="rounded-[var(--radius-tags)] bg-surface px-3 py-1 font-display text-body-sm text-smoke">
                {ARCHIVE_SUBJECT_MAP[post.subject] ?? post.subject}
              </span>
            )}
          </div>
          <PostActions
            postId={post.id}
            authorId={post.author_id}
            currentUserId={user?.id}
            isAdmin={user?.isAdmin}
            listPath="/archive"
            editPath={`/archive/${post.id}/edit`}
          />
        </div>

        <h1 className="mb-4 font-display text-heading-sm font-semibold text-ink">{post.title}</h1>

        <div className="mb-6 flex flex-col gap-2.5 border-b border-mist/60 pb-6 font-display text-body-sm text-fog">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className="max-w-[11rem] truncate font-medium text-ink sm:max-w-[16rem]">
              {post.profiles?.nickname ?? "익명"}
            </span>
            <OceanRankBadge rank={authorActivity[post.author_id].rank} />
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <span className="whitespace-nowrap">{formatKstDate(post.created_at)}</span>
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

        <div className="whitespace-pre-wrap font-display text-body leading-relaxed text-ink">
          {post.content}
        </div>

        <AttachmentListServer
          attachments={attachments}
          currentUserId={user?.id ?? null}
          loginHref={loginHref}
        />
      </ElevatedCard>

      <section className="mt-10">
        <h2 className="mb-6 font-display text-subheading font-semibold text-ink">
          댓글 {comments.length}
        </h2>
        {comments.length > 0 && (
          <div className="mb-6 space-y-3">
            {comments.map((c) => (
              <CommentItem
                key={c.id}
                comment={c}
                currentUserId={user?.id}
                authorRank={authorActivity[c.author_id].rank}
                likeCount={likeState.comments[c.id]?.count}
                likedByViewer={likeState.comments[c.id]?.likedByViewer}
                loginHref={loginHref}
              />
            ))}
          </div>
        )}
        <CommentForm postId={id} postAuthorId={post.author_id} userId={user?.id} />
      </section>
    </div>
  );
}
