"use client";

import { useId, useRef, useState } from "react";
import { DailyQuestionStem } from "@/components/daily/DailyQuestionStem";
import { ExplanationChoiceSelection } from "@/components/exam/ExamSeoExplanationDetails";
import { ExamMaterialFigure } from "@/components/exam/ExamMaterialFigure";
import { ExamOxQuestion, type ExamAnswerState } from "@/components/exam/ExamOxQuestion";
import { ExamQuestionSeoExplanations } from "@/components/exam/ExamQuestionSeoExplanations";
import { PcQuestionStudyProvider } from "@/components/pc-pro/PcStudyAction";
import type { ExamLink, HistoryPerson, HistoryQuestionPreview, HistorySource, LibraryImage, LibraryLink, PersonSummary, SourceSummary } from "@/lib/history-library-model";

const oldHangul = /[\u1100-\u11ff\ua960-\ua97f\ud7b0-\ud7ff]/u;
const attributionLabels: Record<string, string> = {
  own: "봄기출 제작", PD: "퍼블릭 도메인", "KOGL-1": "공공누리 제1유형", "KOGL-3": "공공누리 제3유형",
  "CC-BY": "CC BY", "CC-BY-SA": "CC BY-SA",
};
const formatCredit = (credit?: LibraryImage["credit"]) => !credit ? "" : [
  credit.org, credit.author !== credit.org ? credit.author : null,
  credit.license ? [attributionLabels[credit.license] ?? credit.license, credit.version].filter(Boolean).join(" ") : null,
].filter(Boolean).join(" · ");
const safeReference = (url?: string): url is string => Boolean(url && /^https?:\/\//i.test(url));

export function ReferenceLinks({ links, title = "출처" }: { links?: LibraryLink[]; title?: string }) {
  const refs = [...new Map((links ?? []).filter(link => safeReference(link.url)).map(link => [link.url, link])).values()];
  if (!refs.length) return null;
  return <section className="hl-links">
    {title && <h3 className="sry-sec__label">{title}</h3>}
    <ul>{refs.map(({ label, url }) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{label} ↗</a></li>)}</ul>
  </section>;
}

function ExamLinks({ links, title }: { links: ExamLink[]; title: string }) {
  const panelId = useId();
  const [active, setActive] = useState<ExamLink | null>(null);
  const [previews, setPreviews] = useState<Record<string, HistoryQuestionPreview | "loading" | "error">>({});
  const preview = active ? previews[active.href] : undefined;

  function load(href: string) {
    setPreviews(current => ({ ...current, [href]: "loading" }));
    void fetch("/api/history/question-preview?" + new URLSearchParams({ href }))
      .then(async response => {
        if (!response.ok) throw new Error("기출문제를 불러오지 못했어요.");
        const question = await response.json() as HistoryQuestionPreview;
        setPreviews(current => ({ ...current, [href]: question }));
      }).catch(() => setPreviews(current => ({ ...current, [href]: "error" })));
  }

  function toggle(link: ExamLink) {
    setActive(active?.href === link.href ? null : link);
    if (!previews[link.href]) load(link.href);
  }

  if (!links.length) return null;
  return <section>
    <h3 className="sry-sec__label">{title}</h3>
    <div className="sry-exams">{links.map(link => <button type="button" key={link.href} aria-expanded={active?.href === link.href}
      aria-controls={panelId} onClick={() => toggle(link)}>{link.label}<span className="sr-only"> 기출문제</span></button>)}</div>
    <div id={panelId} hidden={!active} className="hl-exam-preview" role="region" aria-label={active ? `${active.label} 기출문제` : undefined}>
      {active && (preview === "error" ? <p role="status">기출문제를 불러오지 못했어요. <button type="button" onClick={() => load(active.href)}>다시 열기</button></p>
        : !preview || preview === "loading" ? <p role="status">기출문제를 여는 중이에요.</p>
          : <RelatedQuestion key={active.href} label={active.label} question={preview}/>)}
    </div>
  </section>;
}

function RelatedQuestion({ label, question }: { label: string; question: HistoryQuestionPreview }) {
  const [answer, setAnswer] = useState<ExamAnswerState>({ selected: null, revealed: false });
  const accepted = question.correctChoices?.length ? question.correctChoices : [question.correctChoice];
  const picked = answer.selected === null ? null : { number: answer.selected, incorrect: !accepted.includes(answer.selected) };
  return <PcQuestionStudyProvider question={question.glossaryPro?.path}>
    <p className="hl-meta">{label}</p>
    <DailyQuestionStem stem={question.stem} heading="h3"/>
    <div className="hl-exam-figure"><ExamMaterialFigure material={question.material} questionNo={question.questionNo}/></div>
    <div className="hl-exam-choices">
      <ExamOxQuestion examId={question.id} items={question.items} correctChoice={question.correctChoice}
        correctChoices={question.correctChoices} answerState={answer} onAnswerStateChange={setAnswer} renderExplanation={false} embedded/>
    </div>
    {answer.revealed && <ExplanationChoiceSelection choice={picked}>
      <ExamQuestionSeoExplanations question={question} subjectLabel="한국사 심화" scope="history" embedded
        glossaryByChoice={question.glossaryByChoice} glossaryPro={question.glossaryPro} pickedChoice={picked ? `${picked.number}번` : undefined}/>
    </ExplanationChoiceSelection>}
  </PcQuestionStudyProvider>;
}

function Picture({ image, portrait, children }: { image: LibraryImage; portrait?: boolean; children?: React.ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const byline = formatCredit(image.credit);
  return <figure className={portrait ? "sry-fig hpd-portrait" : "sry-fig"}>
    <button type="button" aria-label="이미지 크게 보기" onClick={() => dialog.current?.showModal()}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.file} alt={image.alt ?? ""} loading="lazy" decoding="async" referrerPolicy="no-referrer"/>
    </button>
    <figcaption>
      {image.caption && <div className="sry-cap">
        {image.caption.title && <strong>{image.caption.title}</strong>}
        {image.caption.short && <p>{image.caption.short}</p>}
        {image.caption.body && image.caption.body !== image.caption.short && <details><summary>그림 설명</summary><p>{image.caption.body}</p></details>}
      </div>}
      {byline && <p className="hl-credit">{byline}{safeReference(image.credit?.url) && <> · <a href={image.credit.url} target="_blank" rel="noreferrer">이미지 출처</a></>}</p>}
      {children}
    </figcaption>
    <dialog ref={dialog} className="hl-lightbox" aria-label={image.alt || "이미지 확대"} onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}>
      <button type="button" onClick={() => dialog.current?.close()} autoFocus>닫기 ×</button>
      {/* Avoid loading a duplicate image before the lightbox opens. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.file} alt={image.alt ?? ""} loading="lazy" referrerPolicy="no-referrer"/>
      {byline && <p className="hl-credit">{byline}</p>}
    </dialog>
  </figure>;
}

export function HistorySourceCard({ item }: { item: HistorySource }) {
  const digits = String(item.no).padStart(3, "0");
  const padding = digits.match(/^0*/)?.[0] ?? "";
  const original = item.original;
  const sourceUrl = original?.url;
  const [hero, ...bodyImages] = item.images;
  return <article className="sry-card" aria-label={item.title}>
    <header className="sry-no">
      <span className="sry-no__num" aria-label={item.no + "번"}><span className="sry-no__zero" aria-hidden>{padding}</span><span aria-hidden>{digits.slice(padding.length)}</span></span>
      <span className="sry-no__meta">{[item.period, item.yearText, ...(item.themes ?? [])].filter(Boolean).map(value => <span key={value}>{value}</span>)}</span>
      <h2 className="sry-no__title">{item.title}</h2>
    </header>
    {hero && <Picture image={hero}/>}
    {!!item.clues?.length && <p className="sry-clues">{item.clues.map((word, index) => <span className="sry-clue" key={word + index}>{word}</span>)}</p>}
    <div className="sry-card__body">
      {original?.text && <figure className={`sry-orig${original.lang === "한문" ? " sry-orig--hanmun" : ""}${oldHangul.test(original.text) ? " sry-orig--old-hangul" : ""}`}>
        <blockquote className="sry-orig__text" lang={original.lang === "일문" ? "ja" : undefined}>{original.text}</blockquote>
        <figcaption className="sry-orig__from">{[original.from, original.lang, formatCredit(original.credit)].filter(Boolean).join(" · ")}</figcaption>
      </figure>}
      {bodyImages.map(image => <Picture key={image.file} image={image}/>)}
      {item.plain && <section><h3 className="sry-sec__label">풀이</h3><p className="sry-sec__p">{item.plain}</p></section>}
      {item.context && <section><h3 className="sry-sec__label">배경과 의의</h3><p className="sry-sec__p">{item.context}</p></section>}
      <ExamLinks links={item.exams} title="이 사료가 나온 기출"/>
      <ReferenceLinks links={[...(item.links ?? []), ...(sourceUrl ? [{ label: original?.from ? "원문 · " + original.from : "원문 보기", url: sourceUrl }] : [])]}/>
    </div>
  </article>;
}

function groupBlocks(blocks: [string, string][]) {
  const groups: ({ type: "list"; values: string[] } | { type: "heading" | "text"; value: string })[] = [];
  for (const [type, value] of blocks) {
    if (type === "li") {
      const last = groups.at(-1);
      if (last?.type === "list") last.values.push(value);
      else groups.push({ type: "list", values: [value] });
    } else {
      groups.push({ type: type === "h" ? "heading" : "text", value });
    }
  }
  return groups;
}

export function HistoryPersonCard({ item, related, people, openSource, openPerson }: {
  item: HistoryPerson; related: Map<string, SourceSummary>; people: Map<string, PersonSummary>;
  openSource: (id: string) => void; openPerson: (id: string) => void;
}) {
  const available = (["aks", "wiki"] as const).filter(edition => item.books[edition]);
  const [edition, setEdition] = useState<"aks" | "wiki" | undefined>(() => item.id === "dae-joyeong" && item.books.wiki ? "wiki" : available[0]);
  const book = edition ? item.books[edition] : item.record;
  const facts = Object.entries(item.books.aks?.facts ?? {});
  const portrait = item.portrait;
  const family = (item.family ?? []).map(({ label, id, name }) => ({ label, id, name: (id && people.get(id)?.name) || name }));
  const bookLinks = [
    { label: "원문 보기", url: book?.url }, { label: "콘텐츠 이용 안내", url: book?.terms },
    { label: "기여자·편집 이력", url: book?.history }, { label: "CC BY-SA 4.0", url: book?.license },
  ].flatMap(link => safeReference(link.url) ? [{ label: link.label, url: link.url }] : []);

  return <article className="sry-card hpd-profile" aria-label={item.name + " 인물 카드"}>
    <header className="hpd-profile-head">
      <p className="hl-meta">{[item.era, item.role, item.exams.length ? `기출 ${item.exams.length}회 출제` : ""].filter(Boolean).join(" · ")}</p>
      <h2 className="hpd-profile-title">{item.name} {item.hanja && <span className="hl-hanja" lang="ko-Hani">{item.hanja}</span>}</h2>
      {item.lifespan && <p className="hl-meta"><span className="hpd-date-label">생애</span> {item.lifespan}</p>}
      {(item.reign || item.period) && <p className="hl-meta"><span className="hpd-date-label">재위</span> {item.reign || item.period}</p>}
      {!!item.aliases.length && <p className="hl-meta">{item.aliases.join(" · ")}</p>}
      {item.summary && <p className="sry-sec__p">{item.summary}</p>}
      {item.periodNote && <p className="sry-sec__p">{item.periodNote}</p>}
    </header>
    {portrait && <Picture portrait image={{ file: portrait.file, alt: portrait.description }}>
      {portrait.generated ? "AI 상상 초상" : portrait.caption}
      <details className="hl-credit"><summary>이미지 정보</summary>
        <p>{[portrait.description, portrait.credit, portrait.license, portrait.sourceNote].filter(Boolean).join(" · ")}</p>
        <ReferenceLinks title="" links={[
          ...(portrait.sourceUrl ? [{ label: portrait.sourceLabel ?? "이미지 출처", url: portrait.sourceUrl }] : []),
          ...(portrait.licenseUrl ? [{ label: portrait.license ?? "라이선스", url: portrait.licenseUrl }] : []),
          ...(portrait.relatedSource ? [portrait.relatedSource] : []),
        ]}/>
      </details>
    </Picture>}
    <div className="sry-card__body">
      {family.length > 0 && <section><h3 className="sry-sec__label">왕실 관계</h3>
        <ul className="hl-rulers">{family.map(({ label, id, name }) => <li key={label + name}>
          {id ? <button type="button" onClick={() => openPerson(id)}><small>{label}</small>{name}</button>
            : <><small>{label}</small>{name}</>}
        </li>)}</ul>
      </section>}
      {facts.length > 0 && item.id !== "dae-joyeong" && <dl className="hpd-biofacts">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
      {available.length > 1 && <nav className="hl-view-tabs" aria-label="본문 출처 선택">{available.map(value =>
        <button type="button" key={value} aria-pressed={value === edition} onClick={() => setEdition(value)}>{value === "aks" ? "한국민족문화대백과사전" : "위키백과"}</button>)}</nav>}
      {book && <>
        {(book.author || edition) && <p className="hl-meta">{[edition === "aks" ? "한국민족문화대백과사전" : edition === "wiki" ? "위키백과" : "", book.author ?? (edition === "wiki" ? "위키백과 기여자" : ""), book.revised].filter(Boolean).join(" · ")}</p>}
        {(book.sections ?? []).map(({ title, blocks }, index) => <section className="hpd-article-blocks" lang={book.language} key={title + index}>
          <h3 className="sry-sec__label">{title}</h3>
          {groupBlocks(blocks).map((block, at) =>
            block.type === "heading" ? <h4 key={at}>{block.value}</h4>
              : block.type === "list" ? <ul key={at} className="sry-sec__p">{block.values.map((text, row) => <li key={row}>{text}</li>)}</ul>
                : <p key={at} className="sry-sec__p">{block.value}</p>)}
        </section>)}
      </>}
      {!!item.saryoIds.length && <section><h3 className="sry-sec__label">관련 사료</h3>
        <div className="hl-related">{item.saryoIds.map(id => {
          const source = related.get(id);
          return source && <button key={id} type="button" onClick={() => openSource(id)}>{source.title} ›
            {item.saryoNotes?.[id] && <small>{item.saryoNotes[id]}</small>}
          </button>;
        })}</div></section>}
      <ExamLinks links={item.exams} title="관련 기출"/>
      <ReferenceLinks links={[...bookLinks, ...item.sources, ...(item.relatedSources ?? [])]}/>
    </div>
  </article>;
}
