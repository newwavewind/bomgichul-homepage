'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PocketOriginal, PocketQuestion } from '@/lib/pc-access/study';
import { CitedText } from '@/components/exam/CitedText';
import { plainStudyText } from '@/lib/study-text';
import { PocketQuestionOriginal } from './PocketQuestionOriginal';
import './pocket-audio.css';

const speeds = [0.85, 1, 1.25, 1.5, 2];
type Filter = 'all' | 'O' | 'X';
type Phase = 'idle' | 'reading' | 'thinking' | 'answer';

function AudioIcon({ name }: { name: 'speaker' | 'play' | 'pause' }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {name === 'play' ? <path d="m9 7 8 5-8 5V7Z" fill="currentColor" stroke="none"/>
      : name === 'pause' ? <path d="M9 7v10M15 7v10"/>
        : <path d="M5 10v4h3l4 3V7L8 10H5ZM16 9.5a4 4 0 0 1 0 5M18.5 7a7.5 7.5 0 0 1 0 10"/>}
  </svg>;
}

export default function AudioStudyPanel({ items, originals, onClose }: {
  items: PocketQuestion[]; originals?: Record<string, PocketOriginal>; onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [filter, setFilter] = useState<Filter>('all');
  const [rate, setRate] = useState(1);
  const [delay, setDelay] = useState(3);
  const [advance, setAdvance] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState('');
  const [jump, setJump] = useState<number | null>(null);
  const active = useRef(0);
  const speaking = useRef(false);
  const wait = useRef<number | null>(null);
  const session = filter === 'all' ? items : items.filter(item => item.answer === (filter === 'O'));
  const item = session[index];
  const original = item?.href ? originals?.[item.href] : undefined;

  const cancelCurrent = useCallback(() => {
    active.current++;
    if (wait.current !== null) {
      window.clearTimeout(wait.current);
      wait.current = null;
    }
    if (speaking.current) {
      speaking.current = false;
      window.speechSynthesis?.cancel();
    }
  }, []);

  useEffect(() => cancelCurrent, [cancelCurrent]);

  function stop() {
    cancelCurrent();
    setPlaying(false);
  }

  function move(next: number) {
    if (next < 0 || next >= session.length || next === index) return;
    stop();
    setError('');
    setPhase('idle');
    setIndex(next);
  }

  function play(position: number) {
    const current = session[position];
    if (!current) return;
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setError('이 브라우저에서 음성 읽기를 사용할 수 없어요.');
      return;
    }
    cancelCurrent();
    const token = active.current;
    setError('');
    setPlaying(true);
    setPhase('reading');
    setIndex(position);

    function speak(text: string, finished: () => void) {
      if (token !== active.current) return;
      const voice = new SpeechSynthesisUtterance(plainStudyText(text));
      voice.lang = 'ko-KR';
      voice.rate = rate;
      const koreanVoice = window.speechSynthesis.getVoices().find(value => value.lang.toLowerCase().startsWith('ko'));
      if (koreanVoice) voice.voice = koreanVoice;
      voice.onend = () => { if (token === active.current) { speaking.current = false; finished(); } };
      voice.onerror = event => {
        if (token !== active.current) return;
        speaking.current = false;
        setPlaying(false);
        if (!['canceled', 'interrupted'].includes(event.error)) setError('음성을 재생하지 못했어요. 브라우저의 한국어 음성 설정을 확인해 주세요.');
      };
      speaking.current = true;
      window.speechSynthesis.speak(voice);
    }

    speak(current.text, () => {
      setPhase('thinking');
      wait.current = window.setTimeout(() => {
        wait.current = null;
        if (token !== active.current) return;
        setPhase('answer');
        speak(['정답은 ' + (current.answer ? '오입니다.' : '엑스입니다.'), current.explanation].filter(Boolean).join(' '), () => {
          if (advance && position + 1 < session.length) play(position + 1);
          else setPlaying(false);
        });
      }, delay * 1000);
    });
  }

  const status = playing
    ? ({ idle: '대기', reading: '선지를 듣고 있어요', thinking: '속으로 O/X를 판단해 보세요', answer: '정답과 해설을 듣고 있어요' } as const)[phase]
    : phase === 'answer' ? '낭독 완료' : '재생을 눌러 시작하세요';

  return <main className="audio-study-screen audio-session-screen app-screen-d4 pc-pocket-audio">
    <div className="cc-d4-inner audio-study-inner">
      <h1 className="sr-only">포켓 오디오</h1>
      <header className="audio-session-header">
        <button type="button" className="audio-session-exit" onClick={onClose}><i aria-hidden>×</i><span>종료</span></button>
        <button type="button" className="audio-session-jump-trigger" onClick={() => setJump(index + 1)} disabled={!item} aria-label="선지 번호 이동">
          <span>포켓 오디오</span><strong>{item ? index + 1 : 0} / {session.length.toLocaleString()}</strong><small>번호 이동</small>
        </button>
        <span className={playing ? 'is-playing' : ''}><i aria-hidden/>{playing ? '낭독 중' : '대기'}</span>
      </header>
      <div className="audio-progress" aria-hidden><i style={{ width: (session.length ? (index + 1) / session.length * 100 : 0) + '%' }}/></div>
      <section className="audio-session">
        <div className={`audio-orb${playing ? ' is-speaking' : ''}`} aria-hidden><span><AudioIcon name="speaker"/></span><i/><i/><i/></div>
        <p className="audio-session-phase" role="status">{status}</p>
        <div className="audio-session-rate">
          <label className="audio-session-rate__row"><span>낭독 속도</span>
            <select value={rate} onChange={event => setRate(Number(event.target.value))}>
              {speeds.map(speed => <option key={speed} value={speed}>{speed}×</option>)}
            </select>
          </label>
          <label className="audio-session-rate__row"><span>정답 공개</span>
            <select value={delay} onChange={event => setDelay(Number(event.target.value))}>
              <option value={0}>바로 공개</option><option value={3}>3초 후</option><option value={5}>5초 후</option>
            </select>
          </label>
          <label className="audio-session-rate__row"><span>선지 유형</span>
            <select value={filter} onChange={event => {
              stop(); setPhase('idle'); setError(''); setIndex(0); setJump(null);
              setFilter(event.target.value as Filter);
            }}>
              <option value="all">모든 선지</option><option value="O">옳은 선지</option><option value="X">틀린 선지</option>
            </select>
          </label>
        </div>
        {error && <p className="audio-hear-block" role="alert">{error}</p>}
        {jump !== null && <form className="pc-audio-jump" onSubmit={event => { event.preventDefault(); move(jump - 1); setJump(null); }}>
          <label>선지 번호 <input type="number" min="1" max={session.length} value={jump} required onChange={event => setJump(Number(event.target.value))}/></label>
          <button type="submit">이동</button><button type="button" onClick={() => setJump(null)}>닫기</button>
        </form>}
        {item ? <>
          <article className="audio-statement-card" key={item.id}>
            <div className="audio-statement-meta"><span>{item.source}</span></div>
            <p className="audio-statement-text">{item.text}</p>
            {phase === 'answer' && <div className={`audio-answer-reveal ${item.answer ? 'is-o' : 'is-x'}`}>
              <strong>{item.answer ? 'O' : 'X'}</strong><span>{item.answer ? '옳은' : '틀린'} 선지</span>
            </div>}
            <details className="audio-explanation-panel" open={phase === 'answer' ? true : undefined}>
              <summary>정답과 해설</summary><p>{item.answer ? 'O' : 'X'} · <CitedText text={item.explanation}/></p>
            </details>
            {original && <PocketQuestionOriginal question={original} audio/>}
          </article>
          <div className="audio-transport">
            <button type="button" className="audio-transport__side" disabled={index === 0} onClick={() => move(index - 1)} aria-label="이전 문장"><span>이전</span></button>
            <div className="audio-transport__center">
              <button type="button" className="audio-main-control" onClick={() => playing ? stop() : play(index)} aria-label={playing ? '일시정지' : '재생'}><AudioIcon name={playing ? 'pause' : 'play'}/></button>
            </div>
            <button type="button" className="audio-transport__side" disabled={index + 1 >= session.length} onClick={() => move(index + 1)} aria-label="다음 문장"><span>다음</span></button>
          </div>
          <label className="audio-handsfree"><input type="checkbox" checked={advance} onChange={event => setAdvance(event.target.checked)}/> 다음 선지 자동 재생</label>
        </> : <p>선택한 유형의 선지가 없어요.</p>}
      </section>
    </div>
  </main>;
}
