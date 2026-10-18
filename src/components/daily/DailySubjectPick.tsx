"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BackLink } from "@/components/ui/BackLink";
import {
  PUBLIC_SERVICE_SERIES,
  type PublicServiceSeries,
} from "@/data/public-service/series";

type DailySubject = { id: string; label: string };

function SubjectLink({
  exam,
  subject,
}: {
  exam: string;
  subject: DailySubject;
}) {
  return (
    <Link
      href={`/${exam}/daily?subject=${encodeURIComponent(subject.id)}`}
      className="flex items-center justify-between rounded-2xl border border-[#d7e3f4] bg-white/85 px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-[#007AFF]"
    >
      <span>{subject.label}</span>
      <span className="text-[#0066D6]">10문제</span>
    </Link>
  );
}

export function DailySubjectPick({
  exam,
  label,
  home,
  subjects,
}: {
  exam: string;
  label: string;
  home: string;
  subjects: DailySubject[];
}) {
  const hasSeriesView = exam === "public-service";
  const [mode, setMode] = useState<"subject" | "series">(
    hasSeriesView ? "series" : "subject",
  );
  const subjectsById = useMemo(
    () => new Map(subjects.map((subject) => [subject.id, subject])),
    [subjects],
  );
  const seriesGroups = useMemo(() => {
    if (!hasSeriesView) return [];
    const grouped = new Map<string, PublicServiceSeries[]>();
    for (const series of PUBLIC_SERVICE_SERIES) {
      const availableSubjectIds = series.subjectIds.filter((subjectId) =>
        subjectsById.has(subjectId),
      );
      if (availableSubjectIds.length === 0) continue;
      const current = grouped.get(series.group) ?? [];
      grouped.set(series.group, [
        ...current,
        { ...series, subjectIds: availableSubjectIds },
      ]);
    }
    return [...grouped.entries()];
  }, [hasSeriesView, subjectsById]);

  return (
    <div className="bg-[linear-gradient(180deg,#f3f8ff_0%,#ffffff_40%)] px-4 py-8">
      <div className="mx-auto max-w-xl">
        <BackLink href={home}>{label} 학습 홈</BackLink>
        <div className="mt-5 rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-7">
          <p className="text-xs font-semibold text-[#64748b]">{label}</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-ink">매일 10문제</h1>
          <p className="mt-2 text-sm leading-6 text-[#475569]">
            {mode === "series" && hasSeriesView
              ? "응시할 직렬을 찾고 전문과목을 고르세요. 순위는 선택한 과목에서 매깁니다."
              : "오늘 풀 과목을 고르세요. 고른 과목의 기출 10문제만 나오고, 순위도 그 과목에서 매깁니다."}
          </p>

          {hasSeriesView && (
            <div
              className="mt-5 grid grid-cols-2 rounded-2xl border border-[#d7e3f4] bg-[#f8fbff] p-1"
              role="tablist"
              aria-label="공무원 매일 10문제 보기 방식"
            >
              {(
                [
                  ["series", "직렬별"],
                  ["subject", "과목별"],
                ] as const
              ).map(([value, tabLabel]) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={mode === value}
                  aria-controls="daily-subject-options"
                  onClick={() => setMode(value)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    mode === value
                      ? "bg-[#007AFF] text-white shadow-sm"
                      : "text-[#475569] hover:bg-white hover:text-[#0066D6]"
                  }`}
                >
                  {tabLabel}
                </button>
              ))}
            </div>
          )}

          <div id="daily-subject-options" role={hasSeriesView ? "tabpanel" : undefined}>
            {mode === "series" && hasSeriesView ? (
              <div className="mt-5 space-y-6">
                {seriesGroups.map(([group, seriesList]) => (
                  <section key={group} aria-labelledby={`daily-series-${group}`}>
                    <h2
                      id={`daily-series-${group}`}
                      className="mb-3 text-sm font-semibold text-[#475569]"
                    >
                      {group}
                    </h2>
                    <div className="grid gap-3">
                      {seriesList.map((series) => (
                        <section
                          key={series.id}
                          className="rounded-2xl border border-[#d7e3f4] bg-[#f8fbff] p-3"
                          aria-labelledby={`daily-series-${series.id}`}
                        >
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 px-1">
                            <h3
                              id={`daily-series-${series.id}`}
                              className="text-sm font-semibold text-ink"
                            >
                              {series.label}
                            </h3>
                            {series.blurb && (
                              <span className="text-xs text-[#64748b]">
                                {series.blurb}
                              </span>
                            )}
                          </div>
                          <ul className="mt-3 grid gap-2">
                            {series.subjectIds.map((subjectId) => {
                              const subject = subjectsById.get(subjectId);
                              return subject ? (
                                <li key={`${series.id}-${subject.id}`}>
                                  <SubjectLink exam={exam} subject={subject} />
                                </li>
                              ) : null;
                            })}
                          </ul>
                        </section>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <ul className="mt-5 grid gap-2">
                {subjects.map((subject) => (
                  <li key={subject.id}>
                    <SubjectLink exam={exam} subject={subject} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
