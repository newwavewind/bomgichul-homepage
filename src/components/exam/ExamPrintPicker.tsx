"use client";

import { useEffect, useId, useState } from "react";
import { ExamPrintBatchPicker } from "@/components/exam/ExamPrintBatchPicker";
import { ExamPrintExplanationOption } from "./ExamPrintExplanationOption";
import { ExamPrintPreview } from "@/components/exam/ExamPrintPreview";
import type { ExamPrintEdition, ExamPrintMergeRequest, ExamPrintMergeResponse } from "@/lib/exam-print-batch";

const selectClassName = "mt-2 min-h-11 w-full rounded-xl border border-mist bg-white px-3 py-2 text-ink focus-visible:outline-2 focus-visible:outline-ios-blue disabled:bg-paper disabled:opacity-60";

export function ExamPrintPicker({ examLabel, editions, initialEdition }: {
  examLabel: string;
  editions: ExamPrintEdition[];
  initialEdition?: ExamPrintEdition;
}) {
  const [batch, setBatch] = useState(false);
  const singleId = useId();
  const batchId = useId();
  const modeClass = "min-h-11 rounded-lg px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-ios-blue";
  const activeClass = "bg-white text-ink shadow-sm";
  const inactiveClass = "text-fog hover:text-ink";

  return (
    <>
      <div role="group" aria-label="출력 방식" className="mb-4 inline-flex gap-1 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          aria-pressed={!batch}
          aria-controls={singleId}
          onClick={() => setBatch(false)}
          className={`${modeClass} ${batch ? inactiveClass : activeClass}`}
        >
          한 회차 출력
        </button>
        <button
          type="button"
          aria-pressed={batch}
          aria-controls={batchId}
          onClick={() => setBatch(true)}
          className={`${modeClass} ${batch ? activeClass : inactiveClass}`}
        >
          여러 회차 묶기
        </button>
      </div>
      <div id={singleId} hidden={batch}>
        <SingleExamPrintPicker editions={editions} initialEdition={initialEdition} />
      </div>
      <div id={batchId} hidden={!batch}>
        <ExamPrintBatchPicker examLabel={examLabel} editions={editions} />
      </div>
    </>
  );
}

function SingleExamPrintPicker({ editions, initialEdition }: {
  editions: ExamPrintEdition[];
  initialEdition?: ExamPrintEdition;
}) {
  const subjects = new Map(editions.map(({ subject, subjectLabel }) => [subject, subjectLabel]));
  const [subject, setSubject] = useState(initialEdition?.subject ?? (subjects.size === 1 ? editions[0].subject : ""));
  const [year, setYear] = useState(initialEdition ? String(initialEdition.year) : "");
  const [includeExplanations, setIncludeExplanations] = useState(true);
  const [session, setSession] = useState(initialEdition?.session ?? "");
  const forSubject = editions.filter((entry) => entry.subject === subject);
  const years = [...new Set(forSubject.map((entry) => entry.year))].sort((a, b) => b - a);
  const sessions = forSubject.filter((entry) => String(entry.year) === year)
    .sort((a, b) => a.session.localeCompare(b.session, "ko", { numeric: true }));
  const selected = sessions.find((entry) => entry.session === session) ?? (sessions.length === 1 ? sessions[0] : undefined);
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
        <ExamPrintExplanationOption value={includeExplanations} onChange={setIncludeExplanations} className="sm:col-span-3" />
      </div>
      {selected && (includeExplanations ? (
        <ExamPrintPreview
          key={JSON.stringify([selected.subject, selected.year, selected.session])}
          title={`${selected.subjectLabel} · ${selected.year}년 ${selected.session}`}
          href={`/exam-print/${selected.file}`}
          fileName={`${selected.year}년 ${selected.session} ${selected.subjectLabel} 기출문제·해설.pdf`}
          details={bundled ? "같은 시험지에 있는 다른 과목도 함께 출력돼요." : undefined}
        />
      ) : <AnswerOnlyPreview key={selected.file}
        file={selected.file} title={`${selected.year}년 ${selected.session} ${selected.subjectLabel} 기출문제·정답표`} />)}
    </>
  );
}

function AnswerOnlyPreview({ file, title }: { file: string; title: string }) {
  const [result, setResult] = useState<{ href: string; file: Blob } | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let worker: Worker | undefined;
    let href: string | undefined;
    function fail() { setError(true); worker?.terminate(); }
    try {
      worker = new Worker(new URL("./exam-print-merge.worker.ts", import.meta.url));
      worker.onerror = fail;
      worker.onmessageerror = fail;
      worker.onmessage = ({ data }: MessageEvent<ExamPrintMergeResponse>) => {
        if (data.type === "error") fail();
        if (data.type === "complete") {
          href = URL.createObjectURL(data.file);
          setResult({ href, file: data.file });
          worker?.terminate();
        }
      };
      worker.postMessage({ files: [file], includeExplanations: false, title } satisfies ExamPrintMergeRequest);
    } catch { fail(); }
    return () => { worker?.terminate(); if (href) URL.revokeObjectURL(href); };
  }, [file, title, attempt]);
  if (error) return <div className="mt-5 flex items-center gap-3" role="alert">
    <p>시험지 PDF를 준비하지 못했어요.</p>
    <button type="button" className="rounded-lg border border-mist px-3 py-2" onClick={() => {
      setError(false); setAttempt(value => value + 1);
    }}>다시 시도</button>
  </div>;
  if (!result) return <p className="mt-5 text-sm text-fog" role="status">시험지와 정답표를 준비하는 중…</p>;
  return <ExamPrintPreview href={result.href} title={title} fileName={title + ".pdf"} generatedFile={result.file} />;
}
