"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { DailyReviewList } from "@/components/daily/DailyReviewList";
import { ResultActions } from "@/components/daily/ResultActions";
import { startDailyAttempt, submitDailyAttempt } from "@/lib/daily-challenge/actions";
import { formatElapsed, formatKoreanDate } from "@/lib/daily-challenge/format";
import type { DailyQuestionView, DailyScore } from "@/lib/daily-challenge/types";

type Step = "play" | "result";

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
  mode,
  questions,
  roundHref,
  defaultNickname,
  challenge,
}: {
  exam: string;
  subjectId: string;
  subjectLabel: string;
  label: string;
  home: string;
  dateKey: string;
  mode: "ranked" | "practice";
  questions: DailyQuestionView[];
  roundHref: string;
  defaultNickname: string;
  challenge: { id: string; nickname: string; correct: number; total: number } | null;
}) {
  const signedIn = Boolean(defaultNickname);
  const [step, setStep] = useState<Step>("play");
  const [nickname, setNickname] = useState("");
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<DailyScore | null>(null);

  const question = questions[index];

  useEffect(() => {
    let cancelled = false;
    void startDailyAttempt({ exam, subject: subjectId, mode, deviceId: deviceId() }).then((started) => {
      if (cancelled || started.ok) return;
      setError(started.message);
    });
    return () => {
      cancelled = true;
    };
  }, [exam, subjectId, mode]);

  async function finish(nextPicks: Record<string, string>, name = signedIn ? defaultNickname : nickname) {
    setBusy(true);
    setError(null);
    const result = await submitDailyAttempt({
      exam,
      subject: subjectId,
      mode,
      deviceId: deviceId(),
      nickname: name,
      picks: questions.map((item) => ({ id: item.id, key: nextPicks[item.id] ?? "" })),
    });
    setBusy(false);
    if ("review" in result) {
      setScore(result);
      setStep("result");
      return;
    }
    setError(result.message);
  }

  function choose(key: string) {
    if (!question || busy) return;
    const next = { ...picks, [question.id]: key };
    setPicks(next);
    if (index + 1 >= questions.length) {
      void finish(next);
      return;
    }
    setIndex(index + 1);
  }

  if (questions.length === 0) {
    return (
      <Shell label={label} home={home}>
        <p className="text-sm text-[#475569]">오늘 풀 객관식 기출을 찾지 못했습니다.</p>
      </Shell>
    );
  }

  const share = score?.share;

  return (
    <div className="bg-[linear-gradient(180deg,#f3f8ff_0%,#ffffff_40%)] px-4 py-8">
      <div className="mx-auto flex max-w-xl flex-col gap-4">
        <section className="rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-7">
          <p className="text-xs font-semibold text-[#64748b]">
            <Link href={home} className="hover:text-[#0066D6]">{label}</Link>
          </p>
          <p className="mt-2 text-sm text-[#0066D6]">{formatKoreanDate(dateKey)}</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink">{subjectLabel}</h1>
          <p className="mt-2 text-sm leading-6 text-[#475569]">
            {label} {subjectLabel} 기출 {questions.length}문항입니다.
            {mode === "practice" ? " 이번 10문제는 순위 밖 연습입니다." : " 순위에는 오늘 한 번만 오릅니다."}
          </p>
          {challenge ? (
            <p className="mt-4 rounded-2xl bg-[#E8F4FF] px-4 py-3 text-sm text-[#0B3A66]">
              {challenge.nickname}의 도전장 · {challenge.correct}/{challenge.total}
            </p>
          ) : null}
          {step === "play" && !signedIn ? (
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
          {error && step === "play" ? <p className="mt-3 text-sm text-[#475569]">{error}</p> : null}
          <p className="mt-4 text-center text-sm">
            <Link href={`/${exam}/daily/ranks?subject=${encodeURIComponent(subjectId)}`} className="font-semibold text-[#0066D6]">오늘 순위 · 누적 순위</Link>
          </p>
        </section>

        {step === "play" && question ? (
          <section className="rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-7">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-[#0066D6]">{index + 1}/{questions.length}</span>
              <Link href={`/${exam}/daily/ranks?subject=${encodeURIComponent(subjectId)}`} className="text-[#475569]">순위</Link>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e6eef8]">
              <div className="h-full rounded-full bg-[#007AFF]" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
            </div>
            <p className="mt-4 text-xs text-[#64748b]">{question.sourceLabel}</p>
            <h2 className="mt-2 text-base font-semibold leading-7 text-ink">{question.stem}</h2>
            <div className="mt-4 grid gap-2">
              {question.choices.map((choice) => (
                <button
                  key={choice.key}
                  type="button"
                  onClick={() => choose(choice.key)}
                  disabled={busy}
                  className="rounded-2xl border border-[#d7e3f4] bg-white/85 px-4 py-3 text-left text-sm leading-6 text-ink hover:border-[#007AFF] disabled:opacity-60"
                >
                  <span className="mr-2 font-semibold text-[#0066D6]">{choice.label}</span>
                  {choice.text}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {step === "result" && score && share ? (
          <section className="rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-7">
            <p className="text-sm text-[#0066D6]">{formatKoreanDate(score.dateKey)}</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink">{score.correct}/{score.total}</h2>
            <p className="mt-1 text-sm text-[#475569]">{formatElapsed(score.elapsedMs)}{score.rank ? ` · 오늘 ${score.rank}위` : ""}</p>
            {challenge ? (
              <p className="mt-3 text-sm text-[#334155]">
                {challenge.nickname} {challenge.correct}/{challenge.total} · 나 {score.correct}/{score.total}
              </p>
            ) : null}
            {score.message ? <p className="mt-3 text-sm text-[#475569]">{score.message}</p> : null}
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
                <button type="submit" className="rounded-2xl bg-[#007AFF] px-4 py-3 text-sm font-semibold text-white" disabled={busy}>
                  다시 올리기
                </button>
              </form>
            ) : null}
            {error ? <p className="mt-3 text-sm text-[#475569]">{error}</p> : null}
            <DailyReviewList items={score.review} />
            <div className="mt-6">
              <ResultActions
                exam={exam}
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
              />
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function Shell({ label, home, children }: { label: string; home: string; children: ReactNode }) {
  return (
    <div className="bg-[linear-gradient(180deg,#f3f8ff_0%,#ffffff_40%)] px-4 py-8">
      <div className="mx-auto max-w-xl rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-7">
        <p className="text-xs font-semibold text-[#64748b]">
          <Link href={home} className="hover:text-[#0066D6]">{label}</Link>
        </p>
        {children}
      </div>
    </div>
  );
}
