"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  PAST_EXAM_SCOPE_OPTIONS,
  PAST_EXAM_YEAR_OPTIONS,
  PAST_EXAM_ROUND_OPTIONS,
  type PastExamPdfGroup,
} from "@/lib/past-exam-search-shared";

const SUGGESTIONS = [
  "행정법",
  "공인중개사 1차",
  "주택관리사 1차",
  "경찰",
  "사회복지사",
  "공무원 영어 국가직",
  "한국사 심화",
] as const;

type Status = "idle" | "loading" | "ready" | "error";

function chipClass(active: boolean) {
  return `rounded-xl px-3 py-1.5 font-display text-[12px] font-semibold transition-colors ${
    active
      ? "bg-[#007AFF] text-white"
      : "border border-slate-200/90 bg-white text-slate-600 hover:border-[#007AFF]/35 hover:text-[#0066D6]"
  }`;
}

export function PastExamPdfSearch() {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [scope, setScope] = useState<(typeof PAST_EXAM_SCOPE_OPTIONS)[number]["value"]>("all");
  const [year, setYear] = useState<number | null>(null);
  const [round, setRound] = useState<number | null>(null);
  const [items, setItems] = useState<PastExamPdfGroup[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const abortRef = useRef<AbortController | null>(null);
  const isHistory = scope === "history";

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQ(query.trim()), 220);
    return () => window.clearTimeout(t);
  }, [query]);

  const selectScope = (next: typeof scope) => {
    setScope(next);
    if (next === "history") {
      setYear(null);
    } else {
      setRound(null);
    }
  };

  const load = useCallback(
    async (
      q: string,
      nextScope: typeof scope,
      nextYear: number | null,
      nextRound: number | null,
    ) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setStatus("loading");
      try {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (nextScope !== "all") params.set("scope", nextScope);
        if (nextScope === "history") {
          if (nextRound) params.set("round", String(nextRound));
        } else if (nextYear) {
          params.set("year", String(nextYear));
        }
        const res = await fetch(`/api/past-exam-pdfs?${params}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
        const body = (await res.json()) as { items: PastExamPdfGroup[] };
        setItems(body.items ?? []);
        setStatus("ready");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setItems([]);
        setStatus("error");
      }
    },
    [],
  );

  useEffect(() => {
    void load(debouncedQ, scope, year, round);
  }, [debouncedQ, scope, year, round, load]);

  const emptyHint =
    [
      isHistory ? (round ? `${round}회` : null) : year ? `${year}년` : null,
      scope !== "all" ? PAST_EXAM_SCOPE_OPTIONS.find((o) => o.value === scope)?.label : null,
      debouncedQ || null,
    ]
      .filter(Boolean)
      .join(" · ") || null;

  return (
    <section
      id="past-exam-pdfs"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 rounded-[28px] border-[1.5px] border-carbon/15 bg-gradient-to-br from-[#f7fbff] to-[#eef5ff]/70 p-5 shadow-[var(--shadow-card)] md:p-8"
      aria-label="기출 문제·정답 PDF"
    >
      <div className="max-w-2xl">
        <p className="font-display text-[13px] font-semibold tracking-[0.05em] text-[#0A84FF]">
          기출 원본 PDF
        </p>
        <h2 className="mt-1 font-display text-[24px] font-semibold tracking-tight text-ink md:text-[28px]">
          문제·정답 바로 받기
        </h2>
        <p className="mt-1 font-display text-[13px] text-smoke">
          시험·연도(한국사는 회차)를 고르거나 검색해서 받으세요. 로그인 없이 받을 수 있습니다.
        </p>
      </div>

      <div className="mt-5">
        <label htmlFor={inputId} className="sr-only">
          기출 PDF 검색
        </label>
        <div className="flex items-center gap-2 rounded-2xl border border-carbon/15 bg-paper px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
          <span className="font-display text-[15px] text-fog" aria-hidden>
            ⌕
          </span>
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 행정법, 공인중개사 1차, 79회"
            className="min-w-0 flex-1 bg-transparent font-display text-[16px] text-ink outline-none placeholder:text-fog"
            autoComplete="off"
            enterKeyHint="search"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="shrink-0 font-display text-[12px] font-semibold text-fog hover:text-ink"
            >
              지우기
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        <div className="flex flex-wrap gap-1.5" role="list" aria-label="시험 선택">
          {PAST_EXAM_SCOPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="listitem"
              onClick={() => selectScope(opt.value)}
              className={chipClass(scope === opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {isHistory ? (
          <div className="flex flex-wrap gap-1.5" role="list" aria-label="회차 선택">
            <button
              type="button"
              role="listitem"
              onClick={() => setRound(null)}
              className={chipClass(round === null)}
            >
              전체 회차
            </button>
            {PAST_EXAM_ROUND_OPTIONS.map((r) => (
              <button
                key={r}
                type="button"
                role="listitem"
                onClick={() => setRound(r)}
                className={chipClass(round === r)}
              >
                {r}회
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5" role="list" aria-label="연도 선택">
            <button
              type="button"
              role="listitem"
              onClick={() => setYear(null)}
              className={chipClass(year === null)}
            >
              전체 연도
            </button>
            {PAST_EXAM_YEAR_OPTIONS.map((y) => (
              <button
                key={y}
                type="button"
                role="listitem"
                onClick={() => setYear(y)}
                className={chipClass(year === y)}
              >
                {y}년
              </button>
            ))}
          </div>
        )}
      </div>

      {!query ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((hint) => (
            <button
              key={hint}
              type="button"
              onClick={() => setQuery(hint)}
              className="rounded-xl border border-slate-200/80 bg-white/70 px-3 py-1 font-display text-[12px] font-medium text-slate-600 hover:bg-white"
            >
              {hint}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-5" aria-live="polite">
        {status === "loading" ? (
          <p className="font-display text-[13px] text-fog">찾는 중…</p>
        ) : null}
        {status === "error" ? (
          <p className="font-display text-[13px] text-smoke">검색에 실패했어요. 잠시 후 다시 시도해 주세요.</p>
        ) : null}
        {status === "ready" && items.length === 0 ? (
          <p className="font-display text-[13px] text-smoke">
            {emptyHint ? `"${emptyHint}"에 맞는 기출 PDF가 없어요.` : "등록된 기출 PDF가 아직 없어요."}
          </p>
        ) : null}

        {items.length > 0 ? (
          <ul className="divide-y divide-mist/80 overflow-hidden rounded-2xl border border-mist/70 bg-paper">
            {items.map((item) => (
              <li
                key={item.key}
                className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-display text-[11px] font-semibold tracking-wide text-fog">
                    {item.scopeLabel}
                    {item.round ? ` · ${item.round}회` : item.year ? ` · ${item.year}년` : ""}
                  </p>
                  <p className="mt-0.5 truncate font-display text-[15px] font-semibold text-ink">
                    {item.label}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.files.map((file) => (
                    <a
                      key={`${file.postId}-${file.kind}-${file.fileName}`}
                      href={file.url}
                      download={file.fileName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex h-9 items-center rounded-xl px-3 font-display text-[13px] font-medium transition-colors ${
                        file.kind === "question"
                          ? "border border-[#007AFF]/35 bg-[#007AFF]/[0.08] text-[#0066D6] hover:bg-[#007AFF]/[0.14]"
                          : file.kind === "answer"
                            ? "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                            : "border border-mist bg-surface text-ink hover:bg-snow"
                      }`}
                    >
                      {file.kindLabel} 받기 ↓
                    </a>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
