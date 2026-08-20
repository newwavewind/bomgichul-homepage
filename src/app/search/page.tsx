import type { Metadata } from "next";
import Link from "next/link";
import { searchAllQuestions } from "@/lib/global-search";

export const metadata: Metadata = { title: "기출문제 통합 검색", description: "시험·과목·연도·문항 번호로 봄기출 전체 기출문제를 검색하세요." };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = (await searchParams).q?.trim() ?? "";
  const results = searchAllQuestions(q);
  return <main className="px-4 py-10"><div className="mx-auto max-w-4xl">
    <h1 className="font-display text-heading font-semibold text-ink">기출문제 통합 검색</h1>
    <form action="/search" className="mt-6 flex gap-2">
      <label htmlFor="global-search" className="sr-only">시험·과목·연도·문항 검색</label>
      <input id="global-search" name="q" defaultValue={q} placeholder="예: 민법 25년 49번" className="min-h-12 min-w-0 flex-1 rounded-2xl border border-carbon bg-paper px-4 font-display text-body text-ink outline-none focus:ring-2 focus:ring-ios-blue/25" />
      <button className="min-h-12 rounded-2xl bg-carbon px-6 font-display text-body-sm font-semibold text-paper">검색</button>
    </form>
    {q ? <p className="mt-5 font-display text-body-sm text-smoke">‘{q}’ 검색 결과 {results.length}건</p> : <p className="mt-5 font-display text-body-sm text-smoke">과목명과 연도, 문항 번호를 함께 입력하면 더 정확해요.</p>}
    <div className="mt-5 space-y-3">{results.map((result) => <Link key={result.href} href={result.href} className="block rounded-2xl border border-mist bg-paper p-5 transition-colors hover:border-carbon"><p className="font-display text-[12px] font-semibold text-[#087f6d]">{result.eyebrow}</p><h2 className="mt-1 font-display text-[18px] font-semibold text-ink">{result.title}</h2><p className="mt-2 line-clamp-2 font-display text-body-sm text-smoke">{result.excerpt}</p></Link>)}</div>
    {q && results.length === 0 ? <div className="mt-8 rounded-2xl bg-surface p-6 font-display text-body-sm text-smoke">일치하는 문항이 없어요. ‘민법 25년 49번’처럼 다시 검색해 보세요.</div> : null}
  </div></main>;
}
