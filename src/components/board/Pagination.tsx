import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  category?: string;
  search?: string;
  sort?: string;
  baseHref?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  category,
  search,
  sort,
  baseHref = "/community",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (category && category !== "all") params.set("category", category);
    if (search) params.set("q", search);
    if (sort && sort !== "latest") params.set("sort", sort);
    const qs = params.toString();
    return `${baseHref}${qs ? `?${qs}` : ""}`;
  };

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 2 && i <= currentPage + 2)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const pageClass = (active: boolean) =>
    active ? "bg-midnight text-paper" : "bg-surface text-ink hover:bg-snow";

  return (
    <nav className="flex items-center justify-center gap-2 py-8">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className={`rounded-[var(--radius-buttons)] px-4 py-2 font-display text-body-sm font-medium ${pageClass(false)}`}
        >
          ← 이전
        </Link>
      )}

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 font-display text-body-sm text-fog">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={`rounded-[var(--radius-buttons)] px-4 py-2 font-display text-body-sm font-medium ${pageClass(page === currentPage)}`}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className={`rounded-[var(--radius-buttons)] px-4 py-2 font-display text-body-sm font-medium ${pageClass(false)}`}
        >
          다음 →
        </Link>
      )}
    </nav>
  );
}
