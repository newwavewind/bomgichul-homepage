"use client";

import Link from "next/link";
import { DailyInviteCard } from "@/components/daily/DailyInviteCard";
import { AppStoreButtons } from "@/components/ui/AppStoreButtons";
import { appStoreLinksForDailyExam } from "@/lib/constants";

export function ResultActions({
  exam,
  examLabel,
  label,
  subjectId,
  home,
  dateKey,
  correct,
  total,
  attemptId,
  roundHref,
  practicePage = 0,
  participants = 0,
}: {
  exam: string;
  examLabel?: string;
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
  practicePage?: number;
  participants?: number;
}) {
  const playPath = `/${exam}/daily?subject=${encodeURIComponent(subjectId)}`;
  const isPractice = practicePage > 0;
  const nextPracticePage = practicePage > 0 ? practicePage + 1 : 1;
  const storeLinks = appStoreLinksForDailyExam(exam);
  const hasStoreLink = Boolean(storeLinks.ios || storeLinks.android);

  return (
    <div className="space-y-3">
      <DailyInviteCard
        exam={exam}
        label={label}
        subjectId={subjectId}
        dateKey={dateKey}
        attempt={
          attemptId
            ? { attemptId, correct, total, participants }
            : null
        }
        isPractice={isPractice}
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <Link
          href={`${playPath}&more=${nextPracticePage}`}
          className={quietButton}
        >
          추가 10문제 연습
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
      {hasStoreLink ? (
        <section className="rounded-[24px] border border-[#d7e3f4] bg-white/80 px-4 py-5 text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <p className="text-sm font-bold text-ink">
            {examLabel || label} 전용 앱에서 이어서 공부하기
          </p>
          <p className="mt-1 text-xs leading-5 text-[#64748b]">
            내 기기에 맞는 스토어에서 전용 앱을 내려받으세요.
          </p>
          <AppStoreButtons
            className="mt-4 justify-center"
            size="sm"
            links={storeLinks}
          />
        </section>
      ) : null}
    </div>
  );
}

const quietButton =
  "inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#d7e3f4] bg-white/80 px-4 py-2 text-center text-sm font-semibold text-[#334155]";
