"use client";

import Link from "next/link";
import { DailyChoiceBadge } from "@/components/daily/DailyChoiceBadge";
import { DailyScheduleGuide } from "@/components/daily/DailyScheduleGuide";
import { useEffect, useEffectEvent, useRef, useState, type ReactNode } from "react";
import { hasNativeEnterAction, questionShortcutTarget } from "@/lib/question-shortcuts";
import { BackLink } from "@/components/ui/BackLink";
import { DailyCalendar } from "@/components/daily/DailyCalendar";
import {
  DailyLearningReportCard,
  dailyReportAction,
} from "@/components/daily/DailyLearningReport";
import {
  DailyOxComboTable,
  dailyOxTableFrom,
} from "@/components/daily/DailyOxComboTable";
import {
  DailyChoiceContent,
  DailyQuestionBody,
} from "@/components/daily/DailyQuestionBody";
import { DailyReviewList } from "@/components/daily/DailyReviewList";
import { DailyInviteCard } from "@/components/daily/DailyInviteCard";
import { ResultActions } from "@/components/daily/ResultActions";
import {
  getCumulativeBoard,
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
  cumulativeRanking,
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
  cumulativeRanking: BoardRow[];
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
  const questionsRef = useRef<HTMLDivElement>(null);
  const nicknameInputRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [nickname, setNickname] = useState("");
  const [picks, setPicks] = useState<
    Record<string, { key: string; confidence: DailyConfidence }>
  >({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<DailyScore | null>(null);
  const [ranking, setRanking] = useState(todayRanking);
  const [cumulative, setCumulative] = useState(cumulativeRanking);
  const [rankBoard, setRankBoard] = useState<"today" | "total">("today");
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
  const keyboardEnabled = step === "play" && questions.length > 0;
  // 지난 날짜 문제도 풀 수 있다 — 연습으로 채점하고 순위에는 넣지 않으니 닉네임은 묻지 않는다
  const asksForNickname = !signedIn && mode === "ranked" && !isArchive;
  const activeQuestion = questions[activeQuestionIndex];
  const lastChoiceKey = Math.min(activeQuestion?.choices.length ?? 0, 9);
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
    const frame = window.requestAnimationFrame(() => {
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
      } catch {
        // A saved result can be unavailable when browser storage is blocked.
      }
    });
    return () => window.cancelAnimationFrame(frame);
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
      mode: isArchive ? "practice" : mode,
      practicePage,
      reviewSource,
      archiveDate: isArchive ? dateKey : null,
      challengeId: challenge?.id ?? null,
      timerToken,
      deviceId: deviceId(),
      nickname: name,
      picks: questions.map((item) => ({
        id: item.id,
        key: nextPicks[item.id]?.key ?? "",
        confidence: nextPicks[item.id]?.confidence ?? null,
      })),
    }).catch(() => ({
      ok: false as const,
      message: "답안을 제출하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    }));
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

  function moveToQuestion(index: number) {
    const article = questionsRef.current?.querySelector<HTMLElement>(
      `[data-daily-question="${index}"]`,
    );
    if (!article) return false;
    setActiveQuestionIndex(index);
    article.focus({ preventScroll: true });
    article.scrollIntoView({ block: "start" });
    return true;
  }

  const handleQuestionKey = useEffectEvent((event: KeyboardEvent) => {
    if (busy) return;
    const target = questionShortcutTarget(event);
    const questionList = questionsRef.current;
    if (!target || !questionList) return;
    if (target !== document.body && target !== document.documentElement && !questionList.contains(target)) return;

    const { key } = event;
    if (key === "ArrowLeft" || key === "ArrowRight") {
      if (moveToQuestion(activeQuestionIndex + (key === "ArrowLeft" ? -1 : 1))) {
        event.preventDefault();
      }
      return;
    }

    if (key === "Enter") {
      const selectedButton = target.closest('button[data-daily-choice][aria-pressed="true"]');
      if (hasNativeEnterAction(target) && !selectedButton) return;
      if (!activeQuestion || !picks[activeQuestion.id]?.key) return;

      event.preventDefault();
      if (moveToQuestion(activeQuestionIndex + 1)) return;
      if (!isComplete) {
        moveToQuestion(questions.findIndex((question) => !picks[question.id]?.key));
        return;
      }
      if (asksForNickname) {
        const input = nicknameInputRef.current;
        input?.focus({ preventScroll: true });
        input?.scrollIntoView({ block: "center" });
      } else {
        submitRef.current?.click();
      }
      return;
    }

    const choice = questionList.querySelector<HTMLButtonElement>(
      `[data-daily-question="${activeQuestionIndex}"] button[data-daily-choice="${key}"]`,
    );
    if (!choice || choice.disabled) return;
    event.preventDefault();
    choice.click();
    choice.focus({ preventScroll: true });
    choice.scrollIntoView({ block: "nearest" });
  });

  useEffect(() => {
    if (!keyboardEnabled) return;
    const onKeyDown = (event: KeyboardEvent) => handleQuestionKey(event);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [keyboardEnabled]);

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
      if (rankBoard === "total") {
        setCumulative(await getCumulativeBoard(exam, subjectId));
      } else {
        const rows = await getTodayBoard(exam, subjectId, score?.dateKey ?? dateKey);
        if (rows.length > 0 || !score?.saved) {
          setRanking(rows);
          setRankingSynced(true);
        } else {
          setRankingError(true);
        }
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
        <p className="text-sm text-smoke">
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
  const activeRanking = rankBoard === "total" ? cumulative : liveRanking;
  const visibleRanking = showAllRanking ? activeRanking : activeRanking.slice(0, 10);
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

  // 메뉴 가운데 칸 — 채점 뒤엔 리포트가 권하는 다음 걸음(틀린 문제·오늘의 복습), 풀기 전엔 오늘의 복습.
  const nextReview =
    step === "result" && score
      ? dailyReportAction(exam, subjectId, score.attemptId, score.report)
      : mode === "review"
        ? null // 지금 풀고 있는 화면이 바로 그 칸이라 단추 대신 표시만
        : insights.dueReviewCount > 0
          ? {
              href: `${rankedDailyHref}&review=due`,
              label: "오늘의 복습 풀기",
              count: insights.dueReviewCount,
            }
          : null;
  const showTodayQuestions = () => {
    setRevealedReviewKey(null);
    document
      .getElementById("daily-review-questions")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 「매일 10문제 · 전체 기출 한 바퀴」 소개와 세 칸 메뉴 — 풀기 전엔 맨 위, 채점 뒤엔 학습 리포트 아래.
  const rotationIntro = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold leading-6 text-ink">
            매일 10문제 · 전체 기출 한 바퀴
          </h2>
          <p className="mt-0.5 text-xs leading-5 text-fog">
            {composition.usesRounds
              ? `최신 ${composition.spanCount}회분`
              : `최근 ${composition.spanCount}개년`}{" "}
            · {composition.topics}개 단원 · {composition.poolCount.toLocaleString()}문제를 하루 10문제씩, 한 바퀴 약 {composition.rotationDays}일
          </p>
        </div>
        {/* 채점 뒤엔 학습 리포트가 같은 숫자를 보여 줘서 뺀다. */}
        {step !== "result" && !isArchive ? (
          <div className="flex shrink-0 gap-1 text-[11px] font-medium text-smoke">
            <span className="rounded-md bg-snow px-2 py-1">
              연속 {insights.streak}일
            </span>
            <span className="rounded-md bg-snow px-2 py-1">
              이번 달 {insights.monthDone}회
            </span>
          </div>
        ) : null}
      </div>
      <details className="group mt-1.5">
        <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs font-medium text-[color:light-dark(#4d49fc,var(--color-carbon))] [&::-webkit-details-marker]:hidden">
          한 바퀴는 어떻게 도나요?
          <span className="transition-transform group-open:rotate-180" aria-hidden>⌄</span>
        </summary>
        <ol className="mt-2 space-y-1.5 text-[13px] leading-6 text-[color:light-dark(#595959,var(--color-smoke))]">
          {[
            ["한 번 섞기", `${subjectLabel} 기출 ${composition.poolCount.toLocaleString()}문제를 카드 섞듯 한 번 섞어 1번부터 ${composition.poolCount.toLocaleString()}번까지 순서를 정합니다.`],
            ["하루 10문제씩 차례로", `첫날은 1~10번, 다음 날은 11~20번처럼 앞에서부터 이어서 냅니다. 한 번 나간 자리는 다시 쓰지 않으니 한 바퀴(약 ${composition.rotationDays}일)를 다 돌 때까지 같은 문제가 두 번 나오지 않습니다.`],
            ["다 돌면 다시 섞기", "마지막 문제까지 나가면 새로 섞어 다음 바퀴를 시작합니다. 앞 바퀴 끝과 새 바퀴 처음이 같은 날에 걸쳐도 그날 10문제 안에서는 겹치지 않습니다."],
            ["누구에게나 같은 순서", "같은 날에는 누가 풀어도 같은 10문제가 나옵니다. 그래서 순위를 공정하게 비교할 수 있습니다."],
          ].map(([title, body], index) => (
            <li key={title} className="flex gap-2.5">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#4d49fc]/10 font-mono text-[11px] text-[color:light-dark(#4d49fc,var(--color-carbon))]">
                {index + 1}
              </span>
              <span>
                <strong className="font-semibold text-black">{title}</strong> · {body}
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-2.5 rounded-xl bg-[#4d49fc]/[0.06] px-3 py-2.5 text-[13px] leading-6 text-[color:light-dark(#595959,var(--color-smoke))]">
          <p>
            <strong className="font-semibold text-black">바퀴는 끝없이 이어집니다.</strong>{" "}
            {Math.floor(365 / Math.max(1, composition.rotationDays)) >= 1
              ? `매일 풀면 1년에 약 ${Math.floor(365 / Math.max(1, composition.rotationDays))}바퀴, 같은 문제를 그만큼 다시 만납니다.`
              : `한 바퀴에 약 ${composition.rotationDays}일이 걸리고, 다 돌면 다음 바퀴가 이어집니다.`}
          </p>
          {Math.floor(365 / Math.max(1, composition.rotationDays)) >= 2 ? (
            <p className="mt-1 text-[15px] font-semibold text-[color:light-dark(#4d49fc,var(--color-carbon))]">
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
        <p className="mt-2 text-xs leading-5 text-[color:light-dark(#8a8a8a,var(--color-smoke))]">
          새 연도 기출이 들어오면 문제 모음이 바뀌어 순서를 새로 섞습니다.
        </p>
      </details>
      <nav
        aria-label="매일 10문제 메뉴"
        className="mt-2.5 grid grid-cols-3 gap-1 rounded-xl bg-[color:light-dark(#EEF3F9,color-mix(in_srgb,var(--color-snow)_90%,#EEF3F9))] p-1 text-center text-xs font-semibold leading-tight"
      >
        {step === "result" && mode === "ranked" ? (
          // 채점 뒤 「오늘의 10문제」는 해설을 가린 문제 화면으로 돌아간다.
          <button
            type="button"
            onClick={showTodayQuestions}
            className="rounded-lg bg-[#007AFF] px-2 py-2 text-white"
          >
            오늘의 10문제
          </button>
        ) : (
          <Link
            href={rankedDailyHref}
            className={`flex items-center justify-center rounded-lg px-2 py-2 ${mode === "ranked" ? "bg-[#007AFF] text-white" : "text-smoke hover:bg-white"}`}
          >
            오늘의 10문제
          </Link>
        )}
        {nextReview ? (
          <Link
            href={nextReview.href}
            className={`flex items-center justify-center rounded-lg px-2 py-2 ${mode === "review" ? "bg-[#007AFF] text-white" : "text-[color:light-dark(#0066D6,var(--color-carbon))] hover:bg-white"}`}
          >
            <span>
              {nextReview.label}
              <span className="whitespace-nowrap tabular-nums"> · {nextReview.count}문제</span>
            </span>
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className={`flex items-center justify-center rounded-lg px-2 py-2 ${mode === "review" ? "bg-[#007AFF] text-white" : "text-[color:light-dark(#94a3b8,var(--color-smoke))]"}`}
          >
            {mode === "review" ? "틀린 문제 다시 풀기" : "복습할 문제 없음"}
          </span>
        )}
        <Link
          href={`/${exam}/daily/wrong?subject=${encodeURIComponent(subjectId)}`}
          className="flex items-center justify-center rounded-lg px-2 py-2 text-smoke hover:bg-white"
        >
          특별한 오답노트
        </Link>
      </nav>
    </>
  );

  return (
    <div className={`daily-page-background py-8 ${step === "result" ? "px-2 sm:px-4" : "px-4"}`}>
      <div className={`mx-auto flex flex-col gap-4 ${step === "result" ? "max-w-[900px]" : "max-w-xl"}`}>
        <BackLink href={backHref}>
          {label} · {subjectLabel}
        </BackLink>
        <section className="rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-7">
          {isArchive || mode === "review" || mode === "practice" ? (
            <p className="mt-2 text-sm leading-6 text-smoke first:mt-0">
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
              className="mt-6 border-b border-[color:light-dark(#e6eef8,var(--color-mist))] pb-6 first:mt-0 last:border-b-0 last:pb-0"
              aria-label={`${isArchive ? formatKoreanDate(dateKey) : "오늘"} 순위`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex rounded-full bg-[color:light-dark(#EEF3F9,var(--color-snow))] p-1" role="tablist" aria-label="순위 보기">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={rankBoard === "today"}
                    onClick={() => setRankBoard("today")}
                    className={`rounded-full px-3 py-1.5 text-sm font-semibold ${rankBoard === "today" ? "bg-white text-ink shadow-sm" : "text-fog"}`}
                  >
                    {isArchive ? formatKoreanDate(dateKey) : "오늘 순위"}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={rankBoard === "total"}
                    onClick={() => setRankBoard("total")}
                    className={`rounded-full px-3 py-1.5 text-sm font-semibold ${rankBoard === "total" ? "bg-white text-ink shadow-sm" : "text-fog"}`}
                  >
                    누적 순위
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => void toggleRanking()}
                  aria-expanded={showAllRanking}
                  className="rounded-full border border-[color:light-dark(#cfe0f5,var(--color-mist))] bg-white px-3 py-2 text-xs font-semibold text-[color:light-dark(#0066D6,var(--color-carbon))] hover:border-[#007AFF]"
                >
                  {showAllRanking ? "순위 접기 ↑" : "전체 순위 보기 ↓"}
                </button>
              </div>
              <h2 className="mt-3 text-base font-semibold text-ink">
                {showAllRanking ? `전체 순위 · ${activeRanking.length}명` : "상위 10명"}
              </h2>
              {rankingLoading ? (
                <p className="mt-3 text-xs text-fog">최신 순위를 불러오는 중...</p>
              ) : null}
              {rankingError ? (
                <p className="mt-3 text-xs text-[color:light-dark(#B45309,var(--color-amber))]">최신 순위를 불러오지 못했습니다. {isArchive ? "버튼을 다시 눌러주세요." : "잠시 후 자동으로 다시 확인합니다."}</p>
              ) : null}
              {visibleRanking.length > 0 ? (
                <ol className="mt-4 divide-y divide-[color:light-dark(#eef2f7,var(--color-mist))]">
                  {visibleRanking.map((row) => (
                    <li
                      key={`${row.rank}-${row.nickname}`}
                      className={`flex items-center justify-between gap-3 py-2.5 text-sm first:pt-0 last:pb-0 ${row.mine ? "text-[color:light-dark(#0066D6,var(--color-carbon))]" : "text-ink"}`}
                    >
                      <span className="min-w-0 truncate font-semibold">
                        {row.rank}. {row.nickname}
                      </span>
                      <span className="shrink-0 text-xs text-fog">
                        {rankBoard === "total"
                          ? `${row.days ?? 0}일 · 맞힌 수 ${row.correct}`
                          : `${row.correct}/${row.total} · ${
                              row.elapsedMs != null ? formatElapsed(row.elapsedMs) : "-"
                            }`}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 rounded-2xl bg-[color:light-dark(#f8fafc,var(--color-snow))] px-4 py-5 text-center text-sm text-fog">
                  {rankBoard === "total" ? "아직 누적 기록이 없습니다." : "아직 오늘 기록이 없습니다."}
                </p>
              )}
            </div>
          ) : null}
          {challenge ? (
            <div className="mt-4 rounded-2xl bg-[color:light-dark(#E8F4FF,color-mix(in_srgb,var(--color-snow)_90%,#E8F4FF))] px-4 py-4 first:mt-0">
              <p className="text-sm font-bold text-[color:light-dark(#075AA8,var(--color-carbon))]">
                {`${challenge.nickname}님이 보낸 무료 기출 10문제`}
              </p>
              <p className="mt-1 text-xs leading-5 text-[color:light-dark(#3B6285,var(--color-carbon))]">
                매일 새로운 기출 10문제를 무료로 풀고, 채점과 해설까지 확인해 보세요.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-bold text-[color:light-dark(#075AA8,var(--color-carbon))]">
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
            <p className="mt-4 rounded-2xl border border-[color:light-dark(#cfe3fb,var(--color-mist))] bg-white/80 px-4 py-3 text-sm text-[color:light-dark(#0B3A66,var(--color-carbon))]">
              초대한 친구 기록 {challenge.correct}/{challenge.total} · 도전하고
              순위에 이름을 올려보세요.
            </p>
          ) : invitedBy ? (
            <p className="mt-4 rounded-2xl border border-[color:light-dark(#cfe3fb,var(--color-mist))] bg-white/80 px-4 py-3 text-sm text-[color:light-dark(#0B3A66,var(--color-carbon))]">
              {invitedBy}님이 {subjectLabel} 오늘의 10문제에 초대했어요.
              함께 풀고 결과를 비교해 보세요.
            </p>
          ) : null}
          {step === "play" && !signedIn && !isArchive && mode === "ranked" ? (
            <input
              id="daily-nickname"
              value={nickname}
              maxLength={16}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="닉네임"
              aria-label="닉네임"
              className="mt-5 w-full rounded-2xl border border-[color:light-dark(#d7e3f4,var(--color-mist))] bg-white px-4 py-3 text-sm outline-none placeholder:text-[color:light-dark(#94a3b8,var(--color-smoke))] focus:border-[#007AFF]"
            />
          ) : null}
          {error && step === "play" ? (
            <p className="mt-3 text-sm text-smoke">{error}</p>
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
              <span className="font-semibold text-[color:light-dark(#0066D6,var(--color-carbon))]">
                {isArchive
                  ? `지난 문제 · ${answeredCount}/${questions.length} 답변`
                  : `${answeredCount}/${questions.length} 답변`}
              </span>
              {isArchive ? (
                <Link
                  href={`/${exam}/daily?subject=${encodeURIComponent(subjectId)}`}
                  className="text-smoke"
                >
                  오늘 문제
                </Link>
              ) : null}
            </div>
            {isArchive ? (
              <p className="mt-2 text-xs leading-5 text-fog">
                지난 날짜 문제도 풀 수 있어요. 연습으로 채점하고 해설을 보여 주며, 순위에는 들지 않아요.
              </p>
            ) : null}
            {questions.length > 0 ? (
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[color:light-dark(#e6eef8,color-mix(in_srgb,var(--color-snow)_90%,#e6eef8))]">
                <div
                  className="h-full rounded-full bg-[#007AFF]"
                  style={{
                    width: `${(answeredCount / questions.length) * 100}%`,
                  }}
                />
              </div>
            ) : null}
            {keyboardEnabled ? (
              <p className="exam-keyboard-hint mt-3 hidden flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-smoke md:flex [@media(pointer:coarse)]:hidden">
                <span className="font-semibold text-ink" aria-live="polite">
                  {activeQuestionIndex + 1}/{questions.length}번
                </span>
                <span className="inline-flex items-center gap-1.5"><kbd>1</kbd>~<kbd>{lastChoiceKey}</kbd> 선택</span>
                <span className="inline-flex items-center gap-1.5"><kbd>←</kbd><kbd>→</kbd> 문항 이동</span>
                <span className="inline-flex items-center gap-1.5">
                  <kbd>Enter</kbd> 다음 · {asksForNickname ? "마지막 닉네임 확인" : "마지막 제출"}
                </span>
              </p>
            ) : null}
            <div ref={questionsRef} className="mt-6 space-y-8">
              {questions.map((question, questionIndex) => (
                <article
                  key={question.id}
                  data-daily-question={questionIndex}
                  tabIndex={keyboardEnabled ? -1 : undefined}
                  aria-label={`${questionIndex + 1}번 문항`}
                  aria-current={keyboardEnabled && questionIndex === activeQuestionIndex ? "true" : undefined}
                  onFocusCapture={keyboardEnabled ? () => setActiveQuestionIndex(questionIndex) : undefined}
                  onPointerDownCapture={keyboardEnabled ? () => setActiveQuestionIndex(questionIndex) : undefined}
                  className="group/daily-question scroll-mt-24 border-b border-[color:light-dark(#e6eef8,var(--color-mist))] pb-8 outline-none last:border-b-0 last:pb-0"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-full bg-[color:light-dark(#E8F4FF,color-mix(in_srgb,var(--color-snow)_90%,#E8F4FF))] text-xs font-bold text-[color:light-dark(#0066D6,var(--color-carbon))] group-aria-[current=true]/daily-question:ring-2 group-aria-[current=true]/daily-question:ring-carbon/55">
                      {questionIndex + 1}
                    </span>
                    <p className="text-xs text-fog">
                      {question.sourceLabel}
                    </p>
                    {question.nextDateKey ? (
                      <button
                        type="button"
                        onClick={() => setShowScheduleGuide(true)}
                        aria-label={`다음 출제 예정 ${formatKoreanDate(question.nextDateKey)}. 출제 방식 안내 보기`}
                        title={`다음 출제 예정 ${formatKoreanDate(question.nextDateKey)}`}
                        className="ml-auto rounded-md border border-[color:light-dark(#E4EAF1,var(--color-mist))] bg-transparent px-1.5 py-0.5 text-[10px] font-medium leading-4 text-[color:light-dark(#77869A,var(--color-smoke))] transition-colors hover:border-[color:light-dark(#CFDAE6,var(--color-mist))] hover:bg-[color:light-dark(#F8FAFC,var(--color-snow))] hover:text-[color:light-dark(#52657A,var(--color-smoke))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8BB9EA]"
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
                  {(() => {
                    const oxTable = dailyOxTableFrom(
                      question.presentation.promptItems,
                      question.choices,
                    );
                    if (oxTable) {
                      return (
                        <DailyOxComboTable
                          headers={oxTable.headers}
                          rows={oxTable.rows}
                          choices={question.choices}
                          selectedKey={picks[question.id]?.key}
                          onSelect={(key) => choose(question.id, key)}
                          disabled={busy}
                          keyboardShortcuts={keyboardEnabled && activeQuestionIndex === questionIndex}
                        />
                      );
                    }
                    return (
                  <div className="mt-4 grid gap-2">
                    {question.choices.map((choice, choiceIndex) => {
                      const selected = picks[question.id]?.key === choice.key;
                      return (
                        <button
                          key={choice.key}
                          type="button"
                          onClick={() => choose(question.id, choice.key)}
                          disabled={busy}
                          aria-pressed={selected}
                          data-daily-choice={choiceIndex + 1}
                          aria-keyshortcuts={keyboardEnabled && activeQuestionIndex === questionIndex && choiceIndex < 9 ? String(choiceIndex + 1) : undefined}
                          className={`rounded-2xl border px-3 py-2.5 text-left text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2 disabled:opacity-60 sm:px-4 ${selected ? "border-[color:light-dark(#91C6FF,var(--color-mist))] bg-[color:light-dark(#F1F8FF,color-mix(in_srgb,var(--color-snow)_90%,#F1F8FF))]" : "border-[color:light-dark(#DDE9F6,var(--color-mist))] bg-white hover:border-[color:light-dark(#A9D2FF,var(--color-mist))] hover:bg-[color:light-dark(#F8FBFF,var(--color-snow))]"}`}
                        >
                          <div className={choice.originalImage ? "flex items-center gap-3 [&>span:first-child]:mt-0" : "flex gap-3"}>
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
                    );
                  })()}
                </article>
              ))}
            </div>
            {(
              <>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  if (isComplete && !busy) void finish(picks);
                }}>
                  {/* 닉네임은 오늘 순위에만 쓰인다 — 틀린 문제 다시 풀기·추가 연습엔 묻지 않는다. */}
                  {asksForNickname ? (
                    <div
                      className={`mt-8 rounded-2xl border p-4 transition-all duration-300 ${isComplete ? "border-[color:light-dark(#80BFFF,var(--color-mist))] bg-[color:light-dark(#F0F7FF,color-mix(in_srgb,var(--color-snow)_90%,#F0F7FF))] shadow-[0_8px_24px_rgba(0,122,255,0.10)] ring-4 ring-[#007AFF]/10" : "border-[color:light-dark(#dbe7f5,var(--color-mist))] bg-[color:light-dark(#f8fafc,var(--color-snow))]"}`}
                      aria-live="polite"
                    >
                      <p className={`text-sm font-bold ${isComplete ? "text-[color:light-dark(#075AA8,var(--color-carbon))]" : "text-fog"}`}>
                        {isComplete
                          ? "답안을 제출하기 전에 닉네임을 확인해 주세요"
                          : `${questions.length - answeredCount}문제를 더 풀면 닉네임을 입력할 수 있어요`}
                      </p>
                      <p id="daily-submit-nickname-hint" className="mt-1 text-xs leading-5 text-fog">
                        닉네임은 오늘 순위에 표시됩니다. 입력하거나 빈칸으로 두고 Enter를 누르면 제출됩니다.
                      </p>
                      <input
                        id="daily-nickname-submit"
                        ref={nicknameInputRef}
                        aria-describedby="daily-submit-nickname-hint"
                        value={nickname}
                        maxLength={16}
                        onChange={(event) => setNickname(event.target.value)}
                        disabled={!isComplete || busy}
                        placeholder={isComplete ? "순위에 표시할 닉네임" : "10문제를 모두 선택하면 활성화됩니다"}
                        aria-label="제출 전 닉네임"
                        className="mt-3 w-full rounded-2xl border border-[color:light-dark(#cfe0f5,var(--color-mist))] bg-white px-4 py-3 text-sm outline-none placeholder:text-[color:light-dark(#94a3b8,var(--color-smoke))] focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 disabled:cursor-not-allowed disabled:bg-[color:light-dark(#eef2f7,color-mix(in_srgb,var(--color-snow)_90%,#eef2f7))] disabled:text-[color:light-dark(#94a3b8,var(--color-smoke))]"
                      />
                    </div>
                  ) : null}
                  <button
                    type="submit"
                    ref={submitRef}
                    aria-keyshortcuts={isComplete && activeQuestionIndex === questions.length - 1 ? "Enter" : undefined}
                    disabled={!isComplete || busy}
                    className={`${signedIn || mode !== "ranked" ? "mt-8" : "mt-4"} w-full rounded-2xl bg-[#007AFF] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#94a3b8]`}
                  >
                    {busy
                      ? "채점하는 중..."
                      : isComplete
                        ? "답안 제출하고 결과 보기"
                        : `${questions.length - answeredCount}문제 더 답하기`}
                  </button>
                </form>
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
                  <p className="mt-3 text-center text-xs text-fog">
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
            <DailyLearningReportCard
              exam={exam}
              subjectId={subjectId}
              attemptId={score.attemptId}
              rank={score.rank}
              report={score.report}
              hideAction={!challenge}
            >
              {!challenge ? rotationIntro : null}
            </DailyLearningReportCard>
            {challenge ? (
              <p className="mt-3 text-sm text-[color:light-dark(#334155,var(--color-ink))]">
                {challenge.nickname} {challenge.correct}/{challenge.total} · 나{" "}
                {score.correct}/{score.total}
              </p>
            ) : null}
            {score.message ? (
              <p className="mt-3 text-sm text-smoke">{score.message}</p>
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
                  className="min-w-0 flex-1 rounded-2xl border border-[color:light-dark(#d7e3f4,var(--color-mist))] bg-white px-4 py-3 text-sm outline-none placeholder:text-[color:light-dark(#94a3b8,var(--color-smoke))]"
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
              <p className="mt-3 text-sm text-smoke">{error}</p>
            ) : null}
            {challenge && liveFriendBoard.length > 0 ? (
              <section className="mt-5 rounded-3xl border border-[#F7D900] bg-[color:light-dark(#FFFBE6,color-mix(in_srgb,var(--color-snow)_90%,#FFFBE6))] p-4">
                <p className="text-xs font-bold text-[color:light-dark(#6B5300,var(--color-amber))]">
                  친구와 함께한 오늘의 기록
                </p>
                <ol className="mt-3 divide-y divide-[color:light-dark(#F5E9A8,var(--color-mist))]">
                  {liveFriendBoard.slice(0, 10).map((row) => (
                    <li
                      key={`${row.rank}-${row.nickname}`}
                      className="flex items-center justify-between py-2 text-sm"
                    >
                      <span
                        className={
                          row.mine
                            ? "font-bold text-[color:light-dark(#0066D6,var(--color-carbon))]"
                            : "font-semibold text-ink"
                        }
                      >
                        {row.rank}. {row.nickname}
                      </span>
                      <span className="text-xs text-fog">
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
            <div
              id="daily-review-questions"
              className="mt-5 scroll-mt-20 rounded-2xl border border-[color:light-dark(#cfe0f5,var(--color-mist))] bg-[color:light-dark(#f8fbff,var(--color-snow))] p-3 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:p-4"
            >
              <div>
                <p className="text-sm font-semibold text-ink">
                  {showReviewAnswers
                    ? "정답과 해설을 보고 있어요"
                    : "먼저 문제를 다시 확인해 보세요"}
                </p>
                <p className="mt-1 text-xs leading-5 text-fog">
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
              exam={exam}
              subjectLabel={subjectLabel}
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
    <div className="daily-page-background px-4 py-8">
      <div className="mx-auto max-w-xl">
        <BackLink href={home}>{label} 학습 홈</BackLink>
        <div className="mt-5 rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-7">
          <p className="text-xs font-semibold text-fog">{label}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
