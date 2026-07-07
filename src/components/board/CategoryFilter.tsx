import Link from "next/link";
import type { PostCategory } from "@/types/database";
import {
  CATEGORIES,
  APP_ONLY_CATEGORIES,
  CATEGORY_EMOJI,
} from "@/lib/constants";

interface CategoryFilterProps {
  current: PostCategory | "all";
}

const appOnlyValues = new Set(APP_ONLY_CATEGORIES.map((c) => c.value));

function FilterChip({
  value,
  label,
  description,
  isActive,
  muted = false,
}: {
  value: PostCategory | "all";
  label: string;
  description: string;
  isActive: boolean;
  muted?: boolean;
}) {
  return (
    <Link
      href={value === "all" ? "/community" : `/community?category=${value}`}
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
      {value !== "all" && CATEGORY_EMOJI[value] ? `${CATEGORY_EMOJI[value]} ` : ""}
      {label}
    </Link>
  );
}

export function CategoryFilter({ current }: CategoryFilterProps) {
  const mainCategories = CATEGORIES.filter((c) => !appOnlyValues.has(c.value as PostCategory));

  return (
    <div className="flex flex-wrap items-center gap-2">
      {mainCategories.map((cat) => (
        <FilterChip
          key={cat.value}
          value={cat.value}
          label={cat.label}
          description={cat.description}
          isActive={current === cat.value}
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
        />
      ))}
    </div>
  );
}
