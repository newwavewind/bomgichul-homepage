'use client';

import Link from 'next/link';
import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { PC_STUDY_FEATURES, type PcStudyFeature, type PcStudyOffer } from '@/lib/pc-access/study-features';
import ExamConceptNote from './notebook/ExamConceptNote';
import GlossaryDetails, { GlossaryHanjaButton } from './glossary/GlossaryDetails';
import type { PcGlossary, PcStudy, PcNotebook } from '@/lib/pc-access/study';
import './pc-study.css';

const loadStudyPanel = () => import('./PcStudyRoom');
const StudyPanel = lazy(loadStudyPanel);
const titleOf = (feature: PcStudyFeature) => PC_STUDY_FEATURES.find(item => item.id === feature)?.title;

type StudyRequest = { feature: PcStudyFeature; scope?: string };
type Result = Partial<PcStudy> & { definitions?: Record<string, Record<string, string | null>>; note?: PcNotebook | null; glossary?: PcGlossary | null; glossaryLabels?: Record<string, string[]>; error?: string };
type StudyResponse = { status: number; data: Result };
type OfferProps = { offers: PcStudyOffer[] };
const QuestionStudy = createContext<{ result: StudyResponse | null; retry: () => void; question?: string } | null>(null);

function useStudyRequest(query: string | null) {
  const [state, setState] = useState<{ query: string; response: StudyResponse } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => { setState(null); setAttempt(value => value + 1); }, []);
  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort('timeout'), 30000);
    void fetch('/api/pc-access/study?' + query, { cache: 'no-store', signal: controller.signal })
      .then(async response => ({ status: response.status, data: await response.json() }))
      .then(response => { if (!controller.signal.aborted) setState({ query, response }); })
      .catch(() => {
        if (controller.signal.reason !== 'closed') setState({ query, response: { status: 503, data: {} } });
      })
      .finally(() => window.clearTimeout(timeout));
    return () => { controller.abort('closed'); window.clearTimeout(timeout); };
  }, [query, attempt]);
  return { result: state?.query === query ? state.response : null, retry };
}

export function PcQuestionStudyProvider({ question, children }: { question?: string; children: ReactNode }) {
  const access = useStudyRequest(question ? new URLSearchParams({ feature: 'question', question }).toString() : null);
  useEffect(() => { if (question) void loadStudyPanel().catch(() => {}); }, [question]);
  return <QuestionStudy.Provider value={{ ...access, question }}>{children}</QuestionStudy.Provider>;
}

function StudyStatus({ result, retry, offers }: { result: StudyResponse | null; retry: () => void } & OfferProps) {
  if (!result) return <p className="pc-access-note" role="status">준비하는 중…</p>;
  if (result.status === 401 || result.status === 403) {
    const login = '/login?next=' + encodeURIComponent(window.location.pathname + window.location.search);
    return <div className="pc-access-gate">
      <h3>구매한 과목을 연결해 주세요</h3>
      <p>앱에서 구매한 과목을 홈페이지 계정에 QR로 연결하면 이용할 수 있어요.</p>
      {result.status === 401 ? <Link href={login} className="pc-access-primary">로그인하기</Link>
        : offers.map(offer => <Link key={offer.id} className="pc-access-primary" href={offer.plan}>
          {offers.length > 1 ? offer.title + ' 연결' : '앱 구매 연동'}
        </Link>)}
    </div>;
  }
  return <div className="pc-access-gate" role="status">
    <p>{result.data.error ?? '불러오지 못했어요. 잠시 후 다시 시도해 주세요.'}</p>
    {result.status >= 500 && <button type="button" className="pc-access-primary" onClick={retry}>다시 시도</button>}
  </div>;
}

export const CloseStudyDialog = createContext<() => void>(() => {});

function StudyContent({ feature, scope, result, retry, offers }: StudyRequest & {
  result: StudyResponse | null; retry: () => void;
} & OfferProps) {
  if (result?.status !== 200) return <StudyStatus result={result} retry={retry} offers={offers}/>;
  return <Suspense fallback={<p className="pc-access-note" role="status">학습 화면을 여는 중…</p>}>
    <StudyPanel feature={feature} results={result.data} scope={scope}/>
  </Suspense>;
}

function AccessDialog({ title, className, button, label, wide, prepare, children }: {
  title: string; className?: string; button: ReactNode; label?: string; wide?: boolean; prepare?: () => void; children: ReactNode;
}) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => dialog.current?.close(), []);
  useEffect(() => {
    if (!prepare || !trigger.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { prepare(); observer.disconnect(); }
    });
    observer.observe(trigger.current);
    return () => observer.disconnect();
  }, [prepare]);
  return <>
    <button ref={trigger} onPointerEnter={prepare} onFocus={prepare} className={className} type="button" aria-label={label} aria-haspopup="dialog" onClick={() => {
      prepare?.(); dialog.current?.showModal(); setOpen(true);
    }}>{button}</button>
    <dialog className={`pc-access-dialog${wide ? ' pc-access-dialog--wide' : ''}`} ref={dialog}
      aria-labelledby={id} onClose={() => setOpen(false)}
      onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}>
      <div className="pc-access-inner">
        <header><div><span className="pc-access-pro">Pro</span><h2 id={id}>{title}</h2></div>
          <button className="pc-access-close" type="button" autoFocus aria-label="닫기" onClick={() => dialog.current?.close()}>×</button>
        </header>
        <div className="pc-access-body">{open && <CloseStudyDialog.Provider value={close}>{children}</CloseStudyDialog.Provider>}</div>
      </div>
    </dialog>
  </>;
}

export function PcStudyAction({ feature, offers, className, subjectLabel }: {
  feature: PcStudyFeature; className?: string; subjectLabel?: string;
} & OfferProps) {
  const [active, setActive] = useState(offers.length === 1 ? offers[0] : null);
  const [prepared, setPrepared] = useState(false);
  const prepare = useCallback(() => { setPrepared(true); void loadStudyPanel().catch(() => {}); }, []);
  const scope = active?.id;
  const format = feature === 'cells' ? 'workbook' : (feature === 'ox' || feature === 'audio') ? 'inline' : null;
  const request = useStudyRequest(prepared && scope
    ? new URLSearchParams({ feature, scope, ...(format ? { format } : {}) }).toString() : null);
  if (!offers.length) return null;
  const title = titleOf(feature) ?? '';
  return <AccessDialog title={title} label={subjectLabel ? subjectLabel + ' ' + title + ' Pro' : undefined}
    wide={feature === 'cells'} className={className ?? 'pc-context-button'} prepare={prepare}
    button={<>{title} <span className="pc-access-pro">Pro</span></>}>
    {offers.length > 1 && <div className="pc-access-editions" role="group" aria-label="구매한 학습권 선택">
      {offers.map(offer => <button key={offer.id} type="button" aria-pressed={active?.id === offer.id}
        onClick={() => setActive(offer)}>{offer.title}</button>)}
    </div>}
    {active ? <StudyContent key={active.id} feature={feature} scope={active.id} {...request} offers={[active]}/>
      : <p className="pc-access-note">앱에서 구매한 학습권을 선택해 주세요.</p>}
  </AccessDialog>;
}

export function useQuestionGlossaryTerms(choice: string) {
  const data = useContext(QuestionStudy)?.result?.data;
  return data?.glossary?.terms[choice]?.map(({ term }) => term) ?? data?.glossaryLabels?.[choice];
}
export function PcGlossaryTerm({ choice, term, offers, children, emptyMessage }: {
  choice: string; term: string; children: ReactNode; emptyMessage?: string;
} & OfferProps) {
  const access = useContext(QuestionStudy);
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const [expanded, setExpanded] = useState(false);
  const blocked = access?.result?.status === 401 || access?.result?.status === 403;
  useEffect(() => {
    if (blocked && expanded && !dialog.current?.open) dialog.current?.showModal();
  }, [blocked, expanded]);
  const glossary = access?.result?.data.glossary;
  const nativeTerms = glossary?.terms[choice] ?? [];
  const entry = nativeTerms.find(value => value.term === term);
  const definition = access?.result?.data.definitions?.[choice]?.[term];
  if (entry && glossary && access?.question) {
    return <div className="sx-terms__row" data-open={expanded}>
      {expanded ? <div className="sx-terms__toggle">
        <span>{term}<GlossaryHanjaButton entry={entry} siblings={nativeTerms}/></span>
        <button type="button" className="sx-terms__close" aria-label={term + ' 설명 접기'}
          onClick={() => setExpanded(false)}>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
        </button>
      </div> : <button className="sx-terms__toggle" type="button" aria-expanded={false}
        onClick={() => setExpanded(true)}>
        <span>{term}</span>
        <svg className="sx-terms__chevron" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>}
      {expanded && <div className="sx-terms__definition">
        <GlossaryDetails entry={entry} sources={glossary.sources}
          related={Object.hasOwn(glossary.related, term) ? glossary.related[term] : []}
          choice={choice} question={access.question}/>
      </div>}
    </div>;
  }
  return <>
    <button className="exam-choice-glossary-term" type="button" aria-expanded={blocked ? undefined : expanded}
      aria-controls={expanded && !blocked ? id : undefined} aria-haspopup={blocked ? 'dialog' : undefined}
      onClick={() => {
        setExpanded(value => !value);
        if (blocked) dialog.current?.showModal();
      }}>{children}</button>
    {expanded && !blocked && <div className="exam-choice-glossary-definition" id={id}>
      {access?.result?.status === 200 ? definition ?? emptyMessage ?? '이 용어의 설명은 아직 준비되지 않았어요.'
        : <StudyStatus result={access?.result ?? null} retry={access?.retry ?? (() => {})} offers={offers}/>}
    </div>}
    {blocked && <dialog className="pc-access-dialog" ref={dialog} aria-label={term} onClose={() => setExpanded(false)}
      onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}>
      <div className="pc-access-inner">
        <header><div><span className="pc-access-pro">Pro</span><h2>{term}</h2></div>
          <button className="pc-access-close" type="button" autoFocus aria-label="닫기" onClick={() => dialog.current?.close()}>×</button>
        </header>
        <div className="pc-access-body"><StudyStatus result={access.result} retry={access.retry} offers={offers}/></div>
      </div>
    </dialog>}
  </>;
}

export function PcQuestionPractice({ features, children }: {
  features: { feature: PcStudyFeature; offers: PcStudyOffer[] }[]; children: ReactNode;
}) {
  const access = useContext(QuestionStudy);
  const [active, setActive] = useState<PcStudyFeature | null>(null);
  const selected = features.find(item => item.feature === active);
  return <>
    <nav className="pc-context-tabs" aria-label="문항 해설 학습 방식">
      <button type="button" aria-pressed={!active} onClick={() => setActive(null)}>해설</button>
      {features.map(({ feature }) => <button type="button" key={feature} aria-pressed={feature === active}
        onClick={() => setActive(feature)}>{titleOf(feature)} <span className="pc-access-pro">Pro</span></button>)}
    </nav>
    <div hidden={Boolean(selected)}>{children}</div>
    {selected && <div className="pc-context-inline">
      <StudyContent key={selected.feature} feature={selected.feature} result={access?.result ?? null} retry={access?.retry ?? (() => {})} offers={selected.offers}/>
    </div>}
  </>;
}

function Notebook({ note, title, onClose }: { note: PcNotebook; title: string; onClose: () => void }) {
  const blocks: unknown[] = [];
  if (note.points.length) blocks.push({ 유형: 'steps', 줄: note.points });
  if (note.contrast?.left && note.contrast?.right) blocks.push({
    유형: 'compare',
    묶음: [note.contrast.left, note.contrast.right].map(side => ({ 이름: side.label, 항목: [side.body] })),
  });
  if (note.example) blocks.push({ 유형: 'example', 글: note.example });
  if (note.pitfall) blocks.push({ 유형: 'callout', 글: note.pitfall });
  if (!blocks.length) blocks.push({ 유형: 'p', 글: note.intro });
  return <ExamConceptNote concept={{ 제목: title, 블록: blocks, sources: note.sources }} short={note.intro}
    terms={null} footer={<div className="ecn__foot"><span/>
      <button type="button" className="ecn-easy__btn ecn-easy__btn--ghost" onClick={onClose}>접기</button>
    </div>}/>;
}

export function PcNotebookAction({ offers, className, title }: { className: string; title: string } & OfferProps) {
  const access = useContext(QuestionStudy);
  const [expanded, setExpanded] = useState(true);
  const result = access?.result ?? null;
  if (!result) return null;
  if (result.status !== 200) return <AccessDialog title="필기노트" className={className}
    button={<>필기노트 보기 <span className="pc-access-pro">Pro</span></>}>
    <StudyStatus result={result} retry={access?.retry ?? (() => {})} offers={offers}/>
  </AccessDialog>;
  if (!result.data.note) return null;
  return <div className="pc-notebook-inline">
    {expanded ? <Notebook note={result.data.note} title={title} onClose={() => setExpanded(false)}/>
      : <button className={className} type="button" aria-expanded={false} onClick={() => setExpanded(true)}>
        필기노트 보기 <span className="pc-access-pro">Pro</span>
      </button>}
  </div>;
}
