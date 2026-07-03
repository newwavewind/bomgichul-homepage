import Link from "next/link";
import type { PostCategory } from "@/types/database";
import { CATEGORY_MAP } from "@/lib/constants";

interface PostCardProps {
  id: string;
  title: string;
  category: PostCategory;
  authorName: string;
  viewCount: number;
  createdAt: string;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString("ko-KR");
}

export function PostCard({
  id,
  title,
  category,
  authorName,
  viewCount,
  createdAt,
}: PostCardProps) {
  return (
    <Link
      href={`/community/${id}`}
      className="flex items-center gap-4 border-b border-mist/60 px-6 py-5 transition-colors last:border-b-0 hover:bg-snow"
    >
      <span className="shrink-0 rounded-[var(--radius-tags)] bg-[#fafafa] px-3 py-1 font-display text-body-sm font-medium text-ink">
        {CATEGORY_MAP[category]}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-body font-medium text-ink">
          {title}
        </h3>
      </div>

      <div className="hidden shrink-0 items-center gap-4 font-display text-body-sm text-fog sm:flex">
        <span>{authorName}</span>
        <span>조회 {viewCount}</span>
        <span>{formatDate(createdAt)}</span>
      </div>
    </Link>
  );
}
