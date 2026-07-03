import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getComments, incrementViewCount } from "@/lib/posts";
import { getUser } from "@/lib/auth";
import { CATEGORY_MAP } from "@/lib/constants";
import { ElevatedCard } from "@/components/ui/Card";
import { CommentForm } from "@/components/board/CommentForm";
import { CommentItem } from "@/components/board/CommentItem";
import { PostActions } from "@/components/board/PostActions";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const [post, user] = await Promise.all([getPost(id), getUser()]);

  if (!post) notFound();

  await incrementViewCount(id);
  const comments = await getComments(id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <Link
        href="/community"
        className="mb-8 inline-block font-display text-body-sm text-fog transition-colors hover:text-ink"
      >
        ← 목록으로
      </Link>

      <ElevatedCard className="p-6 md:p-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <span className="rounded-[var(--radius-tags)] bg-surface px-3 py-1 font-display text-body-sm font-medium text-ink">
            {CATEGORY_MAP[post.category]}
          </span>
          <PostActions
            postId={post.id}
            authorId={post.author_id}
            currentUserId={user?.id}
          />
        </div>

        <h1 className="mb-4 font-display text-heading-sm font-semibold text-ink">
          {post.title}
        </h1>

        <div className="mb-8 flex items-center gap-3 border-b border-mist/60 pb-6 font-display text-body-sm text-fog">
          <span>{post.profiles?.nickname ?? "익명"}</span>
          <span>·</span>
          <span>
            {new Date(post.created_at).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>·</span>
          <span>조회 {post.view_count + 1}</span>
        </div>

        <div className="whitespace-pre-wrap font-display text-body leading-relaxed text-ink">
          {post.content}
        </div>
      </ElevatedCard>

      <section className="mt-10">
        <h2 className="mb-6 font-display text-subheading font-semibold text-ink">
          댓글 {comments.length}
        </h2>

        {comments.length === 0 ? (
          <div className="mb-6 rounded-[var(--radius-cards)] border border-dashed border-mist py-12 text-center">
            <p className="font-display text-body-sm text-fog">
              아직 댓글이 없어요. 첫 댓글을 남겨보세요!
            </p>
          </div>
        ) : (
          <div className="mb-6 space-y-3">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )}

        <CommentForm postId={id} userId={user?.id} />
      </section>
    </div>
  );
}
