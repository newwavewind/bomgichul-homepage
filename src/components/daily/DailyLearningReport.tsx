import Link from "next/link";
import { formatElapsed } from "@/lib/daily-challenge/format";
import type { DailyLearningReport } from "@/lib/daily-challenge/types";

export function DailyLearningReportCard({
  exam,
  subjectId,
  attemptId,
  correct,
  total,
  elapsedMs,
  rank,
  report,
}: {
  exam: string;
  subjectId: string;
  attemptId: string | null;
  correct: number;
  total: number;
  elapsedMs: number;
  rank: number | null;
  report: DailyLearningReport;
}) {
  const delta = report.previousDelta;
  return (
    <section className="mt-5 rounded-3xl border border-[#dbe7f5] bg-[linear-gradient(145deg,#F7FBFF,#EEF7FF)] p-3 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-[#0066D6]">오늘의 학습 리포트</p>
          <h2 className="mt-1 text-lg font-bold text-ink">
            {correct}/{total} · {formatElapsed(elapsedMs)}
          </h2>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#334155] shadow-sm">
          {rank ? `${rank}위` : "순위 밖 연습"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat
          label="상위"
          value={report.percentile ? `${report.percentile}%` : "-"}
        />
        <Stat label="연속 학습" value={`${report.streak}일`} />
        <Stat label="이번 달" value={`${report.monthDone}회`} />
        <Stat label="복습 대기" value={`${report.dueReviewCount}문제`} />
      </div>

      <div className="mt-4 space-y-1.5 text-sm text-[#475569]">
        <p>
          {delta == null
            ? "이 과목의 첫 비교 기록입니다."
            : delta > 0
              ? `직전 기록보다 ${delta}문제 더 맞혔어요.`
              : delta < 0
                ? `직전 기록보다 ${Math.abs(delta)}문제 적게 맞혔어요.`
                : "직전 기록과 같은 점수예요."}
        </p>
        <p>
          {report.weakTopic
            ? `최근 7일 보완 단원: ${report.weakTopic}`
            : "기록이 쌓이면 최근 7일 보완 단원을 알려드려요."}
        </p>
      </div>

      {attemptId && report.wrongCount > 0 ? (
        <Link
          href={`/${exam}/daily?subject=${encodeURIComponent(subjectId)}&review=${attemptId}`}
          className="mt-4 flex min-h-11 w-full items-center justify-center rounded-2xl bg-[#007AFF] px-4 text-sm font-bold text-white"
        >
          틀린 문제 다시 풀기 · {report.wrongCount}문제
        </Link>
      ) : report.dueReviewCount > 0 ? (
        <Link
          href={`/${exam}/daily?subject=${encodeURIComponent(subjectId)}&review=due`}
          className="mt-4 flex min-h-11 w-full items-center justify-center rounded-2xl bg-[#007AFF] px-4 text-sm font-bold text-white"
        >
          오늘의 복습 풀기 · {report.dueReviewCount}문제
        </Link>
      ) : null}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/90 px-3 py-3 shadow-sm">
      <p className="text-[11px] font-semibold text-[#64748b]">{label}</p>
      <p className="mt-0.5 text-base font-bold text-ink">{value}</p>
    </div>
  );
}
