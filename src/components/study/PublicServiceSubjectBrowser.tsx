"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Tag } from "@/components/ui/Tag";

interface PublicServiceSubject {
  id: string;
  label: string;
  track: string;
  conceptCount: number;
  examCount: number;
}

interface PublicServiceSeries {
  id: string;
  label: string;
  group: string;
  subjectIds: string[];
  blurb?: string;
}

/** 공무원 앱의 src/subjects/seriesRegistry.js와 동일한 직렬·전문과목 구성 */
const PUBLIC_SERVICE_SERIES: PublicServiceSeries[] = [
  { id: "ilban-haengjeong", label: "일반행정직", group: "행정", subjectIds: ["haengjeongbeop", "hangjunghak"], blurb: "국가직·지방직" },
  { id: "gyoyuk-haengjeong", label: "교육행정직", group: "행정", subjectIds: ["gyoyukhak", "haengjeongbeop"] },
  { id: "goyong-nodong", label: "고용노동직", group: "행정", subjectIds: ["nodongbeop", "haengjeongbeop"] },
  { id: "chulipguk", label: "출입국관리직", group: "행정", subjectIds: ["haengjeongbeop", "gukjebeop"] },
  { id: "sahoe-bokji", label: "사회복지직", group: "행정", subjectIds: ["bokji", "haengjeongbeop"] },
  { id: "semu", label: "세무직", group: "세무·관세", subjectIds: ["sebeop", "hoegyehak"], blurb: "국가직 · 회계학" },
  { id: "gwanse", label: "관세직", group: "세무·관세", subjectIds: ["gwansebeop", "hoegyewonri"], blurb: "회계원리" },
  { id: "gyojeong", label: "교정직", group: "교정·수사", subjectIds: ["gyojeonghak", "hyeongsogaeron"] },
  { id: "geomchal", label: "검찰직", group: "교정·수사", subjectIds: ["hyeongbeop", "hyeongso"] },
  { id: "mayak-susa", label: "마약수사직", group: "교정·수사", subjectIds: ["hyeongbeop", "hyeongso"] },
  { id: "cheoldo-gyeongchal", label: "철도경찰직", group: "교정·수사", subjectIds: ["hyeongbeop", "hyeongsogaeron"] },
  { id: "sobang", label: "소방직", group: "소방", subjectIds: ["sobang", "sobangbeop"], blurb: "소방사 공채" },
];

function SubjectCard({ subject, index, badge }: { subject: PublicServiceSubject; index: number; badge?: string }) {
  return (
    <article className="rounded-[var(--radius-largecards)] border-[1.5px] border-carbon bg-paper p-6 shadow-[var(--shadow-card)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Tag className="!px-2.5 !py-0.5 !text-[12px]">{badge ?? subject.track}</Tag>
        <span className="font-display text-[12px] text-fog">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="font-display text-subheading font-semibold text-ink">{subject.label}</h3>
      <p className="mt-2 font-display text-body-sm text-smoke">개념 {subject.conceptCount}개 · 기출 {subject.examCount}문항</p>
      <div className="mt-6 grid grid-cols-2 gap-2">
        <Link href={`/public-service/concepts/${subject.id}`} className="rounded-xl border border-carbon/40 bg-[#e8f0ff] px-3 py-3 text-center font-display text-[13px] font-semibold text-carbon transition-colors hover:border-carbon hover:bg-[#dbe8ff]">올인원</Link>
        <Link href={`/public-service/exam/${subject.id}`} className="rounded-xl bg-carbon px-3 py-3 text-center font-display text-[13px] font-semibold text-paper hover:opacity-90">기출문제</Link>
      </div>
    </article>
  );
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
