'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { CitedText } from '@/components/exam/CitedText';
import { DailyChoiceContent, DailyQuestionBody } from '@/components/daily/DailyQuestionBody';
import type { GlossaryArticle, GlossaryExam, GlossaryExample, GlossaryRelated, GlossaryTerm } from '@/lib/pc-access/study';
import HanjaCharsPanel from './HanjaCharsPanel';
import './hanja-term.css';
import './glossary.css';

function GlossaryDialog({ title, onClose, children, hanja }: {
  title: string; onClose: () => void; children: ReactNode; hanja?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  useLayoutEffect(() => {
    const root = dialog.current;
    if (root && !root.open) root.showModal();
  }, []);
  return <dialog ref={dialog} className="pc-glossary-dialog" aria-labelledby={id} onClose={onClose}
    onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}>
    <div className="hj-modal__card">
      {hanja && <p className="hj-modal__kicker">한자 풀이</p>}
      <h3 id={id} className="hj-modal__term">{title}</h3>
      {children}
      <button type="button" className="hj-modal__close" autoFocus onClick={() => dialog.current?.close()}>닫기</button>
    </div>
  </dialog>;
}

function HanjaDialog({ term, siblings, onClose }: { term: string; siblings: GlossaryTerm[]; onClose: () => void }) {
  const terms = siblings.filter(value => value.hanja);
  const [index, setIndex] = useState(Math.max(terms.findIndex(value => value.term === term), 0));
  const active = terms[index];
  function move(delta: number) { setIndex(previous => (previous + delta + terms.length) % terms.length); }
  return <GlossaryDialog title={active.term} hanja onClose={onClose}>
    <div onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1);
      }
    }}>
      <HanjaCharsPanel term={active.term} hanja={active.hanja}/>
      {terms.length > 1 && <div className="hj-modal__foot">
        <button type="button" aria-label="이전 한자어" className="hj-modal__nav" onClick={() => move(-1)}>‹</button>
        <span className="hj-modal__pos">{index + 1} / {terms.length}</span>
        <button type="button" aria-label="다음 한자어" className="hj-modal__nav" onClick={() => move(1)}>›</button>
      </div>}
    </div>
  </GlossaryDialog>;
}

export function GlossaryHanjaButton({ entry, siblings }: { entry: GlossaryTerm; siblings: GlossaryTerm[] }) {
  const [open, setOpen] = useState(false);
  if (!entry.hanja) return null;
  return <>
    <button type="button" className="term-hanja" lang="ko-Hani" aria-label={`${entry.term} 한자 ${entry.hanja} 뜻과 음 보기`}
      onClick={() => setOpen(true)}>(<span className="term-hanja__u">{entry.hanja}</span>)</button>
    {open && <HanjaDialog term={entry.term} siblings={siblings} onClose={() => setOpen(false)}/>}
  </>;
}

const labelPattern = /^(뜻|셈|세법|시험|예|사전|풀이|규정|근거)\s*:\s*/;
const digits = '①②③④⑤⑥⑦⑧';

function TermMeaning({ entry, onExample }: { entry: GlossaryTerm; onExample: (example: GlossaryExample) => void }) {
  const lines = entry.def.split('\n').map(line => line.trim()).filter(Boolean);
  if (!lines.some(line => labelPattern.test(line))) return <p className="whitespace-pre-line">{entry.def}</p>;
  return <div className="sx-tdef">
    {lines.map((line, index) => {
      const label = line.match(labelPattern);
      if (!label) return <p key={index}>{line}</p>;
      const body = line.slice(label[0].length);
      return <div key={index} className={`sx-tdef__line sx-tdef__line--${label[1]}`}>
        <strong className="sx-tdef__head">{label[1]}</strong>
        {label[1] === '시험' ? <div className="sx-tdef__body sx-tb">
          {body.split(/(?=[①②③④⑤⑥⑦⑧])/u).filter(branch => branch.trim()).map((branch, i) => {
            const numbered = digits.includes(branch.trimStart()[0]);
            const example = entry.examples?.[i];
            const body = numbered ? branch.trimStart().slice(1).trimStart() : branch;
            return <div key={i} className="sx-tb__item">
              <span className="sx-tb__no">{numbered && branch.trimStart()[0]}</span>
              <span className="sx-tb__text">{body}
                {example && <button type="button" className="sx-tb__src sx-tb__meta" onClick={() => onExample(example)}>
                  {example.label} ›
                </button>}
              </span>
            </div>;
          })}
        </div> : <p>{body}</p>}
      </div>;
    })}
  </div>;
}

export function GlossarySourceArticle({ article }: { article: GlossaryArticle }) {
  return <div className="sx-terms__article">
    <strong>{article.title}{article.date && <small>{article.date}</small>}</strong>
    {article.lines.map((line, index) => <p key={index}>{line}</p>)}
    <a className="sx-terms__article-out" href={article.url} target="_blank" rel="noreferrer">법제처에서 원문 보기 ↗</a>
  </div>;
}

function RelatedStudy({ entries, term, question, choice, onClose }: {
  entries: GlossaryRelated[]; term: string; question: string; choice: string; onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<string, GlossaryExam | null>>({});
  const [answers, setAnswers] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const current = entries[index];
  const exam = current.first ?? results[current.href];
  useEffect(() => {
    if (exam !== undefined) return;
    const controller = new AbortController();
    const params = new URLSearchParams({ feature: 'term-exam', question, choice, term, related: current.href });
    void fetch('/api/pc-access/study?' + params, { signal: controller.signal, cache: 'no-store' })
      .then(async response => response.ok ? (await response.json()).exam as GlossaryExam : null)
      .then(value => { if (!controller.signal.aborted) setResults(previous => ({ ...previous, [current.href]: value })); })
      .catch(() => { if (!controller.signal.aborted) setResults(previous => ({ ...previous, [current.href]: null })); });
    return () => controller.abort();
  }, [current.href, exam, question, choice, term]);

  function move(next: number) { setIndex(next); setAnswers([]); setChecked(false); }
  return <GlossaryDialog title={`${term} 관련 기출`} onClose={onClose}>
    <div className="pc-glossary-related">
      <p className="text-smoke">{current.label}</p>
      {exam ? <>
        <DailyQuestionBody stem={exam.stem} questionNo={exam.questionNo} presentation={exam.presentation} heading="h3" expandableFigures={false}/>
        <ol>
          {exam.choices.map(option => <li key={option.key}>
            <button type="button" aria-pressed={answers.includes(option.key)} disabled={checked}
              data-correct={checked ? exam.correctKeys.includes(option.key) : undefined}
              onClick={() => setAnswers(previous => exam.correctKeys.length === 1 ? [option.key]
                : previous.includes(option.key) ? previous.filter(key => key !== option.key) : [...previous, option.key])}>
              <span>{option.label}</span><DailyChoiceContent choice={option} choiceHeaders={exam.presentation.choiceHeaders}/>
            </button>
          </li>)}
        </ol>
        {checked ? <p role="status">정답 {exam.choices.filter(option => exam.correctKeys.includes(option.key)).map(option => option.label).join(' · ')}</p>
          : <button type="button" className="sx-terms__exams" disabled={!answers.length} onClick={() => setChecked(true)}>정답 확인</button>}
      </> : exam === null ? <p role="status">기출 페이지에서 문제를 확인할 수 있어요.</p> : <p role="status">관련 기출을 여는 중…</p>}
      <Link href={current.href} className="sx-terms__article-out" target="_blank" rel="noreferrer">기출 문제 페이지 열기 ↗</Link>
      <nav className="hj-modal__foot" aria-label="관련 기출 이동">
        <button type="button" className="hj-modal__nav" aria-label="이전 기출" disabled={index === 0} onClick={() => move(index - 1)}>‹</button>
        <span className="hj-modal__pos">{index + 1} / {entries.length}</span>
        <button type="button" className="hj-modal__nav" aria-label="다음 기출" disabled={index + 1 === entries.length} onClick={() => move(index + 1)}>›</button>
      </nav>
    </div>
  </GlossaryDialog>;
}

export default function GlossaryDetails({ entry, sources, related, question, choice }: {
  entry: GlossaryTerm; sources: Record<string, GlossaryArticle | null>;
  related: GlossaryRelated[]; question: string; choice: string;
}) {
  const [article, setArticle] = useState<string | null>(null);
  const [relatedOpen, setRelatedOpen] = useState(false);
  const [example, setExample] = useState<GlossaryExample | null>(null);
  const full = article ? sources[article] : null;
  return <div className="pc-glossary-details">
    <TermMeaning entry={entry} onExample={setExample}/>
    {entry.point && <p className="sx-terms__point"><b>시험 포인트</b>{entry.point}</p>}
    {!!entry.references?.length && <div className="sx-terms__basis">
      {entry.references.map(({ label, url }) => sources[url] ?
        <button type="button" className="sx-terms__basis-link" key={url} aria-expanded={article === url}
          onClick={() => setArticle(previous => previous === url ? null : url)}>{label}<span aria-hidden> {article === url ? '▴' : '▾'}</span></button>
        : <a className="sx-terms__basis-link" href={url} target="_blank" rel="noreferrer" key={url}>{label}<span aria-hidden> ↗</span></a>)}
    </div>}
    {full && <GlossarySourceArticle article={full}/>}
    {related.length > 1 && <button type="button" className="sx-terms__exams" onClick={() => setRelatedOpen(true)}>
      이 용어가 나온 기출 {related.length}문항 →
    </button>}
    {relatedOpen && <RelatedStudy term={entry.term} entries={related} choice={choice} question={question} onClose={() => setRelatedOpen(false)}/>}
    {example && <GlossaryDialog title={`관련 기출 · ${example.label}`} onClose={() => setExample(null)}>
      <div className="pc-glossary-related">
        <p className="font-semibold">{example.stem}</p>
        <p>{example.choiceLabel} {example.choice} {example.answer && <strong>· {example.answer}</strong>}</p>
        {example.explanation && <p><CitedText text={example.explanation}/></p>}
        <Link href={example.href} className="sx-terms__article-out" target="_blank" rel="noreferrer">기출 문제 페이지 열기 ↗</Link>
      </div>
    </GlossaryDialog>}
  </div>;
}
