'use client';

import { useEffect, useRef, useState } from 'react';
import type { PocketOriginal, PocketQuestion } from '@/lib/pc-access/study';
import { CitedText } from '@/components/exam/CitedText';
import { PocketQuestionOriginal } from './PocketQuestionOriginal';
import './pocket-ox.css';

export default function PocketOxPanel({ items, originals }: {
  items: PocketQuestion[]; originals?: Record<string, PocketOriginal>;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const root = useRef<HTMLDivElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const item = items[index];
  const answer = answers[index];
  const judged = answer !== undefined;
  const correct = answer === item.answer;
  const original = item.href ? originals?.[item.href] : undefined;

  useEffect(() => {
    const dialog = root.current?.closest('dialog');
    if (!dialog) return;
    function handleKey(event: KeyboardEvent) {
      const target = event.target;
      if (event.defaultPrevented || event.isComposing || event.repeat || event.ctrlKey || event.metaKey ||
          event.altKey || !(target instanceof Element) || target.closest('input, textarea, select, [contenteditable]')) return;
      switch (event.key) {
        case 'ArrowDown': {
          const details = root.current?.querySelector<HTMLDetailsElement>('.pc-pocket-original');
          if (details) {
            event.preventDefault();
            details.open = !details.open;
          }
          return;
        }
        case '1':
        case '2':
          event.preventDefault();
          setAnswers(previous => ({ ...previous, [index]: event.key === '1' }));
          return;
        case 'Enter':
          if (target.closest('a')) return;
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          break;
        default:
          return;
      }
      event.preventDefault();
      const offset = event.key === 'ArrowLeft' ? -1 : 1;
      setIndex(previous => Math.max(0, Math.min(items.length - 1, previous + offset)));
    }
    dialog.addEventListener('keydown', handleKey);
    return () => dialog.removeEventListener('keydown', handleKey);
  }, [index, items.length]);

  useEffect(() => { scroll.current?.scrollTo(0, 0); }, [index]);

  return <div className="pc-pocket-ox" ref={root}>
    <div className="pocket-ox-progress">
      <span aria-live="polite">{(index + 1).toLocaleString()} / {items.length.toLocaleString()}</span>
      <progress value={index + 1} max={items.length} aria-label="선지 진행률"/>
    </div>
    <div className="pocket-ox-content" ref={scroll}>
      <div className="fillblank-deck" data-stack={Math.min(2, items.length - index - 1)}>
        <article className="fillblank-card--ox" key={item.id}>
          <header className="pocket-ox-meta">{item.source}</header>
          <div className="pocket-ox-statement">
            {judged && <p className={`fillblank-verdict ${correct ? 'is-correct' : 'is-wrong'}`} role="status">
              내 답 {answer ? 'O' : 'X'} · 정답 {item.answer ? 'O' : 'X'} · {correct ? '맞았어요' : '틀렸어요'}
            </p>}
            <h3>{item.text}</h3>
            {judged && item.explanation && <details className="pocket-ox-explanation" open={!correct || undefined}>
              <summary>해설 보기</summary>
              <p><CitedText text={item.explanation}/></p>
            </details>}
          </div>
          {original && <PocketQuestionOriginal question={original}/>}
        </article>
      </div>
    </div>
    <footer className="fillblank-thumbbar">
      {!judged && <p className="fillblank-thumbbar__hint">이 문장이 맞으면 O, 틀리면 X</p>}
      <div className="fillblank-actions--judge" role="group" aria-label="선지 판단과 이동">
        <button type="button" className="fillblank-judge__nav" aria-label="이전 선지" aria-keyshortcuts="ArrowLeft"
          disabled={index === 0} onClick={() => setIndex(index - 1)}>‹</button>
        <button type="button" className="fillblank-judge__btn fillblank-judge__btn--O" aria-label="O" aria-keyshortcuts="1"
          aria-pressed={answer === true} onClick={() => setAnswers(previous => ({ ...previous, [index]: true }))}>
          <svg viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="6.6"/></svg>
        </button>
        <button type="button" className="fillblank-judge__btn fillblank-judge__btn--X" aria-label="X" aria-keyshortcuts="2"
          aria-pressed={answer === false} onClick={() => setAnswers(previous => ({ ...previous, [index]: false }))}>
          <svg viewBox="0 0 24 24" aria-hidden><path d="m6.5 6.5 11 11m0-11-11 11"/></svg>
        </button>
        <button type="button" className="fillblank-judge__nav" aria-label="다음 선지" aria-keyshortcuts="ArrowRight Enter"
          disabled={index + 1 >= items.length} onClick={() => setIndex(index + 1)}>›</button>
      </div>
      <p className="pc-study-keyboard-hint">
        <span><kbd>1</kbd> O <kbd>2</kbd> X</span><span><kbd>←</kbd><kbd>→</kbd> 선지 이동</span>
        <span><kbd>Enter</kbd> 다음</span>{original && <span><kbd>↓</kbd> 원문</span>}
      </p>
    </footer>
  </div>;
}
