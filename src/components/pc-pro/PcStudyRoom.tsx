'use client';

import { useContext, useState } from 'react';
import type { PcStudy, StudyChoice, StudyLaw, StudySource } from '@/lib/pc-access/study';
import type { PcStudyFeature } from '@/lib/pc-access/study-features';
import { CitedText } from '@/components/exam/CitedText';
import PocketOxPanel from './PocketOxPanel';
import AudioStudyPanel from './AudioStudyPanel';
import './pc-study.css';
import { CloseStudyDialog } from './PcStudyAction';
import CellStudyWorkbook from './workbook/CellStudyWorkbook';

function Sources({ sources }: { sources: StudySource[] }) {
  if (!sources.length) return null;
  return <ul className="pc-study-sources" aria-label="학습 근거">
    {sources.map(({label,url},index) => <li key={label + index}>
      {url ? <a href={url} target="_blank" rel="noreferrer">{label} ↗</a> : <span>{label}</span>}
    </li>)}
  </ul>;
}

function AnswerCard({ item }: { item: StudyChoice }) {
  const [answer, setAnswer] = useState<boolean | null>(null);
  const match = 'mode' in item && item.mode === 'match';
  const positive = match ? '해당함' : 'O';
  const negative = match ? '해당 없음' : 'X';
  return <article className="pc-study-card">
    <p className="pc-study-kicker">선지 {item.id.split('::').at(-1)}</p>
    <p className="font-semibold">{item.text}</p>
    <div className="pc-study-actions" role="group" aria-label="선지 판단">
      <button type="button" aria-pressed={answer === true} onClick={() => setAnswer(true)}>{positive}</button>
      <button type="button" aria-pressed={answer === false} onClick={() => setAnswer(false)}>{negative}</button>
    </div>
    {answer !== null && <div className="pc-study-feedback">
      <strong role="status">{answer === item.answer ? '정답' : '오답'} · {item.answer ? positive : negative}</strong>
      {item.explanation && <p><CitedText text={item.explanation}/></p>}
    </div>}
  </article>;
}

function LawCard({ item }: { item: StudyLaw }) {
  const [open,setOpen] = useState(false);
  return <article className="pc-study-card">
    <p className="pc-study-kicker">{[item.type,item.date,item.citations && '인용 ' + item.citations + '회'].filter(Boolean).join(' · ')}</p>
    <h2>{item.label}</h2>
    <div className="pc-study-law-lines">{item.lines.map((line,index) => {
      const blanks = item.blanks.filter(b => b.line === index).sort((a,b) => a.start-b.start);
      let end = 0;
      return <p key={index}>{blanks.map(blank => {
        if (blank.start < end) return null;
        const prefix = line.slice(end,blank.start);
        end = blank.end;
        return <span key={blank.start}>{prefix}{open ? <strong>{blank.answer}</strong> : <span className="pc-study-blank" aria-label="빈칸"/>}</span>;
      })}{line.slice(end)}</p>;
    })}</div>
    {!!item.blanks.length && <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? '다시 가리기' : '빈칸 답 확인'}</button>}
    <Sources sources={[...(item.sourceUrl ? [{label:item.type + ' 원문',url:item.sourceUrl}] : []), ...item.sources]}/>
  </article>;
}

function LawDeck({ items }: { items: StudyLaw[] }) {
  const [index, setIndex] = useState(0);
  const item = items[index];
  return <div className="pc-study-deck">
    <LawCard key={item.id} item={item}/>
    <nav aria-label="학습 항목 이동" className="pc-study-stepper">
      <button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)}>이전</button>
      <span aria-live="polite">{(index + 1).toLocaleString()} / {items.length.toLocaleString()}</span>
      <button type="button" disabled={index + 1 >= items.length} onClick={() => setIndex(index + 1)}>다음</button>
    </nav>
  </div>;
}

export default function PcStudyPanel({ feature, results, scope }: { feature: PcStudyFeature; results: Partial<PcStudy>; scope?: string }) {
  const close = useContext(CloseStudyDialog);
  let content;
  if (feature === 'cells' && results.cells?.length) {
    return <CellStudyWorkbook sheets={results.cells} exams={results.cellExams ?? []}
      storageKey={'bom-web-cell-' + (scope ?? 'study')} onBack={close}
      onOpenItem={({ exam }) => { if (exam.href?.startsWith('/')) window.open(exam.href, '_blank', 'noopener,noreferrer'); }}/>;

  } else if (feature === 'choices' && results.choices?.length) {
    content = results.choices.map(item => <AnswerCard key={item.id} item={item}/>);
  } else if (feature === 'traps' && results.traps?.length) {
    content = results.traps.map(item => <article className="pc-study-card pc-trap-pair" key={item.id}>
      <p><span className="pc-trap-label pc-trap-label--wrong">틀린 곳</span>{item.before}<del className="pc-trap-change pc-trap-change--wrong">{item.wrong}</del>{item.after}</p>
      <p><span className="pc-trap-label pc-trap-label--right">바르게</span>{item.before}<ins className="pc-trap-change pc-trap-change--right">{item.right}</ins>{item.after}</p>
      {item.explanation && <CitedText text={item.explanation}/>}
    </article>);
  } else if (feature === 'audio' && results.ox?.length) {
    return <AudioStudyPanel items={results.ox} originals={results.originals} onClose={close}/>;
  } else if (feature === 'ox' && results.ox?.length) {
    return <PocketOxPanel items={results.ox} originals={results.originals}/>;
  } else if (feature === 'law' && results.law?.length) {
    content = <LawDeck items={results.law}/>;
  } else {
    content = <p>연결된 학습 자료가 아직 없어요.</p>;
  }
  return <div className="pc-study-room">{content}</div>;
}
