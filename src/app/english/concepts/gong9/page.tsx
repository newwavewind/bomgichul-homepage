import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { BackLink } from "@/components/ui/BackLink";
import {
  EnglishSyntaxBrowser,
  ViewTabs,
} from "@/components/english/EnglishSyntaxBrowser";
import {
  ENGLISH_SYNTAX_GROUPS,
  getEnglishSyntaxCardsForUnit,
} from "@/lib/english-syntax";
import { buildPageMetadata } from "@/lib/seo";
import "@/app/concepts/concepts-ui.css";
import "@/styles/concepts/conceptsEbook.css";

export const metadata: Metadata = buildPageMetadata({
  title: "공무원 영어 구문 올인원 1,050문장",
  description:
    "2017~2026 국가직·지방직 9급 영어 기출 1,050문장을 구문별·통합 번호순으로 정리했습니다. 문장 성분, 직독직해, 문법 함정과 어휘를 함께 학습하세요.",
  path: "/english/concepts/gong9",
});

/*
 * 이 페이지는 searchParams 를 읽지 않는다 — 읽는 순간 동적 렌더가 되어 CDN
 * 캐시가 죽기 때문이다. 기본 화면(구문별 목차)은 여기서 정적으로 그리고,
 * 쿼리가 붙는 화면(?unit= 단원 보기, ?view=number 번호순)은 클라이언트의
 * EnglishSyntaxBrowser 가 useSearchParams 로 읽어 API 에서 조각을 받아 그린다.
 */

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

export default function EnglishSyntaxPage() {
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
        {/* 정적 HTML(폴백)에도 구문별 목차 전문이 실리도록, 폴백과 children 이
            같은 목차를 그린다 — 크롤러는 폴백을 읽는다. */}
        <Suspense
          fallback={
            <>
              <ViewTabs view="group" />
              <GroupIndex />
            </>
          }
        >
          <EnglishSyntaxBrowser>
            <GroupIndex />
          </EnglishSyntaxBrowser>
        </Suspense>
      </div>
    </div>
  );
}
