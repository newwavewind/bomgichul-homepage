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
  return <SubjectLearningCard label={subject.label} badge={subject.track} examCount={subject.examCount} conceptCount={subject.conceptCount} examHref={`${track.basePath}/exam/${subject.id}`} conceptHref={track.id === 'history' ? '/history/concepts' : subject.conceptCount > 0 ? `${track.basePath}/concepts/${subject.id}` : undefined} />;

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(tracks[0]?.[1] ?? subjects).map((subject, index) => (
            <SubjectCard key={subject.id} track={track} subject={subject} index={index} />
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {tracks.map(([group, groupSubjects]) => (
            <section key={group}>
              <h3 className="mb-5 border-b border-mist pb-3 font-display text-[24px] font-semibold text-ink">
                {group}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
