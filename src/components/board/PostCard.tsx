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

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-body font-medium text-ink">
          {title}
        </h3>
      </div>

      <div className="hidden shrink-0 items-center gap-4 font-display text-body-sm text-fog sm:flex">
        <span className="flex items-center gap-1.5">
          {authorName}
          {authorRank && <OceanRankBadge rank={authorRank} />}
          {authorBadge && <PremiumBadge label={authorBadge} />}
        </span>
        <span>조회 {viewCount}</span>
        <span>{formatKstRelative(createdAt)}</span>
      </div>
    </Link>
  );
}
