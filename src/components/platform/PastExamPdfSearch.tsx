"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import {
  PAST_EXAM_SCOPE_OPTIONS,
  PAST_EXAM_YEAR_OPTIONS,
  PAST_EXAM_ROUND_OPTIONS,
  type PastExamPdfGroup,
} from "@/lib/past-exam-search-shared";

type SearchResult = { key: string; items: PastExamPdfGroup[]; status: "ready" | "error" };

function chipClass(active: boolean) {
  return `rounded-xl px-3 py-1.5 font-display text-[12px] font-semibold transition-colors ${
    active
      ? "bg-[#007AFF] text-white"
      : "border border-slate-200/90 bg-white text-slate-600 hover:border-[#007AFF]/35 hover:text-[color:light-dark(#0066D6,var(--color-carbon))] dark:hover:text-carbon"
  }`;
}

/** 그룹 헤더에 이미 있는 연도·회차·시험명을 빼고 과목·교시만 남긴다. */
function itemTitle(item: PastExamPdfGroup): string {
  let rest = item.label
    .replace(/^\d{4}년\s*/, "")
    .replace(/제?\d{1,3}회\s*/, "")
    .replace(item.scopeLabel, "")
    .replace(/^[·•\s]+/, "")
    .trim();

  const period = rest.match(/\((\d+교시)\)/)?.[1] ?? null;
  const subject =
    [...rest.matchAll(/\(([^)]+)\)/g)]
      .map((m) => m[1])
      .find((s) => !/^\d+교시$/.test(s)) ?? null;

  if (period && subject) return `${period} · ${subject}`;
  if (period) {
    if (/시험지|문제/.test(rest)) return `${period} · 시험지`;
    if (/정답/.test(rest)) return `${period} · 정답`;
    return period;
  }

  rest = rest.replace(/_/g, " · ").replace(/\s+/g, " ").trim();
  return rest || item.label;
}

function displayFileName(name: string): string {
  return name.replace(/^[★☆✦\s]+/, "").trim();
}

function groupMeta(rows: PastExamPdfGroup[]): string {
  const head = rows[0];
  const bits = [
    head.year != null ? `${head.year}년` : null,
    head.round != null ? `${head.round}회` : null,
    `자료 ${rows.reduce((n, item) => n + item.files.length, 0)}개`,
  ].filter(Boolean);
  return bits.join(" · ");
}

export function PastExamPdfSearch() {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [scope, setScope] = useState<(typeof PAST_EXAM_SCOPE_OPTIONS)[number]["value"]>("all");
  const [year, setYear] = useState<number | null>(null);
  const [round, setRound] = useState<number | null>(null);
  const [result, setResult] = useState<SearchResult | null>(null);
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

  const params = new URLSearchParams();
  if (debouncedQ) params.set("q", debouncedQ);
  if (scope !== "all") params.set("scope", scope);
  if (isHistory && round) params.set("round", String(round));
  if (!isHistory && year) params.set("year", String(year));
  const searchKey = params.toString();

  useEffect(() => {
    const controller = new AbortController();
    void fetch(`/api/past-exam-pdfs?${searchKey}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(String(response.status));
        const body = (await response.json()) as { items: PastExamPdfGroup[] };
        if (!controller.signal.aborted) {
          setResult({ key: searchKey, items: body.items ?? [], status: "ready" });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setResult({ key: searchKey, items: [], status: "error" });
        }
      });
    return () => controller.abort();
  }, [searchKey]);

  const currentResult = result?.key === searchKey ? result : null;
  const items = currentResult?.items ?? [];
  const status = currentResult?.status ?? "loading";
  const groups = new Map<string, PastExamPdfGroup[]>();
  for (const item of items) { const key = `${item.scope}:${item.round ?? item.year ?? item.key}`; groups.set(key, [...(groups.get(key) ?? []), item]); }
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
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 rounded-[28px] border-[1.5px] border-carbon/15 bg-gradient-to-br from-[color:light-dark(#f7fbff,var(--color-paper))] to-[color:light-dark(#eef5ff,color-mix(in_srgb,var(--color-paper)_90%,#eef5ff))]/70 p-5 dark:from-surface dark:to-paper shadow-[var(--shadow-card)] md:p-8"
      aria-label="기출 문제·정답 PDF"
    >
      <div className="max-w-2xl">
        <p className="font-display text-[13px] font-semibold tracking-[0.05em] text-[color:light-dark(#0A84FF,var(--color-carbon))] dark:text-carbon">
          기출 원본 PDF
        </p>
        <h2 className="mt-1 font-display text-[24px] font-semibold tracking-tight text-ink md:text-[28px]">
          문제·정답 바로 받기
        </h2>
        <p className="mt-1 font-display text-[13px] text-smoke">
          시험·연도를 고르거나 검색해서 받으세요. 로그인 없이 받을 수 있습니다.
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
          <ul className="web-pdf-groups overflow-hidden rounded-2xl border border-mist/70 bg-paper">
            {[...groups.entries()].map(([key, rows], index) => (
              <li key={key} className="web-pdf-group">
                <details open={index === 0}>
                  <summary className="web-pdf-group__summary">
                    <span className="web-pdf-group__exam">{rows[0].scopeLabel}</span>
                    <span className="web-pdf-group__meta">{groupMeta(rows)}</span>
                  </summary>

                  <ul className="web-pdf-list">
                    {rows.flatMap((item) =>
                      item.files.map((file) => (
                        <li
                          key={`${item.key}:${file.postId}:${file.fileName}`}
                          className="web-pdf-row"
                        >
                          <div className="web-pdf-row__body">
                            <div className="web-pdf-row__top">
                              <p className="web-pdf-row__title">{itemTitle(item)}</p>
                              <span
                                className={`web-pdf-row__kind web-pdf-row__kind--${file.kind}`}
                              >
                                {file.kindLabel}
                              </span>
                            </div>
                            <p className="web-pdf-row__filename" title={file.fileName}>
                              {displayFileName(file.fileName)}
                            </p>
                          </div>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={file.fileName}
                            className="web-pdf-row__dl"
                          >
                            받기
                          </a>
                        </li>
                      )),
                    )}
                  </ul>

                  <Link
                    href={
                      rows[0].scope === "real_estate"
                        ? "/real-estate"
                        : `/${rows[0].scope.replaceAll("_", "-")}`
                    }
                    className="web-pdf-group__more"
                  >
                    이 시험 웹 기출 보기 →
                  </Link>
                </details>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
