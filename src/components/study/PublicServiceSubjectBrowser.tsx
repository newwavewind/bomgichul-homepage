"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/Typography";
import { Tag } from "@/components/ui/Tag";

interface PublicServiceSubject {
  id: string;
  label: string;
  track: string;
  conceptCount: number;
  examCount: number;
}

function SubjectCard({ subject, index }: { subject: PublicServiceSubject; index: number }) {
  return (
    <article className="rounded-[var(--radius-largecards)] border-[1.5px] border-carbon bg-paper p-6 shadow-[var(--shadow-card)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Tag className="!px-2.5 !py-0.5 !text-[12px]">{subject.track}</Tag>
        <span className="font-display text-[12px] text-fog">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="font-display text-subheading font-semibold text-ink">{subject.label}</h3>
      <p className="mt-2 font-display text-body-sm text-smoke">개념 {subject.conceptCount}개 · 기출 {subject.examCount}문항</p>
      <div className="mt-6 grid grid-cols-2 gap-2">
        <Link href={`/public-service/concepts/${subject.id}`} className="rounded-xl border border-carbon/40 bg-[#e8f0ff] px-3 py-3 text-center font-display text-[13px] font-semibold text-carbon transition-colors hover:border-carbon hover:bg-[#dbe8ff]">all-in-one</Link>
        <Link href={`/public-service/exam/${subject.id}`} className="rounded-xl bg-carbon px-3 py-3 text-center font-display text-[13px] font-semibold text-paper hover:opacity-90">기출문제</Link>
      </div>
    </article>
  );
}

export function PublicServiceSubjectBrowser({ subjects }: { subjects: PublicServiceSubject[] }) {
  const [mode, setMode] = useState<"subject" | "track">("track");
  const tracks = useMemo(() => [...new Set(subjects.map((subject) => subject.track))], [subjects]);
  const sortedSubjects = useMemo(
    () => [...subjects].sort((a, b) => b.label.localeCompare(a.label, "ko")),
    [subjects],
  );

  return (
    <section id="public-service-subjects">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionHeading as="h2">기출 학습 선택</SectionHeading>
          <p className="mt-2 font-display text-body-sm text-fog">과목 전체 또는 직렬별 구성을 한눈에 확인하세요.</p>
        </div>
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
        <div className="space-y-10">
          {tracks.map((track) => (
            <section key={track} aria-labelledby={`track-${track}`}>
              <div className="mb-4 flex items-center gap-3">
                <h3 id={`track-${track}`} className="font-display text-[21px] font-semibold text-ink">{track}</h3>
                <span className="rounded-full bg-ice px-3 py-1 font-display text-[12px] font-semibold text-electric-blue">
                  {subjects.filter((subject) => subject.track === track).length}과목
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {subjects.filter((subject) => subject.track === track).map((subject) => (
                  <SubjectCard key={subject.id} subject={subject} index={subjects.findIndex((item) => item.id === subject.id)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
