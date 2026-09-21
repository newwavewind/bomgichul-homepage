"use client";

import type { ExamCardPayload, WrongSharePayload, TimerPayload, PollPayload } from "@/lib/chat/features";

export function ExamCardBubble({
  payload,
  mine,
}: {
  payload: ExamCardPayload;
  mine?: boolean;
}) {
  return (
    <div
      className={`max-w-[85%] rounded-2xl border px-3 py-2.5 ${
        mine
          ? "border-[#007AFF]/30 bg-[#007AFF]/10"
          : "border-mist bg-white/90"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#0066D6]">
        기출 카드
      </p>
      <p className="mt-1 font-display text-[12px] font-semibold text-ink">
        {[payload.subject, payload.year && `${payload.year}년`, payload.questionNo && `${payload.questionNo}번`]
          .filter(Boolean)
          .join(" · ") || payload.examId}
      </p>
      <p className="mt-1 line-clamp-4 whitespace-pre-wrap font-display text-[13px] leading-relaxed text-smoke">
        {payload.stem}
      </p>
      {payload.label ? (
        <p className="mt-1.5 text-[11px] text-fog">{payload.label}</p>
      ) : null}
    </div>
  );
}

export function WrongShareBubble({
  payload,
  mine,
}: {
  payload: WrongSharePayload;
  mine?: boolean;
}) {
  return (
    <div
      className={`max-w-[85%] rounded-2xl border px-3 py-2.5 ${
        mine ? "border-rose-200 bg-rose-50/80" : "border-mist bg-white/90"
      }`}
    >
      <p className="text-[10px] font-semibold text-rose-600">오답 같이 보기</p>
      <p className="mt-1 font-display text-[12px] font-semibold text-ink">
        {[payload.subject, payload.year && `${payload.year}년`, payload.questionNo && `${payload.questionNo}번`]
          .filter(Boolean)
          .join(" · ") || payload.examId}
      </p>
      <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-[13px] text-smoke">
        {payload.stem}
      </p>
      <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
        {payload.myPick ? (
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-rose-700">
            내 답 {payload.myPick}
          </span>
        ) : null}
        {payload.correctLabel ? (
          <span className="rounded-full bg-[#007AFF]/10 px-2 py-0.5 text-[#0066D6]">
            정답 {payload.correctLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function TimerBubble({
  payload,
  nowMs,
}: {
  payload: TimerPayload;
  nowMs: number;
}) {
  const ends = new Date(payload.endsAt).getTime();
  const left = Math.max(0, Math.floor((ends - nowMs) / 1000));
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const done = left <= 0;
  return (
    <div className="max-w-[85%] rounded-2xl border border-[#007AFF]/25 bg-[#007AFF]/8 px-3 py-2.5">
      <p className="text-[10px] font-semibold text-[#0066D6]">스터디 타이머</p>
      <p className="mt-1 font-display text-lg font-bold tabular-nums text-ink">
        {done ? "끝!" : `${mm}:${ss}`}
      </p>
      <p className="text-[12px] text-smoke">
        {payload.label || `${payload.minutes}분 집중`}
      </p>
    </div>
  );
}

export function PollBubble({
  payload,
  myVote,
  tallies,
  onVote,
  disabled,
}: {
  payload: PollPayload;
  myVote?: string | null;
  tallies: Record<string, number>;
  onVote: (key: string) => void;
  disabled?: boolean;
}) {
  const total = Object.values(tallies).reduce((a, b) => a + b, 0) || 0;
  return (
    <div className="max-w-[90%] min-w-[200px] rounded-2xl border border-mist bg-white/95 px-3 py-2.5">
      <p className="text-[10px] font-semibold text-[#0066D6]">OX 폴</p>
      <p className="mt-1 font-display text-[13px] font-semibold text-ink">
        {payload.question}
      </p>
      <div className="mt-2 space-y-1.5">
        {payload.options.map((opt) => {
          const count = tallies[opt.key] ?? 0;
          const pct = total ? Math.round((count / total) * 100) : 0;
          const selected = myVote === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              disabled={disabled}
              onClick={() => onVote(opt.key)}
              className={`relative w-full overflow-hidden rounded-xl border px-3 py-2 text-left text-[13px] ${
                selected
                  ? "border-[#007AFF] bg-[#007AFF]/10 font-semibold text-[#0066D6]"
                  : "border-mist bg-ice/60 text-ink"
              }`}
            >
              <span
                className="absolute inset-y-0 left-0 bg-[#007AFF]/15"
                style={{ width: `${pct}%` }}
              />
              <span className="relative flex justify-between gap-2">
                <span>{opt.label}</span>
                <span className="tabular-nums text-fog">
                  {count} · {pct}%
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
