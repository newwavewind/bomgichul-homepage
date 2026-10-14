"use client";

import Link from "next/link";
import { KakaoShareButton } from "@/components/daily/KakaoShareButton";
import { formatElapsed, formatKoreanDate } from "@/lib/daily-challenge/format";

export function ResultActions({
  exam,
  label,
  subjectId,
  home,
  dateKey,
  nickname,
  correct,
  total,
  elapsedMs,
  rank,
  attemptId,
  roundHref,
}: {
  exam: string;
  label: string;
  subjectId: string;
  home: string;
  dateKey: string;
  nickname: string;
  correct: number;
  total: number;
  elapsedMs: number;
  rank: number | null;
  attemptId: string | null;
  roundHref: string;
}) {
  const playPath = `/${exam}/daily?subject=${encodeURIComponent(subjectId)}`;
  const resultPath = attemptId
    ? `/${exam}/daily/result?attempt=${attemptId}`
    : `/${exam}/daily/result`;
  const challengePath = attemptId
    ? `${playPath}&challenge=${attemptId}`
    : playPath;
  const rankText = rank ? `오늘 ${rank}위` : "순위 집계 전";
  const description = `${formatKoreanDate(dateKey)} · ${nickname} · 10문제 중 ${correct}개 · ${rankText} · ${formatElapsed(elapsedMs)}`;

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <KakaoShareButton
        title={`${label} 매일 10문제`}
        description={description}
        path={resultPath}
      >
        카카오톡 공유
      </KakaoShareButton>
      <KakaoShareButton
        title={`${nickname}의 ${label} 도전장`}
        description={`${formatKoreanDate(dateKey)} 같은 10문제 · ${nickname} ${correct}/${total} · ${rankText}`}
        path={challengePath}
      >
        카톡으로 도전장
      </KakaoShareButton>
      <Link href={`${playPath}&more=1`} className={quietButton}>
        10문제 더 풀기
      </Link>
      <Link href={roundHref} className={quietButton}>
        이 회차 전부 풀기
      </Link>
      <Link href={home} className={quietButton}>
        이 종목 홈으로
      </Link>
      <Link href="/#exam-selection" className={quietButton}>
        시험 선택으로
      </Link>
    </div>
  );
}

const quietButton =
  "inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#d7e3f4] bg-white/80 px-4 py-2 text-center text-sm font-semibold text-[#334155]";
