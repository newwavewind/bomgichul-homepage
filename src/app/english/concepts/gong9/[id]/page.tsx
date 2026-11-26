import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DailyQuestionStem } from "@/components/daily/DailyQuestionStem";
import { BackLink } from "@/components/ui/BackLink";
import { NavigationChevron } from "@/components/ui/backLinkShared";
import { EnglishSyntaxDetailActions } from "@/components/english/EnglishSyntaxDetailActions";
import { EnglishSyntaxDetailReader } from "@/components/english/EnglishSyntaxDetailReader";
import { EnglishSyntaxDetailStudyLinks } from "@/components/english/EnglishSyntaxDetailStudyLinks";
import { getEnglishExam } from "@/lib/english-content";
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
  const previousHref = previous && cardPath(previous.id);
  const nextHref = next && cardPath(next.id);
  const exam = getEnglishExam("gong9", card.year, card.seriesLabel, card.questionNo);
  const sentence = practice?.card.sentence ?? card.sentence;
  const corrected = sentence !== card.sentence;
  const practiceHref = practice ? `/english/concepts/gong9/practice?card=${encodeURIComponent(card.id)}` : "/english/concepts/gong9/practice";
  const sections = [
    { id: "components", label: "문장 성분", show: !!card.chunks.length },
    { id: "grammar", label: "문법 짚기", show: !!card.grammar.length },
    { id: "vocabulary", label: "어휘·표현", show: !!card.vocab?.length },
  ].filter(({ show }) => show);

  const overview = (
    <>
      <header>
        <p className="es-detail-meta">
          <span className="es-detail-number">{card.no}번</span>
          <span className="es-kicker">{unit?.name ?? card.primaryTag}</span>
        </p>
        <EnglishSyntaxDetailActions id={card.id} sentence={sentence} clip={practice?.card.audio} />
      </header>
      <h1 lang="en">{sentence}</h1>
      {corrected && <div className="es-detail-correction"><strong>기출 오답을 고친 문장</strong><br /><del lang="en">{card.sentence}</del></div>}
      <section className="es-section">
        <h2>해석</h2>
        <p>{card.translation}</p>
      </section>
      <EnglishSyntaxDetailStudyLinks key={card.id} practiceHref={practiceHref}
        examHref={getEnglishSyntaxQuestionHref(card)} examLabel={`${card.seriesLabel} ${card.year}년 ${card.questionNo}번 기출`}
        exam={exam ?? undefined}
        stem={exam?.stem && <DailyQuestionStem stem={exam.stem} heading="h3" underlines={exam.underlines}
          keepLineBreaks={exam.keepStemLines} />}
      />
      <nav aria-label="이전과 다음 문장" className="es-detail-paging">
        {previous && <Link className="es-button" href={previousHref} prefetch={false} rel="prev"
          aria-label={`${previous.no}번 이전 문장`} aria-keyshortcuts="ArrowLeft">
          <NavigationChevron direction="left" size={14} /> {previous.no}번
        </Link>}
        {next && <Link className="es-button" href={nextHref} prefetch={false} rel="next"
          aria-label={`${next.no}번 다음 문장`} aria-keyshortcuts="ArrowRight">
          {next.no}번 <NavigationChevron direction="right" size={14} />
        </Link>}
      </nav>
    </>
  );

  const study = (
    <>
      {sections.length > 0 && <nav aria-label="문장 해설 항목" className="es-detail-jump">
        {sections.map(({ id, label }) => <a key={id} href={`#${id}`}>{label}</a>)}
      </nav>}
      {card.note && <section className="es-section"><h2>핵심 해설</h2><p className="whitespace-pre-line">{card.note}</p></section>}
      {card.chunks.length > 0 && <section className="es-section" id="components" tabIndex={-1}>
        <h2>문장 성분 · 끊어 읽기</h2>
        <div className="es-detail-segments">
          {card.chunks.map((chunk, position) => <div className="es-detail-segment" data-role={chunk.role} key={position}>
            <span className="es-role">{roles[chunk.role] ?? chunk.role}</span>
            <span lang="en">{chunk.en}</span>
            <span>{chunk.ko}</span>
          </div>)}
        </div>
      </section>}
      {card.grammar.length > 0 && <section className="es-section" id="grammar" tabIndex={-1}>
        <h2>문법 짚기</h2>
        <div className="es-detail-grammar">
          {card.grammar.map((point, position) => <div key={position}>
            <h3>{point.point}</h3>
            <p>{point.detail}</p>
            {point.trap && <p className="es-trap"><strong>함정</strong> · {point.trap}</p>}
          </div>)}
        </div>
      </section>}
      {card.vocab?.length ? <section className="es-section" id="vocabulary" tabIndex={-1}>
        <h2>어휘 · 표현</h2>
        <dl className="es-detail-vocab">{card.vocab.map((item, position) => (
          <div key={`${item.term}:${position}`}>
            <dt lang="en">{item.term}</dt>
            <dd>{item.meaning}{item.otherMeanings ? ` · ${item.otherMeanings}` : ""}</dd>
          </div>
        ))}</dl>
      </section> : null}
    </>
  );

  return (
    <EnglishSyntaxDetailReader
      backLink={<BackLink href="/english/concepts/gong9">구문 올인원 목록</BackLink>}
      overview={overview} study={study} previousHref={previousHref} nextHref={nextHref}
    />
  );
}
