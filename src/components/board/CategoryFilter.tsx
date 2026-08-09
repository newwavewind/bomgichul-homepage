import Link from "next/link";
import type { CommunityListFilter, PostCategory } from "@/types/database";
import {
  CATEGORIES,
  APP_ONLY_CATEGORIES,
  CATEGORY_EMOJI,
  BEST_POST_MIN_VIEWS,
} from "@/lib/constants";

interface CategoryFilterProps {
  current: CommunityListFilter;
  baseHref?: string;
}

const appOnlyValues = new Set(APP_ONLY_CATEGORIES.map((c) => c.value));

const BEST_FILTER = {
  value: "best" as const,
  label: "베스트",
  description: `조회 ${BEST_POST_MIN_VIEWS}회 이상 인기 글`,
};

function FilterChip({
  value,
  label,
  description,
  isActive,
  muted = false,
  emoji,
  baseHref = "/community",
}: {
  value: CommunityListFilter;
  label: string;
  description: string;
  isActive: boolean;
  muted?: boolean;
  emoji?: string;
  baseHref?: string;
}) {
  const href = value === "all" ? baseHref : `${baseHref}?category=${value}`;

  return (
    <Link
      href={href}
      className={`
        rounded-[var(--radius-tags)] px-4 py-1.5
        font-display text-body-sm font-medium transition-colors
        ${
          isActive
            ? "bg-midnight text-paper"
            : muted
              ? "bg-transparent text-fog hover:bg-snow"
              : "bg-surface text-ink hover:bg-snow"
        }
      `}
      title={description}
    >
      {emoji ? `${emoji} ` : ""}
      {value !== "all" && !emoji && CATEGORY_EMOJI[value as PostCategory]
        ? `${CATEGORY_EMOJI[value as PostCategory]} `
        : ""}
      {label}
    </Link>
  );
}

export function CategoryFilter({ current, baseHref = "/community" }: CategoryFilterProps) {
  const freeCategory = CATEGORIES.find((c) => c.value === "free");
  const mainCategories = CATEGORIES.filter(
    (c) =>
      c.value !== "all" &&
      c.value !== "free" &&
      !appOnlyValues.has(c.value as PostCategory)
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterChip
        value="all"
        label="전체"
        description="모든 게시글"
        isActive={current === "all"}
        baseHref={baseHref}
      />
      {freeCategory && (
        <FilterChip
          value={freeCategory.value}
          label={freeCategory.label}
          description={freeCategory.description}
          isActive={current === freeCategory.value}
          baseHref={baseHref}
        />
      )}
      <FilterChip
        value={BEST_FILTER.value}
        label={BEST_FILTER.label}
        description={BEST_FILTER.description}
        isActive={current === "best"}
        emoji="🔥"
        baseHref={baseHref}
      />

      {mainCategories.map((cat) => (
        <FilterChip
          key={cat.value}
          value={cat.value}
          label={cat.label}
          description={cat.description}
          isActive={current === cat.value}
          baseHref={baseHref}
        />
      ))}

      <span className="mx-1 h-4 w-px bg-mist" aria-hidden />

      {APP_ONLY_CATEGORIES.map((cat) => (
        <FilterChip
          key={cat.value}
          value={cat.value}
          label={cat.label}
          description={cat.description}
          isActive={current === cat.value}
          muted
          baseHref={baseHref}
        />
      ))}

      <span className="mx-0.5 h-4 w-px bg-mist" aria-hidden />

      <Link
        href="/ranks"
        className="rounded-[var(--radius-tags)] px-4 py-1.5 font-display text-body-sm font-medium text-fog transition-colors hover:bg-snow"
        title="활동 점수로 성장하는 20단계 바다 레벨"
      >
        바다 레벨
      </Link>
    </div>
  );
}
