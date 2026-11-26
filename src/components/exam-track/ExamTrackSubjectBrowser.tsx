"use client";

import type { PcStudyOffer } from "@/lib/pc-access/study-features";
import { useMemo } from "react";
import { HistoryLibraryLinks } from "@/components/history/library/HistoryLibraryLinks";
import { SubjectLearningCard } from "@/components/study/SubjectLearningCard";

import type { ExamTrackConfig, ExamTrackManifestItem } from "@/lib/exam-track/types";

function SubjectCard({
  track,
  subject,
  offers,
}: {
  track: ExamTrackConfig;
  subject: ExamTrackManifestItem;
  offers?: PcStudyOffer[];
}) {
  return <SubjectLearningCard label={subject.label} badge={subject.track} examCount={subject.examCount} examHref={`${track.basePath}/exam/${subject.id}`} cellOffers={offers} extraActions={track.id === "history" && subject.id === "simhwa" ? <HistoryLibraryLinks /> : undefined} dailyHref={`${track.basePath}/daily?subject=${encodeURIComponent(subject.id)}`} />;

}

export function ExamTrackSubjectBrowser({
  track,
  subjects,
  cellOffers,
}: {
  track: ExamTrackConfig;
  subjects: ExamTrackManifestItem[];
  cellOffers: Record<string, PcStudyOffer[]>;
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
          {(tracks[0]?.[1] ?? subjects).map((subject) => (
            <SubjectCard key={subject.id} track={track} subject={subject} offers={cellOffers[subject.id]} />
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
                    offers={cellOffers[subject.id]}
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
