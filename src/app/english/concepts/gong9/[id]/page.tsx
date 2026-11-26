import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BackLink } from "@/components/ui/BackLink";
import { EnglishSyntaxDetailActions } from "@/components/english/EnglishSyntaxDetailActions";
import { findSyntaxPracticeCard } from "@/lib/english-study-data";
import { ENGLISH_SYNTAX_CARDS, ENGLISH_SYNTAX_UNIT_MAP, getEnglishSyntaxCard, getEnglishSyntaxQuestionHref } from "@/lib/english-syntax";
import { buildPageMetadata } from "@/lib/seo";
import "@/components/english/english-study.css";

type Props = { params: Promise<{ id: string }> };
const roles: Record<string, string> = { S: "주어", V: "동사", O: "목적어", C: "보어", M: "수식어", CONJ: "연결" };
const cardPath = (id: string) => `/english/concepts/gong9/${encodeURIComponent(id)}`;

function resolveCard(id: string) {
  try { return getEnglishSyntaxCard(decodeURIComponent(id)); } catch { return null; }
}

/** Generate and cache the detailed pages as learners open them. */
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const card = resolveCard((await params).id);
  if (!card) return {};
  return buildPageMetadata({
    title: `${card.no}번 ${card.sentence} | 공무원 영어 구문 올인원`,
    description: `${card.translation} ${card.note}`,
    path: cardPath(card.id),
  });
}

export default async function EnglishSyntaxDetail({ params }: Props) {
  const card = resolveCard((await params).id);
  if (!card) notFound();
  const unit = ENGLISH_SYNTAX_UNIT_MAP.get(card.primaryTag)?.unit;
  const practice = await findSyntaxPracticeCard(card.id);
  const index = ENGLISH_SYNTAX_CARDS.findIndex((item) => item.id === card.id);
  const previous = ENGLISH_SYNTAX_CARDS[index - 1];
  const next = ENGLISH_SYNTAX_CARDS[index + 1];
  const sentence = practice?.card.sentence ?? card.sentence;
  const corrected = sentence !== card.sentence;
  const practiceHref = practice ? `/english/concepts/gong9/practice?card=${encodeURIComponent(card.id)}` : "/english/concepts/gong9/practice";
  const sections = [
    { id: "components", label: "문장 성분", show: !!card.chunks.length },
    { id: "grammar", label: "문법 짚기", show: !!card.grammar.length },
    { id: "vocabulary", label: "어휘·표현", show: !!card.vocab?.length },
  ].filter(({ show }) => show);

  return (
    <section className="es-page es-detail-page">
      <BackLink href="/english/concepts/gong9">구문 올인원 목록</BackLink>
      <div className="es-workspace es-detail-layout mt-6">
        <article className="es-reader es-detail-overview">
          <header>
            <p className="es-kicker">{unit?.name ?? card.primaryTag}</p>
            <EnglishSyntaxDetailActions id={card.id} sentence={sentence} clip={practice?.card.audio} />
          </header>
          <h1><span className="es-practice-no">{card.no}</span> <span lang="en">{sentence}</span></h1>
          {corrected && <div className="es-detail-correction"><strong>기출 오답을 고친 문장</strong><br /><del lang="en">{card.sentence}</del></div>}
          <section className="es-section">
            <h2>해석</h2>
            <p>{card.translation}</p>
          </section>
          <div className="es-tools es-detail-main-action">
            <Link href={practiceHref} prefetch={false} className="es-button es-primary">암기 연습 →</Link>
            <Link href={getEnglishSyntaxQuestionHref(card)} prefetch={false} className="es-button">
              {card.seriesLabel} {card.year}년 {card.questionNo}번 기출 ↗
            </Link>
          </div>
          <nav aria-label="이전과 다음 문장" className="es-detail-paging">
            {previous && <Link className="es-button" href={cardPath(previous.id)} prefetch={false}>← {previous.no}번</Link>}
            {next && <Link className="es-button" href={cardPath(next.id)} prefetch={false}>{next.no}번 →</Link>}
          </nav>
        </article>
        <article className="es-reader es-detail-study">
          {sections.length > 0 && <nav aria-label="문장 해설 항목" className="es-detail-jump">
            {sections.map(({ id, label }) => <a key={id} href={`#${id}`}>{label}</a>)}
          </nav>}
          {card.note && <section className="es-section"><h2>핵심 해설</h2><p className="whitespace-pre-line">{card.note}</p></section>}
          {card.chunks.length > 0 && <section className="es-section" id="components">
            <h2>문장 성분 · 끊어 읽기</h2>
            <div className="es-detail-segments">
              {card.chunks.map((chunk, position) => <div className="es-detail-segment" data-role={chunk.role} key={position}>
                <span className="es-role">{roles[chunk.role] ?? chunk.role}</span>
                <span lang="en">{chunk.en}</span>
                <span>{chunk.ko}</span>
              </div>)}
            </div>
          </section>}
          {card.grammar.length > 0 && <section className="es-section" id="grammar">
            <h2>문법 짚기</h2>
            <div className="es-detail-grammar">
              {card.grammar.map((point, position) => <div key={position}>
                <h3>{point.point}</h3>
                <p>{point.detail}</p>
                {point.trap && <p className="es-trap"><strong>함정</strong> · {point.trap}</p>}
              </div>)}
            </div>
          </section>}
          {card.vocab?.length ? <section className="es-section" id="vocabulary">
            <h2>어휘 · 표현</h2>
            <dl className="es-detail-vocab">{card.vocab.map((item, position) => (
              <div key={`${item.term}:${position}`}>
                <dt lang="en">{item.term}</dt>
                <dd>{item.meaning}{item.otherMeanings ? ` · ${item.otherMeanings}` : ""}</dd>
              </div>
            ))}</dl>
          </section> : null}
        </article>
      </div>
    </section>
  );
}
