"use client";

import { useState } from "react";

type Edition = { subject: string; subjectLabel: string; year: number; session: string; file: string };

const selectClassName = "mt-2 min-h-11 w-full rounded-xl border border-mist bg-white px-3 py-2 text-ink focus-visible:outline-2 focus-visible:outline-ios-blue disabled:bg-paper disabled:opacity-60";

export function ExamPrintPicker({ editions }: { editions: Edition[] }) {
  const subjects = new Map(editions.map(({ subject, subjectLabel }) => [subject, subjectLabel]));
  const [subject, setSubject] = useState(subjects.size === 1 ? (editions[0]?.subject ?? "") : "");
  const [year, setYear] = useState("");
  const [session, setSession] = useState("");
  const forSubject = editions.filter((entry) => entry.subject === subject);
  const years = [...new Set(forSubject.map((entry) => entry.year))].sort((a, b) => b - a);
  const sessions = forSubject.filter((entry) => String(entry.year) === year)
    .sort((a, b) => a.session.localeCompare(b.session, "ko", { numeric: true }));
  const selected = sessions.find((entry) => entry.session === session) ?? (sessions.length === 1 ? sessions[0] : undefined);
  const href = selected ? `/exam-print/${selected.file}` : undefined;
  const bundled = selected && editions.some((entry) =>
    entry.file === selected.file && entry.subject !== selected.subject,
  );

  return (
    <>
      <div className="grid gap-4 rounded-2xl border border-mist bg-paper p-4 sm:grid-cols-3 sm:p-5">
        <label className="font-display font-semibold text-ink">
          과목
          <select className={selectClassName} value={subject} onChange={(event) => {
            setSubject(event.target.value);
            setYear("");
            setSession("");
          }}>
            <option value="">과목 선택</option>
            {[...subjects].sort((a, b) => a[1].localeCompare(b[1], "ko")).map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
        </label>
        <label className="font-display font-semibold text-ink">
          연도
          <select className={selectClassName} value={year} disabled={!subject} onChange={(event) => {
            setYear(event.target.value);
            setSession("");
          }}>
            <option value="">연도 선택</option>
            {years.map((value) => <option key={value} value={value}>{value}년</option>)}
          </select>
        </label>
        <label className="font-display font-semibold text-ink">
          회차·구분
          <select className={selectClassName} value={selected?.session ?? ""} disabled={!year} onChange={(event) => {
            setSession(event.target.value);
          }}>
            <option value="" disabled={sessions.length === 1}>회차·구분 선택</option>
            {sessions.map((entry) => <option key={entry.session} value={entry.session}>{entry.session}</option>)}
          </select>
        </label>
      </div>
      {selected && href && (
        <section className="mt-5 overflow-hidden rounded-2xl border border-mist" aria-label="출력할 기출문제와 해설">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-paper p-4">
            <div>
              <h2 className="font-display font-semibold text-ink">{selected.subjectLabel} · {selected.year}년 {selected.session}</h2>
              {bundled && <p className="mt-1 text-sm text-fog">같은 시험지에 있는 다른 과목도 함께 출력돼요.</p>}
              <p className="mt-1 text-sm text-fog">PDF에서 인쇄를 누르면 A4 등 용지 크기를 고를 수 있어요.</p>
            </div>
            <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-xl bg-[#0066d6] px-4 font-display font-semibold text-white hover:bg-[#0057b7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ios-blue">
              PDF 열기·인쇄
            </a>
          </div>
          <iframe key={href} src={href} title="기출문제와 해설 PDF 미리보기" className="block h-[65vh] min-h-80 w-full border-t border-mist bg-white" />
        </section>
      )}
    </>
  );
}
