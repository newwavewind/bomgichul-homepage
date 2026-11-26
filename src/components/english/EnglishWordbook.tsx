"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { WordDetail, WordRow } from "@/lib/english-study-types";
import { EnglishWordbookRank, type RankAccess } from "./EnglishWordbookRank";
import { fetchEnglishStudy, isStudyShortcut, speakStudyEnglish, toggleStudyId, useStudyProgress } from "./english-study-client";

const initialProgress = { known: [] as string[], wrong: [] as string[] };
const kinds = ["단어", "숙어", "구동사", "관용"];
const days = Array.from({ length: 30 }, (_, index) => index + 1);
const pageSize = 42;

function sourceLink(source: string) {
  const match = /^(국가직|지방직)영어-(\d{4})-Q(\d+)$/.exec(source);
  return match ? { label: `${match[1]} ${match[2]}년 ${match[3]}번`, href: `/english/exam/gong9/${match[2]}/${encodeURIComponent(match[1])}/${match[3]}` } : null;
}

function ExampleCard({ row }: { row: WordRow }) {
  const [detail, setDetail] = useState<WordDetail>();
  const [failed, setFailed] = useState(false);
  const [attempt, retry] = useState(0);

  useEffect(() => {
    const request = new AbortController();
    fetchEnglishStudy<WordDetail>(new URLSearchParams({ word: row.id }), request.signal)
      .then(setDetail)
      .catch(() => { if (!request.signal.aborted) setFailed(true); });
    return () => request.abort();
  }, [row.id, attempt]);

  if (!detail) return (
    <div className="es-empty" role="status">
      {failed ? <button type="button" className="es-button" onClick={() => { setFailed(false); retry(attempt + 1); }}>예문 다시 불러오기</button> : "기출 예문을 불러오는 중이에요."}
    </div>
  );

  return (
    <>
      <section className="es-example-list" aria-label="뜻과 기출 예문">
        {detail.senses.map((sense, index) => {
          const source = sourceLink(sense.source);
          return <div className="es-example" key={`${sense.source}:${index}`}>
            <p className="es-definition">{sense.meaning}</p>
            {source && <Link href={source.href} prefetch={false} className="es-kicker">{source.label} ↗</Link>}
            {sense.example && <p lang="en" className="es-example-text">{sense.example}</p>}
            {sense.translation && <p className="es-muted">{sense.translation}</p>}
          </div>;
        })}
      </section>
      {detail.notes.map((section) => (
        <section className="es-word-note" key={section.title}>
          <h3>{section.title}</h3>
          <dl>{section.entries.map(([term, meaning], index) => <div key={`${term}:${index}`}>
            <dt lang="en">{term}</dt><dd>{meaning}</dd>
          </div>)}</dl>
        </section>
      ))}
      {(detail.tip || detail.more) && <section className="es-word-note">
        <h3>시험 포인트</h3>
        {detail.tip && <p>{detail.tip}</p>}
        {detail.more && <p>{detail.more}</p>}
      </section>}
    </>
  );
}

type Direction = "en-ko" | "ko-en";
type Quiz = { rows: WordRow[]; index: number; right: number; combo: number; best: number; sessionId: string; ranked: boolean };
type RankAnswer = { sessionId: string; position: number; wordId: string; direction: Direction; picked: string };

function newQuiz(rows: WordRow[], ranked = false): Quiz {
  return { rows, index: 0, right: 0, combo: 0, best: 0, sessionId: crypto.randomUUID(), ranked };
}

function buildChoices(row: WordRow, index: number, direction: Direction, words: WordRow[]) {
  const label = (item: WordRow) => direction === "en-ko" ? item.meanings[0] : item.term;
  const correct = label(row);
  const options = [correct];
  for (let offset = 1; offset < words.length && options.length < 4; offset++) {
    const candidate = words[(index + 71 * offset) % words.length];
    const text = label(candidate);
    if (candidate.id === row.id || options.includes(text) || candidate.meanings.some((meaning) => row.meanings.includes(meaning))) continue;
    options.push(text);
  }
  const rotate = index % options.length;
  return { correct, options: [...options.slice(rotate), ...options.slice(0, rotate)] };
}

function WordQuizCard({ row, index, direction, words, combo, onAnswer, onNext }: {
  row: WordRow; index: number; direction: Direction; words: WordRow[]; combo: number;
  onAnswer: (correct: boolean, picked: string) => void; onNext: () => void;
}) {
  const [answer, setAnswer] = useState<string>();
  const nextButton = useRef<HTMLButtonElement>(null);
  const { correct, options } = useMemo(() => buildChoices(row, index, direction, words), [row, index, direction, words]);
  function choose(option: string) {
    if (answer !== undefined) return;
    setAnswer(option);
    onAnswer(option === correct, option);
  }

  useEffect(() => {
    if (answer !== undefined) nextButton.current?.focus({ preventScroll: true });
  }, [answer]);

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (!isStudyShortcut(event)) return;
      const index = Number(event.key) - 1;
      if (/^[1-4]$/.test(event.key) && options[index]) {
        event.preventDefault();
        choose(options[index]);
      } else if (event.key === "Enter" && answer !== undefined) {
        if (event.target instanceof HTMLElement
          && event.target.closest('button:not([aria-disabled="true"]), a[href]')) return;
        event.preventDefault();
        onNext();
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  });

  return <>
    <div className="es-word-head es-word-quiz-head">
      <p className="es-kicker">{row.kind} · {row.count}회 출제</p>
      <div className="es-quiz-prompt">
        <h2 lang={direction === "en-ko" ? "en" : "ko"}>{direction === "en-ko" ? row.term : row.meanings[0]}</h2>
        {combo > 0 && <span className="es-quiz-combo" role="status"
          data-burst={answer === correct} data-milestone={combo >= 3}>
          <span className="sr-only">{combo}회 연속 정답</span>
          <span className="es-combo-spark" aria-hidden="true">✦</span>
          <strong aria-hidden="true">×{combo}</strong>
          <span className="es-combo-caption" aria-hidden="true">콤보</span>
        </span>}
      </div>
    </div>
    <div className="es-choices" aria-label="단어 카드 선택지">
      {options.map((option, index) => (
        <button key={option} type="button"
          data-result={answer === undefined ? undefined : option === correct ? "correct" : option === answer ? "wrong" : undefined}
          aria-disabled={answer !== undefined}
          onClick={() => choose(option)}>
          <kbd>{index + 1}</kbd><span lang={direction === "en-ko" ? "ko" : "en"}>{option}</span>
        </button>
      ))}
    </div>
    {answer !== undefined && <div className="es-quiz-result" data-correct={answer === correct}>
      <p role="status">{answer === correct ? "맞았어요." : <>정답 <strong>{correct}</strong></>}</p>
      <button ref={nextButton} type="button" className="es-button es-primary" onClick={onNext}>다음 카드 →</button>
    </div>}
    <p className="es-keyboard"><kbd>1</kbd>–<kbd>4</kbd> 선택 <kbd>Enter</kbd> 다음 카드</p>
  </>;
}

export function EnglishWordbook({ rankAccess }: { rankAccess: RankAccess }) {
  const [progress, save] = useStudyProgress("bom-english-wordbook-v1", initialProgress);
  const [catalogue, setCatalogue] = useState<WordRow[]>();
  const [failed, setFailed] = useState(false);
  const [attempt, retry] = useState(0);
  const [day, setDay] = useState(0);
  const [kind, setKind] = useState("");
  const [query, setQuery] = useState("");
  const [shelf, setShelf] = useState<"learn" | "known" | "wrong">("learn");
  const [showMeaning, setShowMeaning] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState("");
  const [direction, setDirection] = useStudyProgress<Direction>("bom-english-wordbook-direction", "en-ko");
  const [quiz, setQuiz] = useState<Quiz>();
  const [rankOpen, setRankOpen] = useState(false);
  const [rankRefresh, setRankRefresh] = useState(0);
  const [failedAnswers, setFailedAnswers] = useState<RankAnswer[]>([]);

  useEffect(() => {
    const request = new AbortController();
    fetchEnglishStudy<WordRow[]>(new URLSearchParams({ view: "words" }), request.signal)
      .then(setCatalogue)
      .catch(() => { if (!request.signal.aborted) setFailed(true); });
    return () => request.abort();
  }, [attempt]);

  const rows = useMemo(() => {
    const search = query.trim().toLowerCase();
    const known = new Set(progress.known);
    const wrong = new Set(progress.wrong);
    return (catalogue ?? []).filter((word) =>
      (!day || word.day === day) && (!kind || kind === word.kind)
      && (!search || word.term.toLowerCase().includes(search) || word.meanings.some((meaning) => meaning.includes(search)))
      && (shelf === "known" ? known.has(word.id) : shelf === "wrong" ? wrong.has(word.id) : !known.has(word.id)),
    );
  }, [catalogue, day, kind, progress, query, shelf]);
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selected = visible.find((word) => word.id === selectedId) ?? visible[0];
  const quizCard = quiz?.rows[quiz.index];
  const resetPage = () => { setPage(1); setSelectedId(""); setQuiz(undefined); };

  function setKnown(id: string) {
    const known = toggleStudyId(progress.known, id);
    save({ known, wrong: known.includes(id) ? progress.wrong.filter((entry) => entry !== id) : progress.wrong });
  }

  async function recordRank(answer: RankAnswer) {
    const isSameAnswer = (entry: RankAnswer) => entry.sessionId === answer.sessionId && entry.position === answer.position;
    try {
      const response = await fetch("/api/exam-track/english-wordbook-rank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answer),
        keepalive: true,
      });
      if (!response.ok) throw new Error("Could not save the quiz answer");
      setFailedAnswers((previous) => previous.filter((entry) => !isSameAnswer(entry)));
      setRankRefresh((previous) => previous + 1);
    } catch {
      setFailedAnswers((previous) => previous.some(isSameAnswer) ? previous : [...previous, answer]);
    }
  }

  return (
    <div className="es-workspace">
      <aside className="es-sidebar" aria-label="기출 단어 목록">
        <div className="es-filters">
          <label className="es-field">단어 검색
            <input type="search" placeholder="단어 또는 뜻" value={query} onChange={(event) => {
              setQuery(event.target.value); resetPage();
            }} />
          </label>
          <div className="es-filter-row">
            <label className="es-field">학습 분량
              <select value={day} onChange={(event) => { setDay(Number(event.target.value)); resetPage(); }}>
                <option value={0}>전체 Day</option>
                {days.map((day) => <option key={day} value={day}>Day {day}</option>)}
              </select>
            </label>
            <label className="es-field">갈래
              <select value={kind} onChange={(event) => { setKind(event.target.value); resetPage(); }}>
                <option value="">전체 갈래</option>
                {kinds.map((kind) => <option key={kind}>{kind}</option>)}
              </select>
            </label>
          </div>
          <div className="es-tabs" aria-label="복습 목록 선택">
            {([["learn", "학습"], ["known", "외움"], ["wrong", "오답"]] as const).map(([value, label]) =>
              <button key={value} type="button" aria-pressed={shelf === value} onClick={() => {
                setShelf(value); resetPage();
              }}>{label}</button>)}
          </div>
        </div>
        <div className="es-count es-count-row">
          <span>{catalogue ? `${rows.length.toLocaleString("ko-KR")}개` : "불러오는 중…"}</span>
          <button type="button" className="es-link" onClick={() => setShowMeaning(!showMeaning)} aria-pressed={showMeaning}>
            {showMeaning ? "단어 보기" : "뜻 보기"}
          </button>
        </div>
        <ol className="es-list">
          {visible.map((word) => <li key={word.id}><button type="button" aria-current={!quiz && selected?.id === word.id ? "true" : undefined}
            onClick={() => { setSelectedId(word.id); setQuiz(undefined); }}>
            <span lang={showMeaning ? "ko" : "en"}>{showMeaning ? word.meanings[0] : word.term}</span>
            <span className="es-muted">{word.kind} · {word.count}회</span>
          </button></li>)}
        </ol>
        {pages > 1 && <div className="es-paging">
          <button type="button" className="es-button" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1}>이전</button>
          <span>{currentPage}/{pages}</span>
          <button type="button" className="es-button" onClick={() => setPage(currentPage + 1)} disabled={currentPage === pages}>다음</button>
        </div>}
      </aside>
      <article className="es-reader es-word-reader">
        <header className="es-reader-top">
          <div className="es-tabs">
            <button type="button" aria-pressed={!quiz} onClick={() => setQuiz(undefined)}>단어 보기</button>
            <button type="button" aria-pressed={!!quiz} disabled={!rows.length} onClick={() => {
              if (!quiz) setQuiz(newQuiz(rows));
            }}>카드 퀴즈</button>
          </div>
          <div className="es-quiz-settings">
            {quiz && <label className="es-inline-field">퀴즈 방향
              <select value={direction} onChange={(event) => {
                setDirection(event.target.value === "ko-en" ? "ko-en" : "en-ko");
                setQuiz(newQuiz(quiz.rows, quiz.ranked));
              }}>
                <option value="en-ko">단어 → 뜻</option>
                <option value="ko-en">뜻 → 단어</option>
              </select>
            </label>}
            <button type="button" className="es-button es-rank-toggle" aria-expanded={rankOpen}
              aria-controls="es-wordbook-rank" onClick={() => setRankOpen(!rankOpen)}>순위</button>
          </div>
        </header>
        {rankOpen && <EnglishWordbookRank access={rankAccess} refresh={rankRefresh}
          onStart={rows.length && !quiz?.ranked ? () => {
            setQuiz(newQuiz(rows, true));
            setRankOpen(false);
          } : undefined} />}
        {failedAnswers.length > 0 && <p className="es-rank-save-error" role="status">
          순위에 아직 반영되지 않은 답이 있어요.{" "}
          <button type="button" className="es-link" onClick={() => failedAnswers.forEach((answer) => { void recordRank(answer); })}>다시 저장</button>
        </p>}
        {quiz && catalogue ? <>
          <div className="es-quiz-stats">
            <p className="es-muted es-quiz-position">{quiz.ranked && <strong>랭킹 퀴즈 · </strong>}{Math.min(quiz.index + 1, quiz.rows.length)}/{quiz.rows.length} · 정답 {quiz.right} · 최고 연속 {quiz.best}</p>
            {quiz.ranked && <button className="es-link" type="button" onClick={() => setQuiz(newQuiz(quiz.rows))}>일반 퀴즈로</button>}
          </div>
          {quizCard ? <WordQuizCard key={`${quiz.sessionId}:${quizCard.id}`} row={quizCard} index={quiz.index}
            direction={direction} words={catalogue} combo={quiz.combo}
            onAnswer={(correct, picked) => {
              const wrong = correct ? progress.wrong.filter((id) => id !== quizCard.id)
                : [...new Set([...progress.wrong, quizCard.id])];
              save({ ...progress, wrong });
              const combo = correct ? quiz.combo + 1 : 0;
              setQuiz({ ...quiz, right: quiz.right + Number(correct), combo, best: Math.max(combo, quiz.best) });
              if (quiz.ranked && rankAccess === "ready") void recordRank({
                sessionId: quiz.sessionId, position: quiz.index + 1, wordId: quizCard.id, direction, picked,
              });
            }}
            onNext={() => setQuiz({ ...quiz, index: quiz.index + 1 })}
          /> : <div className="es-empty"><p>카드 퀴즈를 마쳤어요.</p>
            <button type="button" className="es-button" onClick={() => {
              setShelf("wrong"); resetPage();
            }}>오답 목록 열기</button></div>}
        </> : selected ? <>
          <div className="es-word-head">
            <div>
              <p className="es-kicker">{selected.kind} · {selected.level} · {selected.count}회 출제</p>
              <h2 lang="en">{selected.term}</h2>
            </div>
            <div className="es-tools">
              <button type="button" className="es-button" onClick={() => speakStudyEnglish(selected.term)}>발음 듣기</button>
              <button type="button" className="es-button" onClick={() => setKnown(selected.id)}>
                {progress.known.includes(selected.id) ? "외움 되돌리기" : "외웠어요"}
              </button>
            </div>
          </div>
          <ExampleCard key={selected.id} row={selected} />
        </> : <div className="es-empty" role="status">
          {failed ? <button type="button" className="es-button" onClick={() => { setFailed(false); retry(attempt + 1); }}>단어장 다시 불러오기</button>
            : catalogue ? "조건에 맞는 단어가 없어요." : "단어장을 불러오는 중이에요."}
        </div>}
      </article>
    </div>
  );
}
