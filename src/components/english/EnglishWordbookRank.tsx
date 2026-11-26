"use client";

import Link from "next/link";
import { useEffect, useState, type Ref } from "react";

export type RankAccess = "login" | "profile" | "ready";

type RankRow = {
  rank: number;
  nickname: string;
  score: number;
  best_combo: number;
  is_me: boolean;
};

export function EnglishWordbookRank({ access, refresh, onStart, sectionRef }: {
  access: RankAccess; refresh: number; onStart?: () => void; sectionRef?: Ref<HTMLElement>;
}) {
  const [period, setPeriod] = useState<"today" | "all">("today");
  const [showAll, setShowAll] = useState(false);
  const [retry, setRetry] = useState(0);
  const key = `${period}:${refresh}:${retry}`;
  const [result, setResult] = useState<{ key: string; rows: RankRow[] | null }>();
  const rows = result?.key === key ? result.rows : undefined;
  const visible = rows?.slice(0, showAll ? 100 : 10) ?? [];
  const mine = rows?.find((row) => row.is_me);
  const displayRows = mine && !visible.includes(mine) ? [...visible, mine] : visible;

  useEffect(() => {
    const request = new AbortController();
    fetch(`/api/exam-track/english-wordbook-rank?period=${period}`, { signal: request.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load the leaderboard");
        const data = await response.json() as { rows: RankRow[] };
        setResult({ key, rows: data.rows });
      })
      .catch(() => { if (!request.signal.aborted) setResult({ key, rows: null }); });
    return () => request.abort();
  }, [key, period]);

  return <section ref={sectionRef} tabIndex={-1} id="es-wordbook-rank" className="es-word-rank" aria-labelledby="es-wordbook-rank-title">
    <header className="es-rank-head">
      <h2 id="es-wordbook-rank-title">단어장 순위</h2>
      <div className="es-tabs" aria-label="순위 기간">
        <button type="button" aria-pressed={period === "today"} onClick={() => {
          setPeriod("today"); setShowAll(false);
        }}>오늘 순위</button>
        <button type="button" aria-pressed={period === "all"} onClick={() => {
          setPeriod("all"); setShowAll(false);
        }}>누적 순위</button>
      </div>
    </header>
    <p className="es-muted">{period === "today" ? "한국 시간 기준 오늘 맞힌 단어" : "날짜별 정답 수를 합산한 기록"} · 하루에 단어당 1점</p>
    {access !== "ready" && <p className="es-rank-signin">
      {access === "login"
        ? <Link className="es-link" href="/login?next=%2Fenglish%2Fwordbook">로그인하고 순위 참여하기</Link>
        : <Link className="es-link" href="/profile">공개 아이디를 설정하고 순위에 참여하세요.</Link>}
    </p>}
    {access === "ready" && onStart && <div className="es-rank-join">
      <button className="es-button es-primary" type="button" onClick={onStart}>랭킹 퀴즈 시작</button>
      <span className="es-muted">퀴즈 기록이 공개 아이디와 함께 순위표에 올라가요.</span>
    </div>}
    {rows === undefined ? <p role="status" className="es-rank-empty">순위를 불러오는 중이에요.</p>
      : rows === null ? <p role="status" className="es-rank-empty">순위를 불러오지 못했어요.{" "}
        <button type="button" className="es-link" onClick={() => setRetry(retry + 1)}>다시 시도</button></p>
      : displayRows.length === 0 ? <p className="es-rank-empty">{period === "today" ? "아직 오늘 기록이 없어요." : "아직 등록된 기록이 없어요."}</p>
      : <table className="es-rank-table">
        <thead><tr><th scope="col">순위</th><th scope="col">아이디</th><th scope="col">정답</th><th scope="col">최고 연속</th></tr></thead>
        <tbody>{displayRows.map((row, index) => <tr key={`${row.rank}:${row.nickname}:${index}`} data-mine={row.is_me}>
          <td>{row.rank}위</td><th scope="row">{row.nickname}{row.is_me && <span className="es-rank-me">나</span>}</th>
          <td>{row.score.toLocaleString("ko-KR")}</td><td>{row.best_combo.toLocaleString("ko-KR")}</td>
        </tr>)}</tbody>
      </table>}
    {rows && rows.length > 10 && <button type="button" className="es-link" onClick={() => setShowAll(!showAll)}>
      {showAll ? "상위 10위만 보기" : "전체 순위 보기"}
    </button>}
  </section>;
}
