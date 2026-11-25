'use client';

import Link from 'next/link';
import { lazy, Suspense, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { PC_STUDY_FEATURES, type PcStudyFeature, type PcStudyOffer } from '@/lib/pc-access/study-features';
import { CitedText } from '@/components/exam/CitedText';
import type { PcStudy, PcNotebook } from '@/lib/pc-access/study';
import './pc-study.css';

const StudyPanel = lazy(() => import('./PcStudyRoom'));
const titleOf = (feature: PcStudyFeature) => PC_STUDY_FEATURES.find(item => item.id === feature)?.title;

type GlossaryRequest = { feature: 'glossary'; question: string; term: string; choice: string };
type NotebookRequest = { feature: 'notebook'; question: string };
type StudyRequest = { feature: PcStudyFeature; question?: string; scope?: string };
type Result = Partial<PcStudy> & { definition?: string | null; note?: PcNotebook; error?: string };
type OfferProps = { offers: PcStudyOffer[] };

function StudyAccess({ request, offers }: { request: StudyRequest | GlossaryRequest | NotebookRequest } & OfferProps) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(request)) if (value) params.set(key, value);
  const query = params.toString();
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ status: number; data: Result } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort('timeout'), 12000);
    void fetch('/api/pc-access/study?' + query, { cache: 'no-store', signal: controller.signal })
      .then(async response => ({ status: response.status, data: await response.json() }))
      .then(response => { if (!controller.signal.aborted) setResult(response); })
      .catch(() => {
        if (controller.signal.reason !== 'closed') setResult({ status: 503, data: {} });
      })
      .finally(() => window.clearTimeout(timeout));
    return () => { controller.abort('closed'); window.clearTimeout(timeout); };
  }, [query, attempt]);
  if (!result) return <p className="pc-access-note" role="status">불러오는 중…</p>;
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
  if (result.status !== 200) return <div className="pc-access-gate" role="status">
    <p>{result.data.error ?? '불러오지 못했어요. 잠시 후 다시 시도해 주세요.'}</p>
    {result.status >= 500 && <button type="button" className="pc-access-primary" onClick={() => { setResult(null); setAttempt(value => value + 1); }}>다시 시도</button>}
  </div>;
  if (request.feature === 'glossary') return <p className="pc-access-definition">
    {result.data.definition ?? '이 용어의 설명은 아직 준비되지 않았어요.'}
  </p>;
  if (request.feature === 'notebook') return result.data.note ? <Notebook note={result.data.note}/> : null;
  return <Suspense fallback={<p className="pc-access-note" role="status">학습 화면을 여는 중…</p>}>
    <StudyPanel feature={request.feature} results={result.data}/>
  </Suspense>;
}

function AccessDialog({ title, className, button, label, wide, children }: {
  title: string; className?: string; button: ReactNode; label?: string; wide?: boolean; children: ReactNode;
}) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  return <>
    <button className={className} type="button" aria-label={label} aria-haspopup="dialog" onClick={() => {
      dialog.current?.showModal(); setOpen(true);
    }}>{button}</button>
    <dialog className={`pc-access-dialog${wide ? ' pc-access-dialog--wide' : ''}`} ref={dialog}
      aria-labelledby={id} onClose={() => setOpen(false)}
      onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}>
      <div className="pc-access-inner">
        <header><div><span className="pc-access-pro">Pro</span><h2 id={id}>{title}</h2></div>
          <button className="pc-access-close" type="button" autoFocus aria-label="닫기" onClick={() => dialog.current?.close()}>×</button>
        </header>
        <div className="pc-access-body">{open && children}</div>
      </div>
    </dialog>
  </>;
}

function SubjectPractice({ feature, offers }: { feature: PcStudyFeature } & OfferProps) {
  const [active, setActive] = useState(offers.length === 1 ? offers[0] : null);
  return <>
    {offers.length > 1 && <div className="pc-access-editions" role="group" aria-label="구매한 학습권 선택">
      {offers.map(offer => <button key={offer.id} type="button" aria-pressed={active?.id === offer.id}
        onClick={() => setActive(offer)}>{offer.title}</button>)}
    </div>}
    {active ? <StudyAccess key={active.id} request={{ feature, scope: active.id }} offers={[active]}/>
      : <p className="pc-access-note">앱에서 구매한 학습권을 선택해 주세요.</p>}
  </>;
}

export function PcStudyAction({ feature, offers, className, subjectLabel }: {
  feature: PcStudyFeature; className?: string; subjectLabel?: string;
} & OfferProps) {
  if (!offers.length) return null;
  const title = titleOf(feature) ?? '';
  return <AccessDialog title={title} label={subjectLabel ? subjectLabel + ' ' + title + ' Pro' : undefined}
    wide={feature === 'cells'} className={className ?? 'pc-context-button'}
    button={<>{title} <span className="pc-access-pro">Pro</span></>}>
    <SubjectPractice feature={feature} offers={offers}/>
  </AccessDialog>;
}

export function PcGlossaryTerm({ question, choice, term, offers, children }: {
  question: string; choice: string; term: string; children: ReactNode;
} & OfferProps) {
  return <AccessDialog title={term} className="exam-choice-glossary-term" button={children}>
    <StudyAccess request={{ feature: 'glossary', question, choice, term }} offers={offers}/>
  </AccessDialog>;
}

export function PcQuestionPractice({ question, features, children }: {
  question: string; features: { feature: PcStudyFeature; offers: PcStudyOffer[] }[]; children: ReactNode;
}) {
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
      <StudyAccess key={selected.feature} request={{ feature: selected.feature, question }} offers={selected.offers}/>
    </div>}
  </>;
}

function Notebook({ note }: { note: PcNotebook }) {
  const { intro, points, contrast, insight, pattern, pitfall, example } = note;
  return <article className="pc-context-notebook">
    <p className="pc-access-definition font-semibold"><CitedText text={intro}/></p>
    {points.length > 0 && <ul>{points.map((point, index) => <li key={index}><CitedText text={point}/></li>)}</ul>}
    {contrast && <section aria-label={contrast.title || '비교'} className="pc-notebook-compare">
      {[contrast.left, contrast.right].filter(Boolean).map(side => <div key={side.label}>
        <h3>{side.label}</h3><p><CitedText text={side.body}/></p>
      </div>)}
    </section>}
    {[['정리',pattern],['함정',pitfall],['예시',example],['핵심',insight]].map(([label,text]) => text
      ? <div key={label}><h3>{label}</h3><p><CitedText text={text}/></p></div> : null)}
  </article>;
}

export function PcNotebookAction({ question, offers, className }: { question: string; className: string } & OfferProps) {
  return <AccessDialog title="필기노트" className={className} wide button={<>필기노트 보기 <span className="pc-access-pro">Pro</span></>}>
    <StudyAccess request={{ feature: 'notebook', question }} offers={offers}/>
  </AccessDialog>;
}
