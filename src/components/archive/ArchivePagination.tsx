import Link from "next/link";

interface ArchivePaginationProps {
  currentPage: number;
  totalPages: number;
  search?: string;
  sort?: string;
  type?: string;
  subject?: string;
  baseHref?: string;
}

export function ArchivePagination({
  currentPage,
  totalPages,
  search,
  sort,
  type,
  subject,
  baseHref = "/archive",
}: ArchivePaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (search) params.set("q", search);
    if (sort && sort !== "latest") params.set("sort", sort);
    if (type && type !== "all") params.set("type", type);
    if (subject && subject !== "all") params.set("subject", subject);
    const qs = params.toString();
    return `${baseHref}${qs ? `?${qs}` : ""}`;
  };

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
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
        <Link href={buildHref(currentPage - 1)} className={`rounded-[var(--radius-buttons)] px-4 py-2 font-display text-body-sm font-medium ${pageClass(false)}`}>
          ← 이전
        </Link>
      )}
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`e-${i}`} className="px-2 text-fog">...</span>
        ) : (
          <Link key={page} href={buildHref(page)} className={`rounded-[var(--radius-buttons)] px-4 py-2 font-display text-body-sm font-medium ${pageClass(page === currentPage)}`}>
            {page}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link href={buildHref(currentPage + 1)} className={`rounded-[var(--radius-buttons)] px-4 py-2 font-display text-body-sm font-medium ${pageClass(false)}`}>
          다음 →
        </Link>
      )}
    </nav>
  );
}
