"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

/*
 * 구문 올인원의 쿼리 화면(단원 보기·번호순 보기).
 *
 * 페이지가 searchParams 를 읽으면 통째로 동적 렌더가 되어 CDN 캐시가 죽는다.
 * 그래서 기본 화면(구문별 목차)은 서버가 정적으로 그려 children 으로 받고,
 * 쿼리가 붙은 화면만 여기서 /api/exam-track/english-syntax 로 조각을 받아
 * 그린다(원본이 2.7MB 라 클라이언트 번들에 담을 수 없다).
 * 페이지 쪽에서는 반드시 <Suspense> 로 감싼다 — useSearchParams 규칙.
 */

type SyntaxCardSummary = { id: string; no: number; sentence: string; seriesLabel: string };
type UnitPayload = {
  kind: "unit";
  group: { no: number; name: string };
  unit: { id: string; name: string; desc: string };
  note: { title: string; summary: string } | null;
  focuses: string[];
  cards: SyntaxCardSummary[];
};
type NumberPayload = { kind: "number"; page: number; pages: number; cards: SyntaxCardSummary[] };
type Payload = UnitPayload | NumberPayload;

export function ViewTabs({ view }: { view: "group" | "number" }) {
  return (
    <nav className="my-7 flex gap-2" aria-label="구문 보기 방식">
      <Link
        href="/english/concepts/gong9"
        className={`rounded-full px-4 py-2 font-display text-body-sm font-semibold ${
          view === "group" ? "bg-ios-blue text-white" : "bg-paper text-smoke"
        }`}
      >
        구문별
      </Link>
      <Link
        href="/english/concepts/gong9?view=number&page=1"
        className={`rounded-full px-4 py-2 font-display text-body-sm font-semibold ${
          view === "number" ? "bg-ios-blue text-white" : "bg-paper text-smoke"
        }`}
      >
        번호순
      </Link>
    </nav>
  );
}

function CardList({ cards }: { cards: SyntaxCardSummary[] }) {
  return (
    <ul className="divide-y divide-mist">
      {cards.map((card) => (
        <li key={card.id}>
          <Link
            href={`/english/concepts/gong9/${encodeURIComponent(card.id)}`}
            className="flex gap-3 py-3"
          >
            <span className="font-display text-[12px] font-semibold text-ios-blue">
              {String(card.no).padStart(4, "0")}
            </span>
            <span className="font-system text-body-sm leading-6 text-ink">
              {card.sentence}{" "}
              <em className="not-italic text-fog">{card.seriesLabel}</em>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function UnitView({ payload }: { payload: UnitPayload }) {
  const { group, unit, note, focuses, cards } = payload;
  return (
    <section className="rounded-3xl border border-mist bg-white p-5 shadow-[var(--shadow-subtle)]">
      <Link
        href="/english/concepts/gong9"
        className="font-display text-body-sm font-semibold text-ios-blue"
      >
        ← 구문별 목록
      </Link>
      <p className="mt-4 font-display text-[12px] font-semibold text-fog">
        {String(group.no).padStart(2, "0")} · {group.name}
      </p>
      <h2 className="mt-2 font-display text-subheading font-semibold text-ink">
        {unit.name}
      </h2>
      <p className="mt-2 font-system text-body-sm leading-6 text-smoke">{unit.desc}</p>
      <p className="mt-2 font-display text-body-sm text-fog">{cards.length}문장</p>
      {note ? (
        <div className="mt-4 rounded-2xl border border-ios-blue/15 bg-ios-blue/5 p-4">
          <h3 className="font-display text-body font-semibold text-ink">{note.title}</h3>
          <p className="mt-2 font-system text-body-sm leading-6 text-smoke">
            {note.summary.replace(/\*\*/g, "")}
          </p>
        </div>
      ) : null}
      {focuses.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {focuses.map((focus) => (
            <span
              key={focus}
              className="rounded-full border border-mist bg-white px-2.5 py-1 font-display text-[11px] text-smoke"
            >
              {focus}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-4 rounded-2xl border border-mist bg-surface px-4">
        <CardList cards={cards} />
      </div>
    </section>
  );
}

function NumberView({ payload }: { payload: NumberPayload }) {
  const { page: currentPage, pages, cards } = payload;
  return (
    <div>
      <div className="rounded-3xl border border-mist bg-white px-5 shadow-[var(--shadow-subtle)]">
        <ul className="divide-y divide-mist">
          {cards.map((card) => (
            <li key={card.id}>
              <Link
                href={`/english/concepts/gong9/${encodeURIComponent(card.id)}`}
                className="flex gap-4 py-4"
              >
                <span className="min-w-10 font-display text-body-sm font-semibold text-ios-blue">
                  {card.no}
                </span>
                <span className="font-system text-body leading-7 text-ink">
                  {card.sentence}{" "}
                  <em className="not-italic text-[12px] text-fog">{card.seriesLabel}</em>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <nav className="mt-6 flex items-center justify-center gap-3">
        <Link
          aria-disabled={currentPage <= 1}
          className={`rounded-full border px-4 py-2 font-display text-body-sm ${
            currentPage <= 1
              ? "pointer-events-none border-mist text-fog"
              : "border-ios-blue text-ios-blue"
          }`}
          href={`/english/concepts/gong9?view=number&page=${Math.max(1, currentPage - 1)}`}
        >
          ← 이전
        </Link>
        <span className="font-display text-body-sm text-smoke">
          {currentPage} / {pages}
        </span>
        <Link
          aria-disabled={currentPage >= pages}
          className={`rounded-full border px-4 py-2 font-display text-body-sm ${
            currentPage >= pages
              ? "pointer-events-none border-mist text-fog"
              : "border-ios-blue text-ios-blue"
          }`}
          href={`/english/concepts/gong9?view=number&page=${Math.min(pages, currentPage + 1)}`}
        >
          다음 →
        </Link>
      </nav>
    </div>
  );
}

export function EnglishSyntaxBrowser({ children }: { children: React.ReactNode }) {
  const query = useSearchParams();
  const showNumber = query.get("view") === "number";
  const unitId = !showNumber && query.get("unit") ? query.get("unit") : null;
  const page = Math.max(1, Number(query.get("page")) || 1);
  const requestKey = unitId
    ? `unit=${encodeURIComponent(unitId)}`
    : showNumber
      ? `page=${page}`
      : null;

  const [result, setResult] = useState<{ key: string; payload: Payload | null } | null>(null);

  useEffect(() => {
    if (!requestKey) return;
    let alive = true;
    void fetch(`/api/exam-track/english-syntax?${requestKey}`)
      .then(async (res) => (res.ok ? ((await res.json()) as Payload) : null))
      .catch(() => null)
      .then((payload) => {
        if (alive) setResult({ key: requestKey, payload });
      });
    return () => {
      alive = false;
    };
  }, [requestKey]);

  // 쿼리가 없으면 서버가 정적으로 그려 준 구문별 목차를 그대로 보인다.
  if (!requestKey) {
    return (
      <>
        <ViewTabs view="group" />
        {children}
      </>
    );
  }

  const loaded = result?.key === requestKey ? result.payload : undefined;
  return (
    <>
      <ViewTabs view={showNumber ? "number" : "group"} />
      {loaded === undefined ? (
        <div className="rounded-3xl border border-mist bg-white p-6">
          <p className="font-display text-body text-smoke">문장을 불러오는 중…</p>
        </div>
      ) : loaded === null || (unitId && loaded.kind !== "unit") ? (
        <div className="rounded-3xl border border-mist bg-white p-6">
          <p className="font-display text-body text-smoke">해당 구문을 찾을 수 없어요.</p>
          <Link
            href="/english/concepts/gong9"
            className="mt-4 inline-flex font-display text-body-sm font-semibold text-ios-blue"
          >
            ← 구문별 목록
          </Link>
        </div>
      ) : loaded.kind === "unit" ? (
        <UnitView payload={loaded} />
      ) : (
        <NumberView payload={loaded} />
      )}
    </>
  );
}
