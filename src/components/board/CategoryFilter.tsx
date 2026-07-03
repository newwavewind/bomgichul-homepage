import Link from "next/link";
import type { PostCategory } from "@/types/database";
import { CATEGORIES } from "@/lib/constants";

interface CategoryFilterProps {
  current: PostCategory | "all";
}

export function CategoryFilter({ current }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const isActive = current === cat.value;
        return (
          <Link
            key={cat.value}
            href={
              cat.value === "all"
                ? "/community"
                : `/community?category=${cat.value}`
            }
            className={`
              rounded-[var(--radius-tags)] px-4 py-1.5
              font-display text-body-sm font-medium transition-colors
              ${isActive
                ? "bg-midnight text-paper"
                : "bg-surface text-ink hover:bg-snow"
              }
            `}
            title={cat.description}
          >
            {cat.label}
          </Link>
        );
      })}
    </div>
  );
}
