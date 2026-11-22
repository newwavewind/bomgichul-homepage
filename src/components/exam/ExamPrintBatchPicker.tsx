"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ExamPrintPreview,
  examPrintPrimaryAction,
  examPrintSecondaryAction,
} from "@/components/exam/ExamPrintPreview";
import {
  examPrintSessionKey,
  groupExamPrintBooklets,
  groupExamPrintDocuments,
  groupExamPrintSessions,
  type ExamPrintEdition,
  type ExamPrintMergeRequest,
  type ExamPrintMergeResponse,
} from "@/lib/exam-print-batch";

const yearModes = [
  { value: "pick", label: "연도 선택" },
  { value: "range", label: "기간 지정" },
  { value: "all", label: "전체 연도" },
] as const;
type YearMode = (typeof yearModes)[number]["value"];
type BatchResult = { key: string; file: Blob; href: string; pages: number; title: string };

const optionStyle = "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-mist bg-white px-3 py-1.5 text-sm text-ink has-checked:border-ios-blue has-checked:bg-slate-50";
const smallAction = "inline-flex min-h-11 items-center rounded-lg px-2.5 text-sm font-semibold text-ink hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-ios-blue aria-pressed:bg-slate-100";
const selectStyle = "mt-1 block min-h-11 w-full rounded-xl border border-mist bg-white px-3 text-ink focus-visible:outline-2 focus-visible:outline-ios-blue";

function withSelection<T>(current: Set<T>, values: T[], selected: boolean) {
  const next = new Set(current);
  for (const value of values) {
    if (selected) next.add(value);
    else next.delete(value);
  }
  return next;
}

export function ExamPrintBatchPicker({ examLabel, editions }: { examLabel: string; editions: ExamPrintEdition[] }) {
  const documents = useMemo(() => groupExamPrintDocuments(editions), [editions]);
  const booklets = useMemo(() => groupExamPrintBooklets(documents), [documents]);
  const hasMultipleSessionsPerYear = useMemo(
    () => groupExamPrintSessions(documents).some(({ sessions }) => sessions.length > 1),
    [documents],
  );
  const years = useMemo(() => [...new Set(editions.map((entry) => entry.year))].sort((a, b) => a - b), [editions]);
  const [bookletsSelected, setBookletsSelected] = useState(() =>
    new Set(booklets.length === 1 ? [booklets[0].bookletKey] : []));
  const [yearMode, setYearMode] = useState<YearMode>("pick");
  const [yearsSelected, setYearsSelected] = useState(new Set<number>());
  const [startYear, setStartYear] = useState(years[0]);
  const [endYear, setEndYear] = useState(years[years.length - 1]);
  const [excludedSessions, setExcludedSessions] = useState(new Set<string>());
  const [excluded, setExcluded] = useState(new Set<string>());
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<BatchResult | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const yearModeName = useId();
  const busy = progress !== null;

  useEffect(() => () => workerRef.current?.terminate(), []);

  const resultHref = result?.href;
  useEffect(() => () => {
    if (resultHref) URL.revokeObjectURL(resultHref);
  }, [resultHref]);

  const activeYears = new Set(yearMode === "all" ? years : yearMode === "range"
    ? years.filter((year) => year >= startYear && year <= endYear)
    : yearsSelected);
  const datedDocuments = documents.filter(({ year }) => activeYears.has(year));
  const datedKeys = new Set(datedDocuments.map(({ bookletKey }) => bookletKey));
  const visibleBooklets = activeYears.size
    ? booklets.filter(({ bookletKey }) => datedKeys.has(bookletKey))
    : booklets;
  const bookletGroups = [...new Set(visibleBooklets.map(({ subjectGroup }) => subjectGroup ?? ""))];
  const selectedBooklets = datedDocuments.filter(({ bookletKey }) => bookletsSelected.has(bookletKey));
  const sessionsByYear = groupExamPrintSessions(bookletsSelected.size ? selectedBooklets : datedDocuments);
  const sessionKeys = sessionsByYear.flatMap(({ year, sessions }) =>
    sessions.map((session) => examPrintSessionKey(year, session)));
  const hasExcludedSessions = sessionKeys.some((session) => excludedSessions.has(session));
  const showSessionPicker = sessionsByYear.length > 0 && hasMultipleSessionsPerYear;
  const matching = selectedBooklets.filter(({ year, session }) =>
    !excludedSessions.has(examPrintSessionKey(year, session)));
  const included = matching.filter(({ file }) => !excluded.has(file));
  const key = included.map(({ file }) => file).join("|");
  const allBookletsSelected = visibleBooklets.every(({ bookletKey }) => bookletsSelected.has(bookletKey));
  const ready = result?.key === key ? result : null;
  const emptyMessage = matching.length ? "시험지를 한 개 이상 선택하세요."
    : selectedBooklets.length ? "포함할 회차를 한 개 이상 선택하세요."
    : bookletsSelected.size && activeYears.size ? "선택한 조건에 맞는 시험지가 없어요."
    : "시험지와 연도를 선택하세요.";

  function selectAll() {
    setBookletsSelected(new Set(booklets.map(({ bookletKey }) => bookletKey)));
    setYearMode("all");
    setExcludedSessions(new Set());
    setExcluded(new Set());
  }

  function stop() {
    workerRef.current?.terminate();
    workerRef.current = null;
    setProgress(null);
  }

  function merge() {
    if (!included.length || workerRef.current) return;
    setError(false);
    const includedYears = [...new Set(included.map(({ year }) => year))];
    const firstYear = includedYears[0];
    const lastYear = includedYears[includedYears.length - 1];
    const contiguous = includedYears.length > 2 && lastYear - firstYear + 1 === includedYears.length;
    const period = contiguous ? `${firstYear}–${lastYear}년` : `${includedYears.join("·")}년`;
    const title = `${examLabel} ${period} 묶음 기출문제·해설`;
    try {
      const worker = new Worker(new URL("./exam-print-merge.worker.ts", import.meta.url));
      workerRef.current = worker;
      const fail = () => {
        if (workerRef.current !== worker) return;
        stop();
        setError(true);
      };
      worker.onerror = fail;
      worker.onmessageerror = fail;
      worker.onmessage = ({ data }: MessageEvent<ExamPrintMergeResponse>) => {
        if (workerRef.current !== worker) return;
        if (data.type === "progress") {
          setProgress(data.done);
        } else if (data.type === "complete") {
          const href = URL.createObjectURL(data.file);
          setResult({ key, file: data.file, pages: data.pages, href, title });
          stop();
        } else {
          fail();
        }
      };
      setProgress(0);
      worker.postMessage({ files: included.map(({ file }) => file), title } satisfies ExamPrintMergeRequest);
    } catch {
      stop();
      setError(true);
    }
  }

  return (
    <>
      <section aria-label="여러 회차 묶기 설정" className="overflow-hidden rounded-2xl border border-mist bg-paper">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-mist bg-slate-50 p-4 sm:px-5">
          <h2 className="font-display font-semibold text-ink">시험지와 연도 고르기</h2>
          <button type="button" className={examPrintSecondaryAction} onClick={selectAll} disabled={busy}>
            전체 연도·시험지 선택
          </button>
        </div>

        <div className="space-y-5 p-4 sm:p-5">
          <fieldset disabled={busy}>
            <legend className="font-display font-semibold text-ink">시험지</legend>
            <button
              type="button"
              className={smallAction}
              aria-pressed={allBookletsSelected}
              onClick={() => setBookletsSelected(allBookletsSelected ? new Set() : new Set(booklets.map(({ bookletKey }) => bookletKey)))}
            >
              시험지 전체 선택
            </button>
            <div className={bookletGroups.length > 1 ? "mt-2 grid gap-2 sm:grid-cols-[1fr_2fr]" : "mt-2"}>
              {bookletGroups.map((group) => {
                const groupBooklets = visibleBooklets.filter(({ subjectGroup }) => (subjectGroup ?? "") === group);
                const groupSelected = groupBooklets.every(({ bookletKey }) => bookletsSelected.has(bookletKey));
                const keys = booklets.filter(({ subjectGroup }) => (subjectGroup ?? "") === group).map(({ bookletKey }) => bookletKey);
                return (
                  <div key={group} className={group ? "rounded-xl border border-mist bg-slate-50 p-2.5" : undefined}>
                    {group && keys.length > 1 && (
                      <button
                        type="button"
                        className={smallAction}
                        aria-pressed={groupSelected}
                        onClick={() => setBookletsSelected((current) => withSelection(current, keys, !groupSelected))}
                      >
                        {group} 전체
                      </button>
                    )}
                    <div className={group ? "grid gap-2" : "flex flex-wrap gap-2"}>
                      {groupBooklets.map(({ bookletKey, bookletLabel, subjects, year }) => (
                        <label key={bookletKey} className={optionStyle}>
                          <input
                            type="checkbox"
                            className="size-4 shrink-0 accent-[#0066d6]"
                            checked={bookletsSelected.has(bookletKey)}
                            onChange={(event) => {
                              const checked = event.target.checked;
                              setBookletsSelected((current) => withSelection(current, [bookletKey], checked));
                            }}
                          />
                          <span>
                            {bookletLabel && (
                              <span className="block font-medium">
                                {bookletLabel}{bookletLabel === "2차 통합 시험지" && ` · ${year}년`}
                              </span>
                            )}
                            <span className={bookletLabel ? "block text-xs text-fog" : undefined}>
                              {subjects.map(({ label }) => label).join(" · ")}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </fieldset>

          <fieldset disabled={busy} className="border-t border-mist pt-3">
            <legend className="relative top-2 bg-paper pr-2 font-display font-semibold text-ink">연도</legend>
            <div className="flex flex-wrap gap-2">
              {yearModes.map(({ value, label }) => (
                <label key={value} className={optionStyle}>
                  <input type="radio" name={yearModeName} className="size-4 accent-[#0066d6]" checked={yearMode === value} onChange={() => setYearMode(value)} />
                  {label}
                </label>
              ))}
            </div>
            {yearMode === "pick" && (
              <div className="mt-3 flex flex-wrap gap-2">
                {[...years].reverse().map((year) => (
                  <label key={year} className={optionStyle}>
                    <input
                      type="checkbox"
                      className="size-4 accent-[#0066d6]"
                      checked={yearsSelected.has(year)}
                      onChange={(event) => {
                        const checked = event.target.checked;
                        setYearsSelected((current) => withSelection(current, [year], checked));
                      }}
                    />
                    {year}년
                  </label>
                ))}
              </div>
            )}
            {yearMode === "range" && (
              <div className="mt-3 grid max-w-md grid-cols-2 gap-3">
                <label className="text-sm font-medium text-ink">
                  시작 연도
                  <select className={selectStyle} value={startYear} onChange={(event) => setStartYear(Number(event.target.value))}>
                    {years.filter((year) => year <= endYear).map((year) => <option key={year} value={year}>{year}년</option>)}
                  </select>
                </label>
                <label className="text-sm font-medium text-ink">
                  끝 연도
                  <select className={selectStyle} value={endYear} onChange={(event) => setEndYear(Number(event.target.value))}>
                    {years.filter((year) => year >= startYear).map((year) => <option key={year} value={year}>{year}년</option>)}
                  </select>
                </label>
              </div>
            )}
          </fieldset>

          {showSessionPicker && (
            <fieldset disabled={busy} className="border-t border-mist pt-3">
              <legend className="relative top-2 bg-paper pr-2 font-display font-semibold text-ink">회차·구분</legend>
              {hasExcludedSessions && (
                <button type="button" className={smallAction} onClick={() =>
                  setExcludedSessions((current) => withSelection(current, sessionKeys, false))}>
                  회차 전체 선택
                </button>
              )}
              <div className="grid max-h-72 gap-2 overflow-y-auto sm:grid-cols-2">
                {sessionsByYear.map(({ year, sessions }) => (
                  <div key={year} role="group" aria-label={`${year}년 회차`} className="rounded-xl border border-mist bg-slate-50 p-2.5">
                    <p aria-hidden="true" className="mb-1.5 text-sm font-semibold text-ink">{year}년</p>
                    <div className="flex flex-wrap gap-2">
                      {sessions.map((session) => {
                        const sessionKey = examPrintSessionKey(year, session);
                        return (
                          <label key={sessionKey} className={optionStyle}>
                            <input
                              type="checkbox"
                              className="size-4 shrink-0 accent-[#0066d6]"
                              checked={!excludedSessions.has(sessionKey)}
                              onChange={(event) => {
                                const checked = event.target.checked;
                                setExcludedSessions((current) => withSelection(current, [sessionKey], !checked));
                              }}
                            />
                            {session}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          )}

          {matching.length > 0 && (
            <details className="rounded-xl border border-mist bg-slate-50 px-3">
              <summary className="min-h-11 cursor-pointer py-2.5 text-sm font-semibold leading-6 text-ink">
                회차별 시험지 보기 · {included.length}개 선택
              </summary>
              <fieldset disabled={busy} aria-label="묶을 시험지" className="max-h-72 overflow-y-auto border-t border-mist py-1">
                {matching.map(({ file, year, session, subjects }) => (
                  <label key={file} className="flex min-h-11 cursor-pointer items-start gap-2 py-2 text-sm text-ink">
                    <input
                      type="checkbox"
                      className="mt-1 size-4 shrink-0 accent-[#0066d6]"
                      checked={!excluded.has(file)}
                      onChange={(event) => {
                        const checked = event.target.checked;
                        setExcluded((current) => withSelection(current, [file], !checked));
                      }}
                    />
                    <span className="min-w-0">
                      <span className="block font-medium">{year}년 {session}</span>
                      <span className="block text-fog">{subjects.map(({ label }) => label).join(", ")}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
            </details>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-mist bg-slate-50 px-4 py-3 sm:px-5">
          <div role="status" className="min-w-0 text-sm text-fog">
            {included.length > 0 ? (
              <>
                <p className="font-semibold text-ink">시험지 {included.length}개{ready ? ` · ${ready.pages}쪽` : ""}</p>
                <p>오래된 연도부터 한 PDF로 묶어요.</p>
              </>
            ) : (
              <p>{emptyMessage}</p>
            )}
          </div>
          {busy ? (
            <div className="flex flex-wrap items-center gap-2">
              <span role="status" className="text-sm text-ink">{progress === included.length ? "PDF 저장 준비 중…" : `PDF 만드는 중 · ${progress}/${included.length}`}</span>
              <button type="button" className={examPrintSecondaryAction} onClick={stop}>취소</button>
            </div>
          ) : (
            <button type="button" disabled={!included.length} className={examPrintPrimaryAction} onClick={merge}>
              묶음 PDF 만들기
            </button>
          )}
          {error && <p role="alert" className="basis-full text-sm text-rose-700">PDF를 묶지 못했어요. 다시 시도해 주세요.</p>}
        </div>
      </section>
      {ready && (
        <ExamPrintPreview
          key={ready.href}
          title={ready.title}
          href={ready.href}
          fileName={`${ready.title}.pdf`}
          generatedFile={ready.file}
          details={`시험지 ${included.length}개 · ${ready.pages}쪽`}
        />
      )}
    </>
  );
}
