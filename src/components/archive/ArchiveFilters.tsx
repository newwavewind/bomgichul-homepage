"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ARCHIVE_RESOURCE_TYPES, ARCHIVE_SUBJECTS } from "@/lib/constants";

type SubjectOption = { value: string; label: string };

export function ArchiveFilters({
  subjects = [...ARCHIVE_SUBJECTS],
}: {
  subjects?: SubjectOption[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") ?? "all";
  const currentSubject = searchParams.get("subject") ?? "all";

  const buildHref = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    const qs = params.toString();
    return `${pathname}${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 font-display text-body-sm font-medium text-ink">자료 유형</p>
        <div className="flex flex-wrap gap-2">
          {ARCHIVE_RESOURCE_TYPES.map((t) => (
            <Link
              key={t.value}
              href={buildHref("type", t.value)}
              className={`rounded-[var(--radius-tags)] px-4 py-1.5 font-display text-body-sm font-medium transition-colors ${
                currentType === t.value
                  ? "bg-midnight text-paper"
                  : "bg-surface text-ink hover:bg-snow"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 font-display text-body-sm font-medium text-ink">과목</p>
        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => (
            <Link
              key={s.value}
              href={buildHref("subject", s.value)}
              className={`rounded-[var(--radius-tags)] px-4 py-1.5 font-display text-body-sm font-medium transition-colors ${
                currentSubject === s.value
                  ? "bg-midnight text-paper"
                  : "bg-surface text-ink hover:bg-snow"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
