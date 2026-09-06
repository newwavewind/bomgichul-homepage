import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  sort?: string;
  baseHref?: string;
  anchor?: string;
  /** 목록 카드 하단에 붙는 스타일 */
  variant?: "standalone" | "embedded";
}

export function Pagination({
  currentPage,
  totalPages,
  total,
  pageSize,
  category,
  search,
  sort,
  baseHref = "/community",
  anchor,
  variant = "standalone",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const rangeStart =
    total != null && pageSize != null ? (currentPage - 1) * pageSize + 1 : null;
  const rangeEnd =
    total != null && pageSize != null ? Math.min(currentPage * pageSize, total) : null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (category && category !== "all") params.set("category", category);
    if (search) params.set("q", search);
    if (sort && sort !== "latest") params.set("sort", sort);
    const qs = params.toString();
    return `${baseHref}${qs ? `?${qs}` : ""}${anchor ? `#${anchor}` : ""}`;
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

  const wrapperClass =
    variant === "embedded"
      ? "flex flex-col items-center gap-3 border-t border-mist/60 bg-snow/40 px-4 py-4 sm:flex-row sm:justify-between"
      : "flex items-center justify-center gap-2 py-8";

  return (
    <nav
      aria-label="게시글 페이지"
      className={wrapperClass}
    >
      {rangeStart != null && rangeEnd != null && total != null ? (
        <p className="font-display text-[12px] text-fog sm:order-first">
          {rangeStart}–{rangeEnd} / 총 {total}개
        </p>
      ) : null}
      <div className="flex flex-wrap items-center justify-center gap-2">
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
      </div>
    </nav>
  );
}
