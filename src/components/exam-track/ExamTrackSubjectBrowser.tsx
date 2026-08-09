"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/Typography";
import { Tag } from "@/components/ui/Tag";
import type { ExamTrackConfig, ExamTrackManifestItem } from "@/lib/exam-track/types";

function SubjectCard({
  track,
  subject,
  index,
}: {
  track: ExamTrackConfig;
  subject: ExamTrackManifestItem;
  index: number;
}) {
  return (
    <article className="rounded-[var(--radius-largecards)] border-[1.5px] border-carbon bg-paper p-6 shadow-[var(--shadow-card)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Tag className="!px-2.5 !py-0.5 !text-[12px]">{subject.track}</Tag>
        <span className="font-display text-[12px] text-fog">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="font-display text-subheading font-semibold text-ink">{subject.label}</h3>
      <p className="mt-2 font-display text-body-sm text-smoke">
        개념 {subject.conceptCount}개 · 기출 {subject.examCount}문항
      </p>
      <div className="mt-6 grid grid-cols-2 gap-2">
        <Link
          href={`${track.basePath}/concepts/${subject.id}`}
          className="rounded-xl border border-carbon/40 bg-[#e8f0ff] px-3 py-3 text-center font-display text-[13px] font-semibold text-carbon transition-colors hover:border-carbon hover:bg-[#dbe8ff]"
        >
          all-in-one
        </Link>
        <Link
          href={`${track.basePath}/exam/${subject.id}`}
          className="rounded-xl bg-carbon px-3 py-3 text-center font-display text-[13px] font-semibold text-paper hover:opacity-90"
        >
          기출문제
        </Link>
      </div>
    </article>
  );
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
    return [...grouped.entries()];
  }, [subjects]);

  const [mode, setMode] = useState<"group" | "subject">(tracks.length > 1 ? "group" : "subject");

  const sortedSubjects = useMemo(
    () => [...subjects].sort((a, b) => a.label.localeCompare(b.label, "ko")),
    [subjects],
  );

  return (
    <section id={`${track.id}-subjects`}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionHeading as="h2">기출 학습 선택</SectionHeading>
          <p className="mt-2 font-display text-body-sm text-fog">과목별 개념과 공개 기출을 선택하세요.</p>
        </div>
        {tracks.length > 1 ? (
          <div
            className="inline-grid w-fit grid-cols-2 rounded-full border border-mist bg-paper p-1 shadow-[var(--shadow-button)]"
            aria-label="과목 보기 방식"
          >
            {(
              [
                ["group", "차수별"],
                ["subject", "과목별"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`rounded-full px-5 py-2 font-display text-body-sm font-semibold transition-colors ${
                  mode === value ? "bg-carbon text-paper" : "text-smoke hover:bg-snow hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {mode === "subject" || tracks.length <= 1 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedSubjects.map((subject, index) => (
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
