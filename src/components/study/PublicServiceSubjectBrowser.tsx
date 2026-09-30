"use client";

import { useMemo, useState } from "react";
import { SubjectLearningCard } from "@/components/study/SubjectLearningCard";

import {
  PUBLIC_SERVICE_SERIES,
  type PublicServiceSeries,
} from "@/data/public-service/series";

interface PublicServiceSubject {
  id: string;
  label: string;
  track: string;
  conceptCount: number;
  examCount: number;
}

function SubjectCard({ subject, badge }: { subject: PublicServiceSubject; index: number; badge?: string }) {
  return <SubjectLearningCard label={subject.label} badge={badge ?? subject.track} examCount={subject.examCount} conceptCount={subject.conceptCount} examHref={`/public-service/exam/${subject.id}`} conceptHref={subject.conceptCount>0?`/public-service/concepts/${subject.id}`:undefined} />;

}

export function PublicServiceSubjectBrowser({ subjects }: { subjects: PublicServiceSubject[] }) {
  const [mode, setMode] = useState<"subject" | "track">("track");
  const subjectsById = useMemo(() => new Map(subjects.map((subject) => [subject.id, subject])), [subjects]);
  const seriesGroups = useMemo(() => {
    const grouped = new Map<string, PublicServiceSeries[]>();
    for (const series of PUBLIC_SERVICE_SERIES) {
      const current = grouped.get(series.group) ?? [];
      grouped.set(series.group, [...current, series]);
    }
    return [...grouped.entries()];
  }, []);
  const sortedSubjects = useMemo(
    () => [...subjects].sort((a, b) => b.label.localeCompare(a.label, "ko")),
    [subjects],
  );

  return (
    <section id="public-service-subjects">
      <div className="mb-6">
        <div className="inline-grid w-fit grid-cols-2 rounded-full border border-mist bg-paper p-1 shadow-[var(--shadow-button)]" aria-label="과목 보기 방식">
          {([['track', '직렬별'], ['subject', '과목별']] as const).map(([value, label]) => (
            <button key={value} type="button" onClick={() => setMode(value)} className={`rounded-full px-5 py-2 font-display text-body-sm font-semibold transition-colors ${mode === value ? "bg-carbon text-paper" : "text-smoke hover:bg-snow hover:text-ink"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {mode === "subject" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedSubjects.map((subject, index) => <SubjectCard key={subject.id} subject={subject} index={index} />)}
        </div>
      ) : (
        <div className="space-y-14">
          {seriesGroups.map(([group, seriesList]) => (
            <section key={group} aria-labelledby={`series-group-${group}`}>
              <h3 id={`series-group-${group}`} className="mb-6 border-b border-mist pb-3 font-display text-[24px] font-semibold text-ink">{group}</h3>
              <div className="space-y-9">
                {seriesList.map((series) => {
                  const seriesSubjects = series.subjectIds
                    .map((subjectId) => subjectsById.get(subjectId))
                    .filter((subject): subject is PublicServiceSubject => Boolean(subject));
                  return (
                    <section key={series.id} aria-labelledby={`series-${series.id}`}>
                      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h4 id={`series-${series.id}`} className="font-display text-[20px] font-semibold text-ink">{series.label}</h4>
                        <span className="rounded-full bg-ice px-3 py-1 font-display text-[12px] font-semibold text-electric-blue">전문과목 {seriesSubjects.length}개</span>
                        {series.blurb && <span className="font-display text-[12px] text-fog">{series.blurb}</span>}
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:max-w-[66.666%]">
                        {seriesSubjects.map((subject) => (
                          <SubjectCard key={`${series.id}-${subject.id}`} subject={subject} index={subjects.findIndex((item) => item.id === subject.id)} badge={series.label} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
