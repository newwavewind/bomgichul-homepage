import Link from "next/link";
import type { ReactNode } from "react";
import type { DailyLearningReport } from "@/lib/daily-challenge/types";

/** 리포트가 권하는 다음 걸음 — 이 판에서 틀린 문제, 없으면 오늘의 복습. 매일 10문제 메뉴 칸도 이것을 쓴다. */
export function dailyReportAction(
  exam: string,
  subjectId: string,
  attemptId: string | null,
  report: Pick<DailyLearningReport, "wrongCount" | "dueReviewCount">,
): { href: string; label: string; count: number } | null {
  const base = `/${exam}/daily?subject=${encodeURIComponent(subjectId)}`;
  if (attemptId && report.wrongCount > 0) {
    return { href: `${base}&review=${attemptId}`, label: "틀린 문제 다시 풀기", count: report.wrongCount };
  }
  if (report.dueReviewCount > 0) {
    return { href: `${base}&review=due`, label: "오늘의 복습 풀기", count: report.dueReviewCount };
  }
  return null;
}

export function DailyLearningReportCard({
  exam,
  subjectId,
  attemptId,
  rank,
  report,
  hideAction = false,
  children,
}: {
  exam: string;
  subjectId: string;
  attemptId: string | null;
  rank: number | null;
  report: DailyLearningReport;
  /** 다음 걸음 단추를 다른 자리(매일 10문제 메뉴 칸)에서 보여 줄 때 */
  hideAction?: boolean;
  /** 리포트 아래에 이어 붙일 것 — 매일 10문제 풀이 화면은 소개·메뉴를 여기로 내린다. */
  children?: ReactNode;
}) {
  const action = dailyReportAction(exam, subjectId, attemptId, report);
  // 점수·시간·순위는 바로 위 머리에 이미 있다(2026-10-21) — 여기선 그 밖의 숫자만 한 줄로 촘촘히.
  return (
    <section
      aria-label="오늘의 학습 리포트"
      className="mt-3 rounded-2xl border border-[#dbe7f5] bg-[#F5FAFF] p-3"
    >
      <dl className="grid grid-cols-4 divide-x divide-[#dbe7f5] text-center">
        <Stat
          label={rank ? "상위" : "순위"}
          value={rank ? (report.percentile ? `${report.percentile}%` : "-") : "연습"}
        />
        <Stat label="연속 학습" value={`${report.streak}일`} />
        <Stat label="이번 달" value={`${report.monthDone}회`} />
        <Stat label="복습 대기" value={`${report.dueReviewCount}문제`} />
      </dl>


      {action && !hideAction ? (
        <Link
          href={action.href}
          className="mt-2.5 flex min-h-10 w-full items-center justify-center rounded-xl bg-[#007AFF] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0066D6]"
        >
          {action.label} · {action.count}문제
        </Link>
      ) : null}
      {children ? (
        <div className="mt-3 border-t border-[#dbe7f5] pt-3">{children}</div>
      ) : null}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col-reverse px-1">
      <dt className="text-[11px] font-medium text-[#64748b]">{label}</dt>
      <dd className="text-[15px] font-bold tabular-nums text-ink">{value}</dd>
    </div>
  );
}
