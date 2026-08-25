import Link from "next/link";
import type { Metadata } from "next";
import { BackLink } from "@/components/ui/BackLink";
import {
  ENGLISH_SYNTAX_CARDS,
  ENGLISH_SYNTAX_GROUPS,
  ENGLISH_SYNTAX_UNIT_MAP,
  getEnglishSyntaxCardsForUnit,
} from "@/lib/english-syntax";
import { buildPageMetadata } from "@/lib/seo";
import { getUnitNote } from "@/data/english/syntax-notes";
import "@/app/concepts/concepts-ui.css";
import "@/styles/concepts/conceptsEbook.css";

export const metadata: Metadata = buildPageMetadata({
  title: "공무원 영어 구문 올인원 1,050문장",
  description:
    "2017~2026 국가직·지방직 9급 영어 기출 1,050문장을 구문별·통합 번호순으로 정리했습니다. 문장 성분, 직독직해, 문법 함정과 어휘를 함께 학습하세요.",
  path: "/english/concepts/gong9",
});

type SearchParams = Promise<{ view?: string; page?: string; unit?: string }>;

function ViewTabs({ view }: { view: "group" | "number" }) {
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

function CardList({
  cards,
}: {
  cards: ReturnType<typeof getEnglishSyntaxCardsForUnit>;
}) {
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

function GroupIndex() {
  return (
    <div className="space-y-5">
      {ENGLISH_SYNTAX_GROUPS.map((group) => {
        const unitCounts = group.units.map((unit) => ({
          unit,
          count: getEnglishSyntaxCardsForUnit(unit.id).length,
        }));
        const groupCount = unitCounts.reduce((sum, row) => sum + row.count, 0);
        return (
          <section
            key={group.id}
            className="rounded-3xl border border-mist bg-white p-5 shadow-[var(--shadow-subtle)]"
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-ios-blue/10 font-display text-body-sm font-bold text-ios-blue">
                {String(group.no).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-display text-subheading font-semibold text-ink">
                  {group.name}
                </h2>
                <p className="mt-1 font-display text-body-sm text-fog">
                  {group.hint} · {groupCount}문장
                </p>
              </div>
            </div>
            <ul className="mt-5 space-y-2">
              {unitCounts.map(({ unit, count }) => {
                if (!count) return null;
                return (
                  <li key={unit.id}>
                    <Link
                      href={`/english/concepts/gong9?unit=${encodeURIComponent(unit.id)}`}
                      className="flex items-start justify-between gap-3 rounded-2xl border border-mist bg-surface px-4 py-3 transition-colors hover:border-carbon"
                    >
                      <span>
                        <span className="font-display text-body font-semibold text-ink">
                          {unit.name}
                        </span>
                        <span className="mt-1 block font-normal text-body-sm leading-6 text-smoke">
                          {unit.desc}
                        </span>
                      </span>
                      <span className="shrink-0 font-display text-[12px] font-semibold text-fog">
                        {count} →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function UnitView({ unitId }: { unitId: string }) {
  const mapped = ENGLISH_SYNTAX_UNIT_MAP.get(unitId);
  if (!mapped) {
    return (
      <div className="rounded-3xl border border-mist bg-white p-6">
        <p className="font-display text-body text-smoke">해당 구문을 찾을 수 없어요.</p>
        <Link
          href="/english/concepts/gong9"
          className="mt-4 inline-flex font-display text-body-sm font-semibold text-ios-blue"
        >
          ← 구문별 목록
        </Link>
      </div>
    );
  }

  const { group, unit } = mapped;
  const cards = getEnglishSyntaxCardsForUnit(unit.id);
  const note = getUnitNote(unit.id);
  const focuses = [...new Set(cards.flatMap((card) => card.focus ?? []))];

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
            {String(note.summary).replace(/\*\*/g, "")}
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

function NumberView({ page }: { page: number }) {
  const pageSize = 50;
  const pages = Math.ceil(ENGLISH_SYNTAX_CARDS.length / pageSize);
  const currentPage = Math.min(Math.max(1, page), pages);
  const shown = ENGLISH_SYNTAX_CARDS.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div>
      <div className="rounded-3xl border border-mist bg-white px-5 shadow-[var(--shadow-subtle)]">
        <ul className="divide-y divide-mist">
          {shown.map((card) => (
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

export default async function EnglishSyntaxPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const view = query.view === "number" ? "number" : "group";
  const unitId = typeof query.unit === "string" && query.unit ? query.unit : null;
  const page = Math.max(1, Number(query.page) || 1);

  return (
    <div className="hp-cx px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <BackLink href="/english">영어 학습 홈</BackLink>
        <header className="mt-6 border-b border-mist pb-8">
          <p className="font-display text-[12px] font-semibold text-ios-blue">
            9급 국가직·지방직 통합
          </p>
          <h1 className="mt-2 font-display text-heading font-semibold text-ink">
            구문 <span className="text-ios-blue">올인원</span>
          </h1>
          <p className="mt-3 max-w-3xl font-system text-body leading-7 text-smoke">
            기출 문장 1,050개를 한 문장씩 문장 성분·직독직해·문법·어휘로 나눴습니다. 번호는
            국가직과 지방직을 연도순으로 합친 앱의 최신 통합 번호와 같습니다.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-paper px-3 py-1.5 font-display text-body-sm font-semibold text-ink">
              1,050 문장
            </span>
            <span className="rounded-full bg-paper px-3 py-1.5 font-display text-body-sm font-semibold text-ink">
              {ENGLISH_SYNTAX_GROUPS.reduce((sum, group) => sum + group.units.length, 0)} 구문
            </span>
          </div>
        </header>
        <ViewTabs view={view} />
        {view === "number" ? (
          <NumberView page={page} />
        ) : unitId ? (
          <UnitView unitId={unitId} />
        ) : (
          <GroupIndex />
        )}
      </div>
    </div>
  );
}
