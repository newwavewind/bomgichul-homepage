import Link from "next/link";
import { getPosts } from "@/lib/posts";
import {
  CATEGORY_MAP,
  CATEGORY_BADGE_CLASS,
  CATEGORY_EMOJI,
  USER_WRITABLE_CATEGORIES,
} from "@/lib/constants";
import { PrimaryButton } from "@/components/ui/Button";

const writableValues = new Set(USER_WRITABLE_CATEGORIES.map((c) => c.value));

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (hours < 1) return "방금 전";
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString("ko-KR");
}

export async function HomeCommunityPreview() {
  const { data: posts } = await getPosts({ page: 1, sort: "latest" });
  const preview = posts.filter((p) => writableValues.has(p.category)).slice(0, 5);

  if (preview.length === 0) {
    return (
      <div className="mt-10 rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper px-6 py-10 text-center shadow-[var(--shadow-card)]">
        <p className="font-display text-body-sm text-smoke">아직 게시글이 없어요</p>
        <p className="mt-1 font-display text-body-sm text-fog">
          첫 번째 글을 남겨보세요!
        </p>
        <div className="mt-5">
          <PrimaryButton href="/community/write">글쓰기</PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 overflow-hidden rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper text-left shadow-[var(--shadow-card)]">
      {preview.map((post) => (
        <Link
          key={post.id}
          href={`/community/${post.id}`}
          className="flex items-center gap-3 border-b border-mist/60 px-5 py-3.5 transition-colors last:border-b-0 hover:bg-snow"
        >
          <span
            className={`shrink-0 rounded-[var(--radius-tags)] px-2.5 py-1 font-display text-[12px] font-medium ${CATEGORY_BADGE_CLASS[post.category]}`}
          >
            {CATEGORY_EMOJI[post.category] ? `${CATEGORY_EMOJI[post.category]} ` : ""}
            {CATEGORY_MAP[post.category]}
          </span>
          <span className="min-w-0 flex-1 truncate font-display text-body-sm text-ink">
            {post.title}
          </span>
          <span className="hidden shrink-0 font-display text-[12px] text-fog sm:inline">
            {post.profiles?.nickname ?? "익명"}
          </span>
          <span className="shrink-0 font-display text-[12px] text-fog">
            {formatDate(post.created_at)}
          </span>
        </Link>
      ))}
    </div>
  );
}
