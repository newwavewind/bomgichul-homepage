"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NavigationChevron } from "@/components/ui/backLinkShared";
import type { SyntaxPracticeCard } from "@/lib/english-study-types";
import { fetchEnglishStudy, initialSyntaxProgress, isStudyShortcut, syntaxProgressKey, toggleStudyId, useStudyProgress } from "./english-study-client";
import { prepareSyntaxClip, useSyntaxAudio } from "./useSyntaxAudio";

const days = Array.from({ length: 30 }, (_, index) => index + 1);

type DeckProps = {
  card: SyntaxPracticeCard;
  position: number;
  total: number;
  marked: boolean;
  onMark: () => void;
  onReview: (known: boolean) => void;
  onPrevious?: () => void;
  onNext?: () => void;
};

function PracticeDeck({ card, position, total, marked, onMark, onReview, onPrevious, onNext }: DeckProps) {
  const [step, setStep] = useState(0);
  const [autoRead, setAutoRead] = useStudyProgress("bom-english-syntax-auto-read", true);
  const { element, state, play, stop } = useSyntaxAudio();
  const chunks = card.chunks.length ? card.chunks : [{ en: card.sentence, ko: card.translation, audio: card.audio }];
  const complete = step > chunks.length;
  const nextClip = chunks[step]?.audio;
  const audioActive = state === "loading" || state === "playing";

  useEffect(() => {
    prepareSyntaxClip(card.audio);
    prepareSyntaxClip(nextClip);
  }, [card.audio, nextClip]);

  function back() {
    stop();
    if (step) setStep(step - 1);
    else onPrevious?.();
  }

  function next() {
    if (complete) {
      if (onNext) onNext();
      else { stop(); setStep(0); }
      return;
    }
    const value = step + 1;
    setStep(value);
    const chunk = chunks[step];
    if (autoRead) play(chunk ? chunk.audio : card.audio, chunk?.en ?? card.sentence);
  }

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (!isStudyShortcut(event)) return;
      const space = event.code === "Space";
      if (space && event.target instanceof HTMLElement && event.target.closest("button, a")) return;
      if (!space && !["ArrowLeft", "ArrowRight", "Enter"].includes(event.key)) return;
      if (event.key === "Enter" && event.target instanceof HTMLElement && event.target.closest("button, a")) return;
      event.preventDefault();
      if (event.key === "ArrowLeft") back();
      else next();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  });

  const label = complete ? onNext ? "다음 문장" : "다시 연습" : step === chunks.length ? "전체 해석 보기" : "다음 덩이 보기";
  const percent = Math.round(step / (chunks.length + 1) * 100);
  return (
    <article className="es-reader es-practice">
      <audio ref={element} preload="none" hidden />
      <header className="es-practice-bar">
        <div className="es-practice-meta">
          <span className="es-practice-position">{card.no}번 문장 · {position} / {total}</span>
          <Link href={card.href} prefetch={false}>{card.source} ↗</Link>
        </div>
        <div className="es-practice-actions">
          <button type="button" className="es-button" aria-pressed={audioActive}
            onClick={() => audioActive ? stop() : play(card.audio, card.sentence)}>
            {audioActive ? "듣기 정지" : "문장 듣기"}
          </button>
          <button type="button" className="es-button" aria-pressed={autoRead} onClick={() => {
            setAutoRead(!autoRead);
            if (autoRead) stop(); else play(card.audio, card.sentence);
          }}>{autoRead ? "자동 읽기 켬" : "자동 읽기 끔"}</button>
          <button type="button" className="es-button es-card-mark" aria-pressed={marked} onClick={onMark}>
            {marked ? "★ 북마크" : "☆ 북마크"}
          </button>
        </div>
      </header>
      {state === "error" && <p className="es-practice-status" role="status">음성을 재생하지 못했어요. 문장 듣기를 다시 눌러 주세요.</p>}
      <div className="es-practice-body">
        <p className="es-practice-sentence" aria-label="끊어 읽기" lang="en">
          {chunks.map((chunk, index) => {
            function replay() {
              setStep(index + 1);
              play(chunk.audio, chunk.en);
            }
            return <span key={index}>
              {index > 0 && " "}
              <span className="es-chunk" role="button" tabIndex={0} data-revealed={index < step}
                data-current={index === step - 1 && !complete}
                onClick={replay} onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  if (!event.repeat) replay();
                }}>{chunk.en}</span>
            </span>;
          })}
        </p>
        <div className="es-practice-glosses" aria-live="polite">
          {step > 0 && <>
            <h2>직독직해</h2>
            <ul>
              {chunks.slice(0, step).map((chunk, index) => (
                <li key={index} aria-current={index === step - 1 && !complete ? "step" : undefined}>{chunk.ko}</li>
              ))}
            </ul>
          </>}
        </div>
        {complete && <div className="es-practice-translation">
          <h2>전체 해석</h2>
          <p className="es-translation">{card.translation}</p>
        </div>}
      </div>
      <progress className="sr-only" value={step} max={chunks.length + 1} aria-label="문장 암기 진행" />
      <div className="es-practice-controls">
        <button type="button" className="es-step-back" aria-label="이전 덩이 또는 문장" onClick={back} disabled={!step && !onPrevious}>
          <NavigationChevron direction="left" size={22} />
        </button>
        <button type="button" className="es-step-forward" data-complete={complete}
          style={{ "--es-step-progress": `${percent}%` } as React.CSSProperties} onClick={next}>
          <span>{label} {!complete && <small>{Math.min(step, chunks.length)} / {chunks.length}</small>}</span>
          <span className="es-step-knob">
            <NavigationChevron direction="right" size={22} />
          </span>
        </button>
      </div>
      <footer className="es-practice-footer">
        <div className="es-tools">
          {complete ? <>
            <button type="button" className="es-button" onClick={() => onReview(false)}>다시 볼 문장</button>
            <button type="button" className="es-button" onClick={() => onReview(true)}>외웠어요</button>
          </> : <button type="button" className="es-button" onClick={() => {
            setStep(chunks.length + 1);
            if (autoRead) play(card.audio, card.sentence);
          }}>전체 해석</button>}
          <Link className="es-link" href={`/english/concepts/gong9/${encodeURIComponent(card.id)}`} prefetch={false}>문장 해설 ↗</Link>
        </div>
        <p className="es-keyboard"><kbd>←</kbd> 되돌리기 <kbd>→</kbd> <kbd>Space</kbd> 이어 읽기</p>
      </footer>
    </article>
  );
}

export function EnglishSyntaxPractice({ firstDay, initialDay, initialCardId }: {
  firstDay: SyntaxPracticeCard[]; initialDay: number; initialCardId?: string;
}) {
  const [progress, save] = useStudyProgress(syntaxProgressKey, initialSyntaxProgress);
  const [jumpToCard, setJumpToCard] = useState(!!initialCardId);
  const [daysByNumber, setDays] = useState<Record<number, SyntaxPracticeCard[]>>({ [initialDay]: firstDay });
  const [filter, setFilter] = useState<"all" | "marked" | "missed">("all");
  const [error, setError] = useState("");
  const [attempt, retry] = useState(0);
  const day = jumpToCard ? initialDay : days.includes(progress.day) ? progress.day : 1;
  const dayCards = daysByNumber[day];

  useEffect(() => {
    if (dayCards) return;
    const request = new AbortController();
    fetchEnglishStudy<SyntaxPracticeCard[]>(new URLSearchParams({ day: String(day) }), request.signal)
      .then((cards) => setDays((previous) => ({ ...previous, [day]: cards })))
      .catch(() => { if (!request.signal.aborted) setError("문장을 불러오지 못했습니다."); });
    return () => request.abort();
  }, [day, dayCards, attempt]);

  const deck = (dayCards ?? []).filter((card) => filter === "all" || progress[filter].includes(card.id));
  const index = Math.max(0, deck.findIndex((card) => card.id === (jumpToCard ? initialCardId : progress.cardId)));
  const card = deck[index];
  const select = (cardId: string) => { setJumpToCard(false); save({ ...progress, day, cardId }); };

  return (
    <div className="es-workspace">
      <aside className="es-sidebar es-syntax-sidebar" aria-label="암기 문장 목록">
        <div className="es-filters">
          <label className="es-field">학습 분량
            <select value={day} onChange={(event) => {
              setError("");
              setJumpToCard(false);
              save({ ...progress, day: Number(event.target.value), cardId: "" });
            }}>
              {days.map((number) => <option key={number} value={number}>Day {number}</option>)}
            </select>
          </label>
          <div className="es-tabs" aria-label="문장 필터">
            {([["all", "전체"], ["marked", "북마크"], ["missed", "다시 보기"]] as const).map(([value, label]) => (
              <button type="button" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>
            ))}
          </div>
        </div>
        <p className="es-count">{dayCards ? `${deck.length}문장 · 외움 ${dayCards.filter((item) => progress.known.includes(item.id)).length}` : "문장 불러오는 중…"}</p>
        <ol className="es-list">
          {deck.map((item) => <li key={item.id}>
            <button type="button" aria-current={card?.id === item.id ? "true" : undefined} onClick={() => select(item.id)}>
              <span className="es-kicker">{item.no}번{progress.known.includes(item.id) && " · 외움"}</span>
              <span lang="en">{item.sentence}</span>
            </button>
          </li>)}
        </ol>
      </aside>
      {card ? <PracticeDeck key={card.id} card={card} position={index + 1} total={deck.length}
        marked={progress.marked.includes(card.id)}
        onMark={() => save({ ...progress, marked: toggleStudyId(progress.marked, card.id) })}
        onReview={(known) => { setJumpToCard(false); save({
          ...progress, day,
          cardId: deck[index + 1]?.id ?? card.id,
          known: known ? [...new Set([...progress.known, card.id])] : progress.known.filter((id) => id !== card.id),
          missed: known ? progress.missed.filter((id) => id !== card.id) : [...new Set([...progress.missed, card.id])],
        }); }}
        onPrevious={deck[index - 1] ? () => select(deck[index - 1].id) : undefined}
        onNext={deck[index + 1] ? () => select(deck[index + 1].id) : undefined}
      /> : <div className="es-reader es-empty" role="status">
        {error ? <>{error} <button type="button" className="es-button" onClick={() => { setError(""); retry(attempt + 1); }}>다시 시도</button></>
          : dayCards ? "이 Day에 해당하는 문장이 없어요." : "학습 자료를 불러오는 중이에요."}
      </div>}
    </div>
  );
}
