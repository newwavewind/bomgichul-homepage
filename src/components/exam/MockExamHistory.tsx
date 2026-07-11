import type { MockExamSession } from "@/types/database";
import { formatKstDateTimeShort } from "@/lib/datetime";

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function formatDate(iso: string): string {
  return formatKstDateTimeShort(iso);
}

export function MockExamHistory({ sessions }: { sessions: MockExamSession[] }) {
  if (sessions.length === 0) return null;

  const latest = sessions[0];
  const previous = sessions[1];
  const delta =
    previous != null ? latest.correct - previous.correct : null;
  const latestRate = Math.round((latest.correct / latest.total) * 100);

  return (
    <div className="mb-8 rounded-[var(--radius-cards)] border border-carbon bg-ice px-5 py-4">
      <p className="font-display text-body-sm font-semibold text-ink">시험 모드 기록</p>
      <p className="mt-1 font-display text-body-sm text-smoke">
        최근 {latest.correct}/{latest.total} ({latestRate}%) · {formatElapsed(latest.elapsed_seconds)}
        {delta != null && (
          <span className={delta >= 0 ? " text-[#6366f1]" : " text-[#ef4444]"}>
            {" "}
            · 이전 대비 {delta >= 0 ? "+" : ""}
            {delta}문항
          </span>
        )}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {sessions.slice(0, 5).map((session) => (
          <span
            key={session.id}
            className="rounded-full border border-mist bg-paper px-2.5 py-1 font-display text-[11px] text-smoke"
          >
            {formatDate(session.created_at)} {session.correct}/{session.total}
          </span>
        ))}
      </div>
    </div>
  );
}
