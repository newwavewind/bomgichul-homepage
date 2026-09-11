"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ARCHIVE_RESOURCE_TYPES, ARCHIVE_SUBJECTS } from "@/lib/constants";
import {
  archiveRoundsForScope,
  archiveTracksForScope,
  archiveYearsForScope,
} from "@/lib/archive-filters";
import type { CommunityScope } from "@/types/database";

type SubjectOption = { value: string; label: string };

function chipClass(active: boolean) {
  return `rounded-[var(--radius-tags)] px-4 py-1.5 font-display text-body-sm font-medium transition-colors ${
    active ? "bg-midnight text-paper" : "bg-surface text-ink hover:bg-snow"
  }`;
}

export function ArchiveFilters({
  subjects = [...ARCHIVE_SUBJECTS],
  scope = "real_estate",
}: {
  subjects?: SubjectOption[];
  scope?: CommunityScope;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") ?? "all";
  const requestedSubject = searchParams.get("subject") ?? "all";
  const currentSubject = subjects.some((subject) => subject.value === requestedSubject)
    ? requestedSubject
    : "all";
  const currentYear = searchParams.get("year") ?? "";
  const currentRound = searchParams.get("round") ?? "";
  const currentTrack = searchParams.get("track") ?? "all";

  const years = archiveYearsForScope(scope);
  const rounds = archiveRoundsForScope(scope);
  const trackGroup = archiveTracksForScope(scope);

  const buildHref = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!subjects.some((subject) => subject.value === params.get("subject"))) {
      params.delete("subject");
    }
    if (value === "all" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    // 연도·회차는 서로 배타
    if (key === "year") params.delete("round");
    if (key === "round") params.delete("year");
    params.delete("page");
    const qs = params.toString();
    return `${pathname}${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="space-y-4">
      {years.length > 0 && (
        <div>
          <p className="mb-2 font-display text-body-sm font-medium text-ink">연도</p>
          <div className="flex flex-wrap gap-2">
            <Link href={buildHref("year", "all")} className={chipClass(!currentYear)}>
              전체
            </Link>
            {years.map((y) => (
              <Link
                key={y}
                href={buildHref("year", String(y))}
                className={chipClass(currentYear === String(y))}
              >
                {y}년
              </Link>
            ))}
          </div>
        </div>
      )}

      {rounds.length > 0 && (
        <div>
          <p className="mb-2 font-display text-body-sm font-medium text-ink">회차</p>
          <div className="flex flex-wrap gap-2">
            <Link href={buildHref("round", "all")} className={chipClass(!currentRound)}>
              전체
            </Link>
            {rounds.map((r) => (
              <Link
                key={r}
                href={buildHref("round", String(r))}
                className={chipClass(currentRound === String(r))}
              >
                {r}회
              </Link>
            ))}
          </div>
        </div>
      )}

      {trackGroup && (
        <div>
          <p className="mb-2 font-display text-body-sm font-medium text-ink">{trackGroup.label}</p>
          <div className="flex flex-wrap gap-2">
            {trackGroup.options.map((opt) => (
              <Link
                key={opt.value}
                href={buildHref("track", opt.value)}
                className={chipClass(currentTrack === opt.value || (opt.value === "all" && currentTrack === "all"))}
              >
                {opt.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 font-display text-body-sm font-medium text-ink">자료 유형</p>
        <div className="flex flex-wrap gap-2">
          {ARCHIVE_RESOURCE_TYPES.map((t) => (
            <Link
              key={t.value}
              href={buildHref("type", t.value)}
              className={chipClass(currentType === t.value)}
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
              className={chipClass(currentSubject === s.value)}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
