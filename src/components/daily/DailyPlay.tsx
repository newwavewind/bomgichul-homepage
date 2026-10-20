"use client";

import Link from "next/link";
import { DailyChoiceBadge } from "@/components/daily/DailyChoiceBadge";
import { DailyScheduleGuide } from "@/components/daily/DailyScheduleGuide";
import { useEffect, useState, type ReactNode } from "react";
import { BackLink } from "@/components/ui/BackLink";
import { DailyCalendar } from "@/components/daily/DailyCalendar";
import { DailyLearningReportCard } from "@/components/daily/DailyLearningReport";
import {
  DailyChoiceContent,
  DailyQuestionBody,
} from "@/components/daily/DailyQuestionBody";
import { DailyReviewList } from "@/components/daily/DailyReviewList";
import { DailyInviteCard } from "@/components/daily/DailyInviteCard";
import { ResultActions } from "@/components/daily/ResultActions";
import {
  getTodayBoard,
  startDailyAttempt,
  submitDailyAttempt,
} from "@/lib/daily-challenge/actions";
import { formatElapsed, formatKoreanDate } from "@/lib/daily-challenge/format";
import type {
  BoardRow,
  DailyComposition,
  DailyConfidence,
  DailyInsights,
  DailyMode,
  DailyQuestionView,
  DailyScore,
} from "@/lib/daily-challenge/types";

type Step = "play" | "result";

function formatCompactNextDate(dateKey: string, todayDateKey: string) {
  const [year, month, day] = dateKey.split("-");
  const monthDay = `${Number(month)}.${Number(day)}`;
  return year === todayDateKey.slice(0, 4) ? monthDay : `${year}.${monthDay}`;
}

function deviceId() {
  const key = "bom_daily_device";
  const saved = localStorage.getItem(key);
  if (saved) return saved;
  const created = crypto.randomUUID();
  localStorage.setItem(key, created);
  return created;
}

export function DailyPlay({
  exam,
  subjectId,
  subjectLabel,
  label,
  home,
  dateKey,
  todayDateKey,
  isArchive,
  mode,
  practicePage,
  reviewSource,
  questions,
  roundHref,
  defaultNickname,
  todayRanking,
  friendBoard,
  insights,
  composition,
  shareContext,
  invitedBy,
  challenge,
}: {
  exam: string;
  subjectId: string;
  subjectLabel: string;
  label: string;
  home: string;
  dateKey: string;
  todayDateKey: string;
  isArchive: boolean;
  mode: DailyMode;
  practicePage: number;
  reviewSource?: string;
  questions: DailyQuestionView[];
  roundHref: string;
  defaultNickname: string;
  todayRanking: BoardRow[];
  friendBoard: BoardRow[];
  insights: DailyInsights;
  composition: DailyComposition;
  shareContext: {
    inviterNickname: string;
    attempt: {
      attemptId: string;
      correct: number;
      total: number;
      participants: number;
    } | null;
  };
  invitedBy: string;
  challenge: {
    id: string;
    nickname: string;
    correct: number;
    total: number;
  } | null;
}) {
  const signedIn = Boolean(defaultNickname);
  const [step, setStep] = useState<Step>("play");
  const [nickname, setNickname] = useState("");
  const [picks, setPicks] = useState<
    Record<string, { key: string; confidence: DailyConfidence }>
  >({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<DailyScore | null>(null);
  const [ranking, setRanking] = useState(todayRanking);
  const [rankingSynced, setRankingSynced] = useState(true);
  const [showAllRanking, setShowAllRanking] = useState(false);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [rankingError, setRankingError] = useState(false);
  const [showScheduleGuide, setShowScheduleGuide] = useState(false);
  const [timerToken, setTimerToken] = useState<string | null>(null);
  const [revealedReviewKey, setRevealedReviewKey] = useState<string | null>(
    null,
  );
  const resultStorageKey = [
    "bom_daily_result",
    exam,
    subjectId,
    dateKey,
    mode,
    practicePage,
    reviewSource ?? "",
    challenge?.id ?? "",
  ].join(":");
  const timerStorageKey = [
    "bom_daily_timer",
    exam,
    subjectId,
    dateKey,
    mode,
    practicePage,
    reviewSource ?? "",
  ].join(":");
  const showReviewAnswers = revealedReviewKey === resultStorageKey;
  const rankedDailyHref = `/${exam}/daily?subject=${encodeURIComponent(subjectId)}`;
  const backHref = mode === "ranked" && !isArchive
    ? `/${exam}/daily`
    : rankedDailyHref;
  const answeredCount = questions.filter(
    (question) => picks[question.id]?.key,
  ).length;
  const isComplete = answeredCount === questions.length;
  const calendarStatuses =
    score && mode === "ranked"
      ? {
          ...insights.calendar,
          [score.dateKey]: {
            correct: score.correct,
            total: score.total,
            needsReview: score.correct < score.total,
          },
        }
      : insights.calendar;

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(resultStorageKey);
      if (!saved) return;
      const snapshot = JSON.parse(saved) as {
        score?: DailyScore;
        picks?: Record<string, { key: string; confidence: DailyConfidence }>;
        nickname?: string;
      };
      if (!snapshot.score || !Array.isArray(snapshot.score.review)) return;
      setScore(snapshot.score);
      setPicks(snapshot.picks ?? {});
      setNickname(snapshot.nickname ?? "");
      setStep("result");
    } catch {}
  }, [resultStorageKey]);

  useEffect(() => {
    if (isArchive) return;
    let cancelled = false;
    let savedTimerToken: string | null = null;
    try {
      savedTimerToken = window.sessionStorage.getItem(timerStorageKey);
    } catch {}
    void startDailyAttempt({
      exam,
      subject: subjectId,
      mode,
      practicePage,
      reviewSource,
      timerToken: savedTimerToken,
      deviceId: deviceId(),
    }).then((started) => {
      if (cancelled) return;
      if (!started.ok) {
        setError(started.message);
        return;
      }
      setTimerToken(started.timerToken);
      try {
        window.sessionStorage.setItem(timerStorageKey, started.timerToken);
      } catch {}
    });
    return () => {
      cancelled = true;
    };
  }, [exam, subjectId, mode, practicePage, reviewSource, isArchive, timerStorageKey]);

  useEffect(() => {
    if (mode !== "ranked" || isArchive) return;
    let cancelled = false;
    let inFlight = false;

    async function refreshRanking() {
      if (cancelled || inFlight || document.visibilityState !== "visible") return;
      inFlight = true;
      try {
        const rows = await getTodayBoard(exam, subjectId, score?.dateKey ?? dateKey);
        if (cancelled) return;
        // The action also returns [] on connection errors; keep the last known
        // standings until a successful refresh, including a just-submitted score.
        if (rows.length > 0) {
          setRanking(rows);
          setRankingSynced(true);
          setRankingError(false);
        }
      } catch {
        if (!cancelled) setRankingError(true);
      } finally {
        inFlight = false;
      }
    }

    void refreshRanking();
    const interval = window.setInterval(() => void refreshRanking(), 20_000);
    const refreshWhenVisible = () => void refreshRanking();
    document.addEventListener("visibilitychange", refreshWhenVisible);
    window.addEventListener("focus", refreshWhenVisible);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.removeEventListener("focus", refreshWhenVisible);
    };
  }, [exam, subjectId, dateKey, isArchive, mode, score]);

  async function finish(
    nextPicks: Record<string, { key: string; confidence: DailyConfidence }>,
    name = signedIn ? defaultNickname : nickname,
  ) {
    setBusy(true);
    setError(null);
    const result = await submitDailyAttempt({
      exam,
      subject: subjectId,
      mode,
      practicePage,
      reviewSource,
      challengeId: challenge?.id ?? null,
      timerToken,
      deviceId: deviceId(),
      nickname: name,
      picks: questions.map((item) => ({
        id: item.id,
        key: nextPicks[item.id]?.key ?? "",
        confidence: nextPicks[item.id]?.confidence ?? null,
      })),
    });
    setBusy(false);
    if ("review" in result) {
      try {
        window.sessionStorage.removeItem(timerStorageKey);
        window.sessionStorage.setItem(
          resultStorageKey,
          JSON.stringify({ score: result, picks: nextPicks, nickname: name }),
        );
      } catch {
        // The result remains visible even when private browsing blocks storage.
      }
      setScore(result);
      setNickname(name);
      // 방금 채점을 마친 흐름에서는 곧바로 정답과 해설을 보여 준다.
      // 저장 결과를 복원해 다시 들어온 경우에는 이 상태를 설정하지 않으므로
      // 문제만 먼저 보이고 사용자가 직접 해설을 열 수 있다.
      setRevealedReviewKey(resultStorageKey);
      setStep("result");
      if (inputIsRankedResult(result)) {
        setRankingSynced(false);
        void getTodayBoard(exam, subjectId, result.dateKey)
          .then((rows) => {
            if (rows.length > 0) {
              setRanking(rows);
              setRankingSynced(true);
              setRankingError(false);
            } else {
              setRankingError(true);
            }
          })
          .catch(() => setRankingError(true));
      }
      return;
    }
    setError(result.message);
  }

  function choose(questionId: string, key: string) {
    if (busy) return;
    setPicks((current) => ({
      ...current,
      [questionId]: {
        key,
        confidence: current[questionId]?.confidence ?? null,
      },
    }));
  }

  function inputIsRankedResult(result: DailyScore) {
    return mode === "ranked" && result.saved && result.share.rank !== null;
  }

  async function toggleRanking() {
    if (showAllRanking) {
      setShowAllRanking(false);
      return;
    }
    setShowAllRanking(true);
    setRankingLoading(true);
    setRankingError(false);
    try {
      const rows = await getTodayBoard(exam, subjectId, score?.dateKey ?? dateKey);
      if (rows.length > 0 || !score?.saved) {
        setRanking(rows);
        setRankingSynced(true);
      } else {
        setRankingError(true);
      }
    } catch {
      setRankingError(true);
    } finally {
      setRankingLoading(false);
    }
  }

  if (questions.length === 0) {
    return (
      <Shell label={label} home={home}>
        <p className="text-sm text-[#475569]">
          오늘 풀 객관식 기출을 찾지 못했습니다.
        </p>
      </Shell>
    );
  }

  const share = score?.share;
  const optimisticRow =
    score && inputIsRankedResult(score) && !rankingSynced
      ? score.share
      : null;
  const alreadyInRanking = optimisticRow
    ? ranking.some(
        (row) =>
          row.rank === optimisticRow.rank &&
          row.nickname === optimisticRow.nickname,
      )
    : false;
  const liveRanking = optimisticRow
    ? [
        ...ranking
          .filter(
            (row) =>
              row.rank !== optimisticRow.rank ||
              row.nickname !== optimisticRow.nickname,
          )
          .map((row) => ({
            ...row,
            rank:
              !score?.alreadyRanked &&
              !alreadyInRanking &&
              row.rank >= optimisticRow.rank!
                ? row.rank + 1
                : row.rank,
          })),
        {
          rank: optimisticRow.rank!,
          nickname: optimisticRow.nickname,
          correct: optimisticRow.correct,
          total: optimisticRow.total,
          elapsedMs: optimisticRow.elapsedMs,
          days: null,
          mine: true,
        },
      ].sort((a, b) => a.rank - b.rank)
    : ranking;
  const visibleRanking = showAllRanking ? liveRanking : liveRanking.slice(0, 10);
  const liveFriendBoard = score
    ? [
        ...friendBoard.filter(
          (row) => !(row.mine && row.nickname === score.nickname),
        ),
        ...(challenge
          ? [
              {
                rank: 0,
                nickname: score.nickname,
                correct: score.correct,
                total: score.total,
                elapsedMs: score.elapsedMs,
                days: null,
                mine: true,
              },
            ]
          : []),
      ]
        .sort(
          (a, b) =>
            b.correct - a.correct ||
            (a.elapsedMs ?? Number.MAX_SAFE_INTEGER) -
              (b.elapsedMs ?? Number.MAX_SAFE_INTEGER),
        )
        .map((row, index) => ({ ...row, rank: index + 1 }))
    : friendBoard;

  // 「매일 10문제 · 전체 기출 한 바퀴」 소개와 세 칸 메뉴 — 풀기 전엔 맨 위, 채점 뒤엔 학습 리포트 아래.
  const rotationIntro = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold leading-6 text-ink">
            매일 10문제 · 전체 기출 한 바퀴
          </h2>
          <p className="mt-0.5 text-xs leading-5 text-[#64748b]">
            최근 {composition.yearSpan}개년 · {composition.topics}개 단원 · {composition.poolCount.toLocaleString()}문제를 하루 10문제씩, 한 바퀴 약 {composition.rotationDays}일
          </p>
        </div>
        {/* 채점 뒤엔 학습 리포트가 같은 숫자를 보여 줘서 뺀다. */}
        {step !== "result" && !isArchive ? (
          <div className="flex shrink-0 gap-1 text-[11px] font-medium text-[#475569]">
            <span className="rounded-md bg-[#f1f5f9] px-2 py-1">
              연속 {insights.streak}일
            </span>
            <span className="rounded-md bg-[#f1f5f9] px-2 py-1">
              이번 달 {insights.monthDone}회
            </span>
          </div>
        ) : null}
      </div>
      <details className="group mt-1.5">
        <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs font-medium text-[#4d49fc] [&::-webkit-details-marker]:hidden">
          한 바퀴는 어떻게 도나요?
          <span className="transition-transform group-open:rotate-180" aria-hidden>⌄</span>
        </summary>
        <ol className="mt-2 space-y-1.5 text-[13px] leading-6 text-[#595959]">
          {[
            ["한 번 섞기", `${subjectLabel} 기출 ${composition.poolCount.toLocaleString()}문제를 카드 섞듯 한 번 섞어 1번부터 ${composition.poolCount.toLocaleString()}번까지 순서를 정합니다.`],
            ["하루 10문제씩 차례로", `첫날은 1~10번, 다음 날은 11~20번처럼 앞에서부터 이어서 냅니다. 한 번 나간 자리는 다시 쓰지 않으니 한 바퀴(약 ${composition.rotationDays}일)를 다 돌 때까지 같은 문제가 두 번 나오지 않습니다.`],
            ["다 돌면 다시 섞기", "마지막 문제까지 나가면 새로 섞어 다음 바퀴를 시작합니다. 앞 바퀴 끝과 새 바퀴 처음이 같은 날에 걸쳐도 그날 10문제 안에서는 겹치지 않습니다."],
            ["누구에게나 같은 순서", "같은 날에는 누가 풀어도 같은 10문제가 나옵니다. 그래서 순위를 공정하게 비교할 수 있습니다."],
          ].map(([title, body], index) => (
            <li key={title} className="flex gap-2.5">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#4d49fc]/10 font-mono text-[11px] text-[#4d49fc]">
                {index + 1}
              </span>
              <span>
                <strong className="font-semibold text-black">{title}</strong> · {body}
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-2.5 rounded-xl bg-[#4d49fc]/[0.06] px-3 py-2.5 text-[13px] leading-6 text-[#595959]">
          <p>
            <strong className="font-semibold text-black">바퀴는 끝없이 이어집니다.</strong>{" "}
            {Math.floor(365 / Math.max(1, composition.rotationDays)) >= 1
              ? `매일 풀면 1년에 약 ${Math.floor(365 / Math.max(1, composition.rotationDays))}바퀴, 같은 문제를 그만큼 다시 만납니다.`
              : `한 바퀴에 약 ${composition.rotationDays}일이 걸리고, 다 돌면 다음 바퀴가 이어집니다.`}
          </p>
          {Math.floor(365 / Math.max(1, composition.rotationDays)) >= 2 ? (
            <p className="mt-1 text-[15px] font-semibold text-[#4d49fc]">
              무려 {Math.floor(365 / Math.max(1, composition.rotationDays))}회독! <span aria-hidden>😲</span>
            </p>
          ) : null}
          <p className="mt-2 font-semibold text-black">한 바퀴씩 돌면 좋은 점</p>
          <ul className="mt-1 space-y-1">
            {[
              ["빠짐없이", `좋아하는 단원만 골라 풀지 않아도 한 바퀴면 기출 ${composition.poolCount.toLocaleString()}문제를 한 문제도 빼놓지 않고 만납니다.`],
              ["잊을 만할 때 다시", `같은 문제는 평균 약 ${composition.rotationDays}일 간격으로 돌아옵니다. 기억이 흐려질 즈음 다시 꺼내 보게 됩니다.`],
              ["순서로 외우지 않게", "바퀴마다 순서를 새로 섞어 앞뒤 문제로는 답을 떠올릴 수 없습니다. 내용을 알아야 풉니다."],
            ].map(([title, body]) => (
              <li key={title}>
                <strong className="font-semibold text-black">{title}</strong> · {body}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-2 text-xs leading-5 text-[#8a8a8a]">
          새 연도 기출이 들어오면 문제 모음이 바뀌어 순서를 새로 섞습니다.
        </p>
      </details>
      <nav
        aria-label="매일 10문제 메뉴"
        className="mt-2.5 grid grid-cols-3 gap-1 rounded-xl bg-[#EEF3F9] p-1 text-center text-xs font-semibold"
      >
        <Link
          href={rankedDailyHref}
          className={`rounded-lg px-2 py-1.5 ${mode === "ranked" ? "bg-[#007AFF] text-white" : "text-[#475569] hover:bg-white"}`}
        >
          오늘의 10문제
        </Link>
        <Link
          href={`/${exam}/daily?subject=${encodeURIComponent(subjectId)}&more=1`}
          className={`rounded-lg px-2 py-1.5 ${mode === "practice" ? "bg-[#007AFF] text-white" : "text-[#475569] hover:bg-white"}`}
        >
          추가 연습
        </Link>
        <Link
          href={`/${exam}/daily/wrong?subject=${encodeURIComponent(subjectId)}`}
          className="rounded-lg px-2 py-1.5 text-[#475569] hover:bg-white"
        >
          특별한 오답노트
        </Link>
      </nav>
    </>
  );

  return (
    <div className={`bg-[linear-gradient(180deg,#F5F9FF_0%,#FFFFFF_42%)] py-8 ${step === "result" ? "px-2 sm:px-4" : "px-4"}`}>
      <div className={`mx-auto flex flex-col gap-4 ${step === "result" ? "max-w-[900px]" : "max-w-xl"}`}>
        <BackLink href={backHref}>
          {label} · {subjectLabel}
        </BackLink>
        <section className="rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-7">
          {isArchive || mode === "review" || mode === "practice" ? (
            <p className="mt-2 text-sm leading-6 text-[#475569] first:mt-0">
              {isArchive
                ? "해당 날짜에 출제된 문제입니다."
                : mode === "review"
                  ? "오늘 복습할 문제이며 공식 순위에는 반영되지 않습니다."
                  : "추가 연습 문제이며 공식 순위에는 반영되지 않습니다."}
            </p>
          ) : null}
          {/* 채점 뒤엔 이 소개·메뉴가 학습 리포트 아래로 내려간다(rotationIntro). */}
          {!challenge && step !== "result" ? (
            <section className="mt-4 rounded-2xl border border-black/10 bg-white p-3 first:mt-0 sm:p-3.5">
              {rotationIntro}
            </section>
          ) : null}
          {mode === "ranked" ? (
            <div
              className="mt-6 border-b border-[#e6eef8] pb-6 first:mt-0 last:border-b-0 last:pb-0"
              aria-label={`${isArchive ? formatKoreanDate(dateKey) : "오늘"} 순위`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#64748b]">
                    {isArchive
                      ? `${formatKoreanDate(dateKey)} 순위`
                      : "오늘 순위"}
                  </p>
                  <h2 className="mt-0.5 text-base font-semibold text-ink">
                    {showAllRanking ? `전체 순위 · ${liveRanking.length}명` : "상위 10명"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => void toggleRanking()}
                  aria-expanded={showAllRanking}
                  className="rounded-full border border-[#cfe0f5] bg-white px-3 py-2 text-xs font-semibold text-[#0066D6] hover:border-[#007AFF]"
                >
                  {showAllRanking ? "순위 접기 ↑" : "전체 순위 보기 ↓"}
                </button>
              </div>
              {rankingLoading ? (
                <p className="mt-3 text-xs text-[#64748b]">최신 순위를 불러오는 중...</p>
              ) : null}
              {rankingError ? (
                <p className="mt-3 text-xs text-[#B45309]">최신 순위를 불러오지 못했습니다. {isArchive ? "버튼을 다시 눌러주세요." : "잠시 후 자동으로 다시 확인합니다."}</p>
              ) : null}
              {visibleRanking.length > 0 ? (
                <ol className="mt-4 divide-y divide-[#eef2f7]">
                  {visibleRanking.map((row) => (
                    <li
                      key={`${row.rank}-${row.nickname}`}
                      className={`flex items-center justify-between gap-3 py-2.5 text-sm first:pt-0 last:pb-0 ${row.mine ? "text-[#0066D6]" : "text-ink"}`}
                    >
                      <span className="min-w-0 truncate font-semibold">
                        {row.rank}. {row.nickname}
                      </span>
                      <span className="shrink-0 text-xs text-[#64748b]">
                        {row.correct}/{row.total} ·{" "}
                        {row.elapsedMs != null
                          ? formatElapsed(row.elapsedMs)
                          : "-"}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 rounded-2xl bg-[#f8fafc] px-4 py-5 text-center text-sm text-[#64748b]">
                  아직 오늘 기록이 없습니다.
                </p>
              )}
            </div>
          ) : null}
          {challenge ? (
            <div className="mt-4 rounded-2xl bg-[#E8F4FF] px-4 py-4 first:mt-0">
              <p className="text-sm font-bold text-[#075AA8]">
                {`${challenge.nickname}님이 보낸 무료 기출 10문제`}
              </p>
              <p className="mt-1 text-xs leading-5 text-[#3B6285]">
                매일 새로운 기출 10문제를 무료로 풀고, 채점과 해설까지 확인해 보세요.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-bold text-[#075AA8]">
                <span className="rounded-full bg-white/80 px-2.5 py-1">
                  {subjectLabel}
                </span>
                <span className="rounded-full bg-white/80 px-2.5 py-1">
                  {questions.length}문제
                </span>
                <span className="rounded-full bg-white/80 px-2.5 py-1">
                  채점·해설 무료
                </span>
              </div>
            </div>
          ) : null}
          {challenge ? (
            <p className="mt-4 rounded-2xl border border-[#cfe3fb] bg-white/80 px-4 py-3 text-sm text-[#0B3A66]">
              초대한 친구 기록 {challenge.correct}/{challenge.total} · 도전하고
              순위에 이름을 올려보세요.
            </p>
          ) : invitedBy ? (
            <p className="mt-4 rounded-2xl border border-[#cfe3fb] bg-white/80 px-4 py-3 text-sm text-[#0B3A66]">
              {invitedBy}님이 {subjectLabel} 오늘의 10문제에 초대했어요.
              함께 풀고 결과를 비교해 보세요.
            </p>
          ) : null}
          {step === "play" && !signedIn && !isArchive ? (
            <input
              id="daily-nickname"
              value={nickname}
              maxLength={16}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="닉네임"
              aria-label="닉네임"
              className="mt-5 w-full rounded-2xl border border-[#d7e3f4] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#94a3b8] focus:border-[#007AFF]"
            />
          ) : null}
          {error && step === "play" ? (
            <p className="mt-3 text-sm text-[#475569]">{error}</p>
          ) : null}
        </section>

        {step === "play" ? (
          <section className="rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-7">
            {!challenge ? (
              <DailyCalendar
                exam={exam}
                subjectId={subjectId}
                dateKey={dateKey}
                todayDateKey={todayDateKey}
                statuses={calendarStatuses}
                embedded
              />
            ) : null}
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-[#0066D6]">
                {isArchive
                  ? "출제 문항"
                  : `${answeredCount}/${questions.length} 답변`}
              </span>
              {isArchive ? (
                <Link
                  href={`/${exam}/daily?subject=${encodeURIComponent(subjectId)}`}
                  className="text-[#475569]"
                >
                  오늘 문제
                </Link>
              ) : null}
            </div>
            {!isArchive ? (
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e6eef8]">
                <div
                  className="h-full rounded-full bg-[#007AFF]"
                  style={{
                    width: `${(answeredCount / questions.length) * 100}%`,
                  }}
                />
              </div>
            ) : null}
            <div className="mt-6 space-y-8">
              {questions.map((question, questionIndex) => (
                <article
                  key={question.id}
                  className="border-b border-[#e6eef8] pb-8 last:border-b-0 last:pb-0"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-full bg-[#E8F4FF] text-xs font-bold text-[#0066D6]">
                      {questionIndex + 1}
                    </span>
                    <p className="text-xs text-[#64748b]">
                      {question.sourceLabel}
                    </p>
                    {question.nextDateKey ? (
                      <button
                        type="button"
                        onClick={() => setShowScheduleGuide(true)}
                        aria-label={`다음 출제 예정 ${formatKoreanDate(question.nextDateKey)}. 출제 방식 안내 보기`}
                        title={`다음 출제 예정 ${formatKoreanDate(question.nextDateKey)}`}
                        className="ml-auto rounded-md border border-[#E4EAF1] bg-transparent px-1.5 py-0.5 text-[10px] font-medium leading-4 text-[#77869A] transition-colors hover:border-[#CFDAE6] hover:bg-[#F8FAFC] hover:text-[#52657A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8BB9EA]"
                      >
                        다음 출제 {formatCompactNextDate(question.nextDateKey, todayDateKey)}
                      </button>
                    ) : null}
                  </div>
                  <DailyQuestionBody
                    stem={question.stem}
                    presentation={question.presentation}
                    questionNo={questionIndex + 1}
                  />
                  <div className="mt-4 grid gap-2">
                    {question.choices.map((choice) => {
                      const selected = picks[question.id]?.key === choice.key;
                      if (isArchive) {
                        return (
                          <div
                            key={choice.key}
                            className="rounded-2xl border border-[#DDE9F6] bg-white px-3 py-2.5 text-left text-ink sm:px-4"
                          >
                            <div className="flex gap-3">
                              <DailyChoiceBadge label={choice.label} />
                              <DailyChoiceContent
                                choice={choice}
                                choiceHeaders={
                                  question.presentation.choiceHeaders
                                }
                              />
                            </div>
                          </div>
                        );
                      }
                      return (
                        <button
                          key={choice.key}
                          type="button"
                          onClick={() => choose(question.id, choice.key)}
                          disabled={busy}
                          aria-pressed={selected}
                          className={`rounded-2xl border px-3 py-2.5 text-left text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2 disabled:opacity-60 sm:px-4 ${selected ? "border-[#91C6FF] bg-[#F1F8FF]" : "border-[#DDE9F6] bg-white hover:border-[#A9D2FF] hover:bg-[#F8FBFF]"}`}
                        >
                          <div className="flex gap-3">
                            <DailyChoiceBadge
                              label={choice.label}
                              tone={selected ? "selected" : "default"}
                            />
                            <DailyChoiceContent
                              choice={choice}
                              choiceHeaders={
                                question.presentation.choiceHeaders
                              }
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
            {isArchive ? (
              <Link
                href={`/${exam}/daily?subject=${encodeURIComponent(subjectId)}`}
                className="mt-8 flex w-full items-center justify-center rounded-2xl bg-[#007AFF] px-4 py-3 text-sm font-semibold text-white"
              >
                오늘의 10문제 풀기
              </Link>
            ) : (
              <>
                {!signedIn ? (
                  <div
                    className={`mt-8 rounded-2xl border p-4 transition-all duration-300 ${isComplete ? "border-[#80BFFF] bg-[#F0F7FF] shadow-[0_8px_24px_rgba(0,122,255,0.10)] ring-4 ring-[#007AFF]/10" : "border-[#dbe7f5] bg-[#f8fafc]"}`}
                    aria-live="polite"
                  >
                    <p className={`text-sm font-bold ${isComplete ? "text-[#075AA8]" : "text-[#64748b]"}`}>
                      {isComplete
                        ? "답안을 제출하기 전에 닉네임을 확인해 주세요"
                        : `${questions.length - answeredCount}문제를 더 풀면 닉네임을 입력할 수 있어요`}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#64748b]">
                      닉네임은 오늘 순위에 표시되며, 입력하지 않아도 제출할 수 있습니다.
                    </p>
                    <input
                      id="daily-nickname-submit"
                      value={nickname}
                      maxLength={16}
                      onChange={(event) => setNickname(event.target.value)}
                      disabled={!isComplete || busy}
                      placeholder={isComplete ? "순위에 표시할 닉네임" : "10문제를 모두 선택하면 활성화됩니다"}
                      aria-label="제출 전 닉네임"
                      className="mt-3 w-full rounded-2xl border border-[#cfe0f5] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#94a3b8] focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 disabled:cursor-not-allowed disabled:bg-[#eef2f7] disabled:text-[#94a3b8]"
                    />
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => void finish(picks)}
                  disabled={!isComplete || busy}
                  className={`${signedIn ? "mt-8" : "mt-4"} w-full rounded-2xl bg-[#007AFF] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#94a3b8]`}
                >
                  {busy
                    ? "채점하는 중..."
                    : isComplete
                      ? "답안 제출하고 결과 보기"
                      : `${questions.length - answeredCount}문제 더 답하기`}
                </button>
                <div className="mt-4">
                  <DailyInviteCard
                    exam={exam}
                    label={subjectLabel}
                    subjectId={subjectId}
                    dateKey={dateKey}
                    attempt={shareContext.attempt}
                    inviterNickname={shareContext.inviterNickname}
                    isPractice={mode !== "ranked"}
                    buttonLabel="카카오톡으로 공유하기"
                  />
                </div>
                {!isComplete ? (
                  <p className="mt-3 text-center text-xs text-[#64748b]">
                    모든 문제를 답하면 결과를 볼 수 있습니다.
                  </p>
                ) : null}
              </>
            )}
          </section>
        ) : null}

        {step === "result" && score && share ? (
          <section className="rounded-[24px] border border-white/80 bg-white/75 p-2.5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-5 md:p-7">
            {!challenge ? (
              <DailyCalendar
                exam={exam}
                subjectId={subjectId}
                dateKey={score.dateKey}
                todayDateKey={todayDateKey}
                statuses={calendarStatuses}
                embedded
              />
            ) : null}
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
              <h2 className="font-display text-2xl font-semibold tabular-nums text-ink">
                {score.correct}/{score.total}
              </h2>
              <p className="text-sm text-[#475569]">
                {formatElapsed(score.elapsedMs)}
                {score.rank ? ` · 오늘 ${score.rank}위` : ""}
              </p>
            </div>
            <DailyLearningReportCard
              exam={exam}
              subjectId={subjectId}
              attemptId={score.attemptId}
              rank={score.rank}
              report={score.report}
            >
              {!challenge ? rotationIntro : null}
            </DailyLearningReportCard>
            {challenge ? (
              <p className="mt-3 text-sm text-[#334155]">
                {challenge.nickname} {challenge.correct}/{challenge.total} · 나{" "}
                {score.correct}/{score.total}
              </p>
            ) : null}
            {score.message ? (
              <p className="mt-3 text-sm text-[#475569]">{score.message}</p>
            ) : null}
            {!score.saved ? (
              <form
                className="mt-4 flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  void finish(picks, nickname);
                }}
              >
                <input
                  value={nickname}
                  maxLength={16}
                  onChange={(event) => setNickname(event.target.value)}
                  className="min-w-0 flex-1 rounded-2xl border border-[#d7e3f4] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#94a3b8]"
                  placeholder="닉네임"
                  aria-label="닉네임"
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-[#007AFF] px-4 py-3 text-sm font-semibold text-white"
                  disabled={busy}
                >
                  다시 올리기
                </button>
              </form>
            ) : null}
            {error ? (
              <p className="mt-3 text-sm text-[#475569]">{error}</p>
            ) : null}
            {challenge && liveFriendBoard.length > 0 ? (
              <section className="mt-5 rounded-3xl border border-[#F7D900] bg-[#FFFBE6] p-4">
                <p className="text-xs font-bold text-[#6B5300]">
                  친구와 함께한 오늘의 기록
                </p>
                <ol className="mt-3 divide-y divide-[#F5E9A8]">
                  {liveFriendBoard.slice(0, 10).map((row) => (
                    <li
                      key={`${row.rank}-${row.nickname}`}
                      className="flex items-center justify-between py-2 text-sm"
                    >
                      <span
                        className={
                          row.mine
                            ? "font-bold text-[#0066D6]"
                            : "font-semibold text-ink"
                        }
                      >
                        {row.rank}. {row.nickname}
                      </span>
                      <span className="text-xs text-[#64748b]">
                        {row.correct}/{row.total} ·{" "}
                        {row.elapsedMs != null
                          ? formatElapsed(row.elapsedMs)
                          : "-"}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
            <div className="mt-5 rounded-2xl border border-[#cfe0f5] bg-[#f8fbff] p-3 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:p-4">
              <div>
                <p className="text-sm font-semibold text-ink">
                  {showReviewAnswers
                    ? "정답과 해설을 보고 있어요"
                    : "먼저 문제를 다시 확인해 보세요"}
                </p>
                <p className="mt-1 text-xs leading-5 text-[#64748b]">
                  {showReviewAnswers
                    ? "버튼을 누르면 해설을 가리고 문제만 볼 수 있습니다."
                    : "내 선택과 정답은 해설을 열기 전까지 표시하지 않습니다."}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setRevealedReviewKey((current) =>
                    current === resultStorageKey ? null : resultStorageKey,
                  )
                }
                aria-expanded={showReviewAnswers}
                className="mt-3 flex min-h-11 w-full shrink-0 items-center justify-center rounded-xl bg-[#007AFF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0066D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2 sm:mt-0 sm:w-auto"
              >
                {showReviewAnswers ? "해설 닫기" : "정답·해설 보기"}
              </button>
            </div>
            <DailyReviewList
              items={score.review}
              showAnswers={showReviewAnswers}
            />
            <div className="mt-6">
              <ResultActions
                exam={exam}
                examLabel={label}
                label={subjectLabel}
                subjectId={subjectId}
                home={home}
                dateKey={share.attemptId ? score.dateKey : dateKey}
                nickname={share.nickname}
                correct={share.correct}
                total={share.total}
                elapsedMs={share.elapsedMs}
                rank={share.rank}
                attemptId={share.attemptId}
                roundHref={score.roundHref || roundHref}
                practicePage={practicePage}
                participants={score.report.participants}
              />
            </div>
          </section>
        ) : null}
      </div>
      {showScheduleGuide ? (
        <DailyScheduleGuide
          composition={composition}
          exam={exam}
          subjectId={subjectId}
          subjectLabel={subjectLabel}
          onClose={() => setShowScheduleGuide(false)}
        />
      ) : null}
    </div>
  );
}

function Shell({
  label,
  home,
  children,
}: {
  label: string;
  home: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-[linear-gradient(180deg,#F5F9FF_0%,#FFFFFF_42%)] px-4 py-8">
      <div className="mx-auto max-w-xl">
        <BackLink href={home}>{label} 학습 홈</BackLink>
        <div className="mt-5 rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-7">
          <p className="text-xs font-semibold text-[#64748b]">{label}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
