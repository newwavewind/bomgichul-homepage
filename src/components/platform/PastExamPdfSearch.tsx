"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  PAST_EXAM_SCOPE_OPTIONS,
  type PastExamPdfGroup,
} from "@/lib/past-exam-search-shared";

const SUGGESTIONS = [
  "2025 행정법",
  "2025 공인중개사 1차",
  "주택관리사 1차",
  "경찰 2025",
  "사회복지사",
  "공무원 영어 국가직",
  "한국사 심화",
] as const;

type Status = "idle" | "loading" | "ready" | "error";

export function PastExamPdfSearch() {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [scope, setScope] = useState<(typeof PAST_EXAM_SCOPE_OPTIONS)[number]["value"]>("all");
  const [items, setItems] = useState<PastExamPdfGroup[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQ(query.trim()), 220);
    return () => window.clearTimeout(t);
  }, [query]);

  const load = useCallback(async (q: string, nextScope: typeof scope) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("loading");
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (nextScope !== "all") params.set("scope", nextScope);
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
  }, []);

  useEffect(() => {
    void load(debouncedQ, scope);
  }, [debouncedQ, scope, load]);

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
          공무원·공인중개사·주택관리사 등 전 시험을 한곳에서 검색하세요. 로그인 없이 받을 수 있습니다.
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
            placeholder="예: 2025 행정법, 공인중개사 1차, 주택관리사"
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

      <div className="mt-3 flex flex-wrap gap-1.5" role="list" aria-label="시험 선택">
        {PAST_EXAM_SCOPE_OPTIONS.map((opt) => {
          const active = scope === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="listitem"
              onClick={() => setScope(opt.value)}
              className={`rounded-full px-3 py-1.5 font-display text-[12px] font-semibold transition-colors ${
                active
                  ? "bg-[#007AFF] text-white"
                  : "bg-paper/80 text-slate-600 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.08)] hover:bg-white"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {!query ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((hint) => (
            <button
              key={hint}
              type="button"
              onClick={() => setQuery(hint)}
              className="rounded-full bg-white/70 px-3 py-1 font-display text-[12px] font-medium text-slate-600 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] hover:bg-white"
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
            {debouncedQ ? `"${debouncedQ}"에 맞는 기출 PDF가 없어요.` : "등록된 기출 PDF가 아직 없어요."}
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
                    {item.year ? ` · ${item.year}년` : ""}
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
                      className={`inline-flex min-h-10 items-center rounded-full px-4 font-display text-[13px] font-semibold transition-colors ${
                        file.kind === "question"
                          ? "bg-[#007AFF] text-white hover:bg-[#0066D6]"
                          : file.kind === "answer"
                            ? "bg-slate-800 text-white hover:bg-slate-700"
                            : "bg-surface text-ink hover:bg-snow"
                      }`}
                    >
                      {file.kindLabel} 받기
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
