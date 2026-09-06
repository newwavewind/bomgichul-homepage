import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BackLink } from "@/components/ui/BackLink";
import { ENGLISH_SYNTAX_CARDS, ENGLISH_SYNTAX_UNIT_MAP, getEnglishSyntaxCard, getEnglishSyntaxQuestionHref } from "@/lib/english-syntax";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

// 1,050장을 미리 만들면 빌드가 길어진다 — 첫 방문 때 생성해 캐시한다
// (빈 배열이라도 있어야 정적 렌더가 된다 — 이 판 Next 규칙).
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const card = getEnglishSyntaxCard(decodeURIComponent(id));
  if (!card) return {};
  return buildPageMetadata({ title: `${card.no}번 ${card.sentence} | 공무원 영어 구문 올인원`, description: `${card.translation} ${card.note}`, path: `/english/concepts/gong9/${encodeURIComponent(card.id)}` });
}

export default async function EnglishSyntaxDetail({ params }: Props) {
  const { id } = await params;
  const card = getEnglishSyntaxCard(decodeURIComponent(id));
  if (!card) notFound();
  const unit = ENGLISH_SYNTAX_UNIT_MAP.get(card.primaryTag)?.unit;
  const index = ENGLISH_SYNTAX_CARDS.findIndex((item) => item.id === card.id);
  const prev = ENGLISH_SYNTAX_CARDS[index - 1];
  const next = ENGLISH_SYNTAX_CARDS[index + 1];
  return <div className="px-4 py-8 md:py-12"><article className="mx-auto max-w-4xl">
    <BackLink href="/english/concepts/gong9">구문 올인원 목록</BackLink>
    <header className="mt-6 rounded-3xl border border-mist bg-white p-6 shadow-[var(--shadow-subtle)]">
      <div className="flex items-center gap-3"><span className="rounded-full bg-ios-blue/10 px-3 py-1 font-display text-[12px] font-semibold text-ios-blue">{unit?.name ?? card.primaryTag}</span><span className="h-px flex-1 bg-mist"/><strong className="font-display text-body text-fog">{card.no}</strong></div>
      <h1 className="mt-6 font-system text-subheading font-semibold leading-9 text-ink">{card.sentence}</h1>
      <section className="mt-7 border-t border-mist pt-5"><h2 className="font-display text-body-sm font-semibold text-fog">해석</h2><p className="mt-2 font-system text-body leading-7 text-ink">{card.translation}</p></section>
      <section className="mt-6"><h2 className="font-display text-body-sm font-semibold text-fog">해설</h2><p className="mt-2 whitespace-pre-line font-system text-body leading-7 text-smoke">{card.note}</p></section>
    </header>
    <section className="mt-5 rounded-3xl border border-mist bg-white p-6"><h2 className="font-display text-subheading font-semibold text-ink">끊어 읽기</h2><div className="mt-4 space-y-2">{card.chunks.map((chunk, i) => <div key={i} className="grid gap-2 rounded-xl bg-surface px-4 py-3 sm:grid-cols-[52px_1fr_1fr]"><strong className="font-display text-[11px] text-ios-blue">{chunk.role}</strong><span className="font-system text-body-sm text-ink">{chunk.en}</span><span className="font-system text-body-sm text-smoke">{chunk.ko}</span></div>)}</div></section>
    <section className="mt-5 rounded-3xl border border-mist bg-white p-6"><h2 className="font-display text-subheading font-semibold text-ink">문법 짚기</h2><div className="mt-4 space-y-5">{card.grammar.map((grammar, i) => <div key={i} className="border-b border-mist pb-5 last:border-0 last:pb-0"><h3 className="font-display text-body font-semibold text-ink">{grammar.point}</h3><p className="mt-2 font-system text-body-sm leading-6 text-smoke">{grammar.detail}</p><p className="mt-3 rounded-xl bg-[#fff7ed] px-4 py-3 font-system text-body-sm leading-6 text-[#9a3412]"><strong>함정</strong> · {grammar.trap}</p></div>)}</div></section>
    {card.vocab?.length ? <section className="mt-5 rounded-3xl border border-mist bg-white p-6"><h2 className="font-display text-subheading font-semibold text-ink">어휘 · 표현</h2><dl className="mt-4 divide-y divide-mist">{card.vocab.map((item, i) => <div key={`${item.term}-${i}`} className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-display text-body font-semibold text-ink">{item.term}</dt><dd className="font-system text-body-sm leading-6 text-smoke">{item.meaning}{item.otherMeanings ? ` · ${item.otherMeanings}` : ""}</dd></div>)}</dl></section> : null}
    <Link href={getEnglishSyntaxQuestionHref(card)} className="mt-5 flex items-center justify-between rounded-2xl border border-ios-blue/30 bg-ios-blue/5 px-5 py-4 font-display text-body font-semibold text-ios-blue"><span>{card.year}년 {card.seriesLabel} {card.questionNo}번</span><span>문제 보기 →</span></Link>
    <nav className="mt-8 grid grid-cols-2 gap-3">{prev ? <Link className="rounded-2xl border border-mist px-4 py-4 font-display text-body-sm text-ink" href={`/english/concepts/gong9/${encodeURIComponent(prev.id)}`}>← {prev.no}번</Link> : <span/>}{next ? <Link className="rounded-2xl border border-mist px-4 py-4 text-right font-display text-body-sm text-ink" href={`/english/concepts/gong9/${encodeURIComponent(next.id)}`}>{next.no}번 →</Link> : null}</nav>
  </article></div>;
}
