import Link from "next/link";
import type { PostCategory } from "@/types/database";
import { CATEGORY_MAP, CATEGORY_BADGE_CLASS, CATEGORY_EMOJI } from "@/lib/constants";
import { formatKstRelative } from "@/lib/datetime";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import { OceanRankBadge } from "@/components/ranks/OceanRankBadge";
import type { OceanRank } from "@/lib/ocean-ranks";

interface PostCardProps {
  id: string;
  title: string;
  category: PostCategory;
  authorName: string;
  authorBadge?: string | null;
  authorRank?: OceanRank;
  viewCount: number;
  commentCount: number;
  createdAt: string;
  baseHref?: string;
}

export function PostCard({
  id,
  title,
  category,
  authorName,
  authorBadge,
  authorRank,
  viewCount,
  commentCount,
  createdAt,
  baseHref = "/community",
}: PostCardProps) {
  return (
    <Link
      href={`${baseHref}/${id}`}
      className="flex items-center gap-4 border-b border-mist/60 px-6 py-5 transition-colors last:border-b-0 hover:bg-snow"
    >
      <span
        className={`shrink-0 rounded-[var(--radius-tags)] px-3 py-1 font-display text-body-sm font-medium ${CATEGORY_BADGE_CLASS[category]}`}
      >
        {CATEGORY_EMOJI[category] ? `${CATEGORY_EMOJI[category]} ` : ""}
        {CATEGORY_MAP[category]}
      </span>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <h3 className="min-w-0 truncate font-display text-body font-medium text-ink">
          {title}
        </h3>
        {commentCount > 0 && (
          <span
            className="inline-flex shrink-0 items-center gap-1 font-display text-[13px] font-semibold text-electric-blue"
            aria-label={`댓글 ${commentCount}개`}
          >
            <svg aria-hidden width="15" height="15" viewBox="0 0 20 20" fill="none">
              <path d="M4.25 4.5h11.5v8.25H9l-3.75 2.75v-2.75h-1V4.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            {commentCount}
          </span>
        )}
      </div>

      <div className="hidden shrink-0 items-center gap-4 font-display text-body-sm text-fog sm:flex">
        <span className="flex items-center gap-1.5">
          {authorName}
          {authorRank && <OceanRankBadge rank={authorRank} />}
          {authorBadge && <PremiumBadge label={authorBadge} />}
        </span>
        <span>조회 {viewCount}</span>
        <span>{formatKstRelative(createdAt, { includeYear: false })}</span>
      </div>
    </Link>
  );
}
