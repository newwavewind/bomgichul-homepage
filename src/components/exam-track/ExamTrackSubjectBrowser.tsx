"use client";

import { useMemo } from "react";
import { SubjectLearningCard } from "@/components/study/SubjectLearningCard";

import type { ExamTrackConfig, ExamTrackManifestItem } from "@/lib/exam-track/types";

function SubjectCard({
  track,
  subject,
}: {
  track: ExamTrackConfig;
  subject: ExamTrackManifestItem;
  index: number;
}) {
  return <SubjectLearningCard label={subject.label} badge={subject.track} examCount={subject.examCount} examHref={`${track.basePath}/exam/${subject.id}`} dailyHref={`${track.basePath}/daily?subject=${encodeURIComponent(subject.id)}`} />;

}

export function ExamTrackSubjectBrowser({
  track,
  subjects,
}: {
  track: ExamTrackConfig;
  subjects: ExamTrackManifestItem[];
}) {
  const tracks = useMemo(() => {
    const grouped = new Map<string, ExamTrackManifestItem[]>();
    for (const subject of subjects) {
      const key = subject.track || "과목";
      grouped.set(key, [...(grouped.get(key) ?? []), subject]);
    }
    return [...grouped.entries()].sort(([a], [b]) =>
      a.localeCompare(b, "ko", { numeric: true }),
    );
  }, [subjects]);

  return (
    <section id={`${track.id}-subjects`}>
      {tracks.length <= 1 ? (
        <div className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
          {(tracks[0]?.[1] ?? subjects).map((subject, index) => (
            <SubjectCard key={subject.id} track={track} subject={subject} index={index} />
          ))}
        </div>
      ) : (
        <div className="space-y-10 md:space-y-12">
          {tracks.map(([group, groupSubjects]) => (
            <section key={group}>
              <h3 className="mb-5 border-b border-mist pb-3 font-display text-[22px] font-semibold text-ink md:text-[24px]">
                {group}
              </h3>
              <div className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
                {groupSubjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    track={track}
                    subject={subject}
                    index={subjects.findIndex((item) => item.id === subject.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
