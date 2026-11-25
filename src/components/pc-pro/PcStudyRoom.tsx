'use client';

import { useEffect, useRef, useState } from 'react';
import type { PcStudy, PocketQuestion, StudyChoice, StudyLaw, StudySheet, StudySource } from '@/lib/pc-access/study';
import type { PcStudyFeature } from '@/lib/pc-access/study-features';
import { CitedText } from '@/components/exam/CitedText';
import './pc-study.css';

function Sources({ sources }: { sources: StudySource[] }) {
  if (!sources.length) return null;
  return <ul className="pc-study-sources" aria-label="학습 근거">
    {sources.map(({label,url},index) => <li key={label + index}>
      {url ? <a href={url} target="_blank" rel="noreferrer">{label} ↗</a> : <span>{label}</span>}
    </li>)}
  </ul>;
}

function Stepper({ index, count, onChange }: { index: number; count: number; onChange: (index: number) => void }) {
  return <nav aria-label="학습 항목 이동" className="pc-study-stepper">
    <button type="button" disabled={index === 0} onClick={() => onChange(index - 1)}>이전</button>
    <span aria-live="polite">{(index + 1).toLocaleString()} / {count.toLocaleString()}</span>
    <button type="button" disabled={index + 1 >= count} onClick={() => onChange(index + 1)}>다음</button>
  </nav>;
}

function SheetTable({ sheet }: { sheet: StudySheet }) {
  const [selected, setSelected] = useState<{row:number;column:number} | null>(null);
  const cell = selected ? sheet.rows[selected.row].cells[selected.column] : null;
  return <div className="pc-study-card">
    <p className="pc-study-kicker">{sheet.group}</p>
    <h2>{sheet.title}</h2>
    <div className="pc-study-table-scroll">
      <table className="pc-study-table">
        <thead><tr><th scope="col">구분</th>{sheet.columns.map((column,i) => <th scope="col" key={i}>{column}</th>)}</tr></thead>
        <tbody>{sheet.rows.map((row,rowIndex) => <tr key={rowIndex}>
          <th scope="row">{row.label}</th>
          {sheet.columns.map((_,column) => <td key={column}>
            {row.cells[column]?.text && <button type="button" aria-pressed={selected?.row === rowIndex && selected.column === column}
              onClick={() => setSelected({row:rowIndex,column})}>{row.cells[column].text}</button>}
          </td>)}
        </tr>)}</tbody>
      </table>
    </div>
    {cell && <section className="pc-study-feedback" aria-label="셀 상세 해설">
      <h3>{cell.text}</h3>
      {cell.notes.map((note,index) => <p key={index}>{note}</p>)}
      <Sources sources={cell.sources}/>
    </section>}
  </div>;
}

function CellStudy({ sheets }: { sheets: StudySheet[] }) {
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(sheets[0].id);
  const matches = sheets.filter(sheet => (sheet.group + ' ' + sheet.title).includes(search.trim()));
  const sheet = matches.find(sheet => sheet.id === active) ?? matches[0];
  return <div className="pc-study-sheet-layout">
    <div className="pc-study-card pc-study-sheet-list">
      <label htmlFor="pc-study-search">시트 검색</label>
      <input id="pc-study-search" value={search} onChange={event => setSearch(event.target.value)} placeholder="단원 이름"/>
      <ul>
        {matches.map(row => <li key={row.id}><button type="button" aria-pressed={row.id === sheet?.id}
          onClick={() => setActive(row.id)}>{row.title}</button></li>)}
      </ul>
    </div>
    {sheet ? <SheetTable key={sheet.id} sheet={sheet}/> : <p>검색 조건에 맞는 시트가 없어요.</p>}
  </div>;
}

function AnswerCard({ item, compact = false }: { item: StudyChoice | PocketQuestion; compact?: boolean }) {
  const [answer, setAnswer] = useState<boolean | null>(null);
  const match = 'mode' in item && item.mode === 'match';
  const positive = match ? '해당함' : 'O';
  const negative = match ? '해당 없음' : 'X';
  return <article className="pc-study-card">
    {compact ? <p className="pc-study-kicker">선지 {item.id.split('::').at(-1)}</p> : <p className="pc-study-kicker">{item.source}</p>}
    {!compact && 'stem' in item && <p>{item.stem}</p>}
    {compact ? <p className="font-semibold">{item.text}</p> : <h2>{item.text}</h2>}
    <div className="pc-study-actions" role="group" aria-label="선지 판단">
      <button type="button" aria-pressed={answer === true} onClick={() => setAnswer(true)}>{positive}</button>
      <button type="button" aria-pressed={answer === false} onClick={() => setAnswer(false)}>{negative}</button>
    </div>
    {answer !== null && <div className="pc-study-feedback">
      <strong role="status">{answer === item.answer ? '정답' : '오답'} · {item.answer ? positive : negative}</strong>
      {item.explanation && <p><CitedText text={item.explanation}/></p>}
    </div>}
    {!compact && item.href && <Sources sources={[{label:'원문 기출 보기',url:item.href}]}/>}
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

function AudioCard({ item, onNext }: { item: PocketQuestion; onNext: () => void }) {
  const [playing,setPlaying] = useState(false);
  const [error,setError] = useState('');
  const [advance,setAdvance] = useState(false);
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    return () => { active.current = false; window.speechSynthesis?.cancel(); };
  }, []);

  function listen() {
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setError('이 브라우저에서는 기기 음성 읽기를 지원하지 않아요.');
      return;
    }
    setError('');
    const text = [item.text,'정답은 ' + (item.answer ? '오입니다.' : '엑스입니다.'),item.explanation].filter(Boolean).join(' ');
    const voice = new SpeechSynthesisUtterance(text.replace(/[*#]/gu,''));
    voice.lang = 'ko-KR';
    voice.rate = 0.95;
    voice.onend = () => { if (active.current) { setPlaying(false); if (advance) onNext(); } };
    voice.onerror = event => {
      if (!active.current) return;
      setPlaying(false);
      if (!['canceled','interrupted'].includes(event.error)) setError('기기 음성을 재생할 수 없어요. 브라우저의 음성 설정을 확인해 주세요.');
    };
    setPlaying(true);
    window.speechSynthesis.speak(voice);
  }
  return <article className="pc-study-card">
    <p className="pc-study-kicker">{item.source} · 브라우저 음성</p>
    <h2>{item.text}</h2>
    <div className="pc-study-actions">
      <button type="button" onClick={listen}>{playing ? '정지' : '지문과 해설 듣기'}</button>
      <label><input type="checkbox" checked={advance} onChange={event => setAdvance(event.target.checked)}/> 재생 뒤 다음 카드</label>
    </div>
    {error && <p role="alert">{error}</p>}
    <details><summary>정답과 해설</summary><p>{item.answer ? 'O' : 'X'} · {item.explanation}</p></details>
  </article>;
}

function StudyDeck({ feature, items }: { feature: 'audio' | 'ox' | 'law'; items: (PocketQuestion | StudyLaw)[] }) {
  const [index,setIndex] = useState(0);
  const item = items[index];
  const next = () => setIndex(value => Math.min(value + 1, items.length - 1));
  return <div className="pc-study-deck">
    {'type' in item ? <LawCard key={item.id} item={item}/>
      : feature === 'audio' ? <AudioCard key={item.id} item={item} onNext={next}/>
        : <AnswerCard key={item.id} item={item}/>}
    <Stepper index={index} count={items.length} onChange={setIndex}/>
  </div>;
}

export default function PcStudyPanel({ feature, results }: { feature: PcStudyFeature; results: Partial<PcStudy> }) {
  let content;
  if (feature === 'cells' && results.cells?.length) {
    content = <CellStudy sheets={results.cells}/>;
  } else if (feature === 'choices' && results.choices?.length) {
    content = results.choices.map(item => <AnswerCard key={item.id} item={item} compact/>);
  } else if (feature === 'traps' && results.traps?.length) {
    content = results.traps.map(item => <article className="pc-study-card pc-trap-pair" key={item.id}>
      <p><span className="pc-trap-label pc-trap-label--wrong">틀린 곳</span>{item.before}<mark>{item.wrong}</mark>{item.after}</p>
      <p><span className="pc-trap-label pc-trap-label--right">바르게</span>{item.before}<strong>{item.right}</strong>{item.after}</p>
      {item.explanation && <CitedText text={item.explanation}/>}
    </article>);
  } else if ((feature === 'audio' || feature === 'ox') && results.ox?.length) {
    content = <StudyDeck feature={feature} items={results.ox}/>;
  } else if (feature === 'law' && results.law?.length) {
    content = <StudyDeck feature={feature} items={results.law}/>;
  } else {
    content = <p>연결된 학습 자료가 아직 없어요.</p>;
  }
  return <div className="pc-study-room">{content}</div>;
}
