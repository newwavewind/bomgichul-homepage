"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type {
  ExamCardPayload,
  WrongSharePayload,
  TimerPayload,
  PollPayload,
  MockInvitePayload,
  MockResultPayload,
  CheckinPayload,
  ReminderPayload,
  ScheduleSharePayload,
} from "@/lib/chat/features";
import { examHref } from "@/lib/chat/features";

function metaLine(parts: Array<string | number | undefined | null>) {
  return parts.filter(Boolean).join(" · ");
}
function ViewRibbon({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#007AFF]/10 px-2 py-0.5 text-[10px] font-semibold text-[#0066D6]">
      <span aria-hidden>👁</span>
      {count}명 열람
    </p>
  );
}

export function ExamCardBubble({
  payload,
  mine,
  viewCount = 0,
  onRecordView,
}: {
  payload: ExamCardPayload;
  mine?: boolean;
  viewCount?: number;
  onRecordView?: () => void;
}) {
  const href =
    payload.href ||
    examHref(payload.subject, payload.year, payload.questionNo);
  const seenRef = useRef(false);

  useEffect(() => {
    if (seenRef.current || !onRecordView) return;
    seenRef.current = true;
    onRecordView();
  }, [onRecordView]);

  const body = (
    <>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#0066D6]">
        기출 카드
      </p>
      <p className="mt-1 font-display text-[12px] font-semibold text-ink">
        {metaLine([
          payload.subjectLabel || payload.subject,
          payload.year && `${payload.year}년`,
          payload.questionNo && `${payload.questionNo}번`,
        ]) || payload.examId}
      </p>
      <p className="mt-1 line-clamp-4 whitespace-pre-wrap font-display text-[13px] leading-relaxed text-smoke">
        {payload.stem}
      </p>
      {payload.label ? (
        <p className="mt-1.5 text-[11px] text-fog">{payload.label}</p>
      ) : null}
      {href ? (
        <p className="mt-2 text-[11px] font-semibold text-[#0066D6]">
          해설 보기 →
        </p>
      ) : null}
      <ViewRibbon count={viewCount} />
    </>
  );
  const className = `max-w-[85%] rounded-2xl border px-3 py-2.5 transition ${
    mine
      ? "border-[#007AFF]/30 bg-[#007AFF]/10"
      : "border-mist bg-white/90"
  } ${href ? "hover:border-[#007AFF]/50" : ""}`;
  if (href) {
    return (
      <Link
        href={href}
        className={`block ${className}`}
        onClick={() => onRecordView?.()}
      >
        {body}
      </Link>
    );
  }
  return <div className={className}>{body}</div>;
}

export function WrongShareBubble({
  payload,
  mine,
  viewCount = 0,
  onRecordView,
}: {
  payload: WrongSharePayload;
  mine?: boolean;
  viewCount?: number;
  onRecordView?: () => void;
}) {
  const href =
    payload.href ||
    examHref(payload.subject, payload.year, payload.questionNo);
  const items = payload.items?.length ? payload.items : null;
  const seenRef = useRef(false);

  useEffect(() => {
    if (seenRef.current || !onRecordView) return;
    seenRef.current = true;
    onRecordView();
  }, [onRecordView]);

  return (
    <div
      className={`max-w-[90%] rounded-2xl border px-3 py-2.5 ${
        mine ? "border-rose-200 bg-rose-50/80" : "border-mist bg-white/90"
      }`}
    >
      <p className="text-[10px] font-semibold text-rose-600">
        오답 같이 보기{items ? ` · ${items.length}문항` : ""}
      </p>
      {items ? (
        <ul className="mt-2 space-y-2">
          {items.slice(0, 8).map((item) => {
            const itemHref =
              item.href ||
              examHref(item.subject, item.year, item.questionNo);
            const row = (
              <>
                <p className="font-display text-[12px] font-semibold text-ink">
                  {metaLine([
                    item.year && `${item.year}년`,
                    item.questionNo && `${item.questionNo}번`,
                  ])}
                </p>
                <p className="line-clamp-2 text-[12px] text-smoke">{item.stem}</p>
              </>
            );
            return (
              <li key={item.examId} className="rounded-xl bg-white/70 p-2">
                {itemHref ? (
                  <Link
                    href={itemHref}
                    className="block hover:opacity-90"
                    onClick={() => onRecordView?.()}
                  >
                    {row}
                  </Link>
                ) : (
                  row
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <>
          <p className="mt-1 font-display text-[12px] font-semibold text-ink">
            {metaLine([
              payload.subjectLabel || payload.subject,
              payload.year && `${payload.year}년`,
              payload.questionNo && `${payload.questionNo}번`,
            ]) || payload.examId}
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
          {href ? (
            <Link
              href={href}
              className="mt-2 inline-block text-[11px] font-semibold text-[#0066D6]"
              onClick={() => onRecordView?.()}
            >
              해설 보기 →
            </Link>
          ) : null}
        </>
      )}
      <ViewRibbon count={viewCount} />
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
  const done = payload.ended || left <= 0;
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
  nowMs,
}: {
  payload: PollPayload;
  myVote?: string | null;
  tallies: Record<string, number>;
  onVote: (key: string) => void;
  disabled?: boolean;
  nowMs?: number;
}) {
  const total = Object.values(tallies).reduce((a, b) => a + b, 0) || 0;
  const dueMs = payload.dueAt ? new Date(payload.dueAt).getTime() : null;
  const closed =
    payload.closed ||
    (dueMs != null && nowMs != null && dueMs <= nowMs);
  const reveal =
    Boolean(payload.correctKey) &&
    (closed ||
      (payload.revealMode === "on_vote" && Boolean(myVote)) ||
      (payload.isQuiz && closed));
  const leftLabel =
    dueMs && nowMs && !closed
      ? (() => {
          const s = Math.max(0, Math.floor((dueMs - nowMs) / 1000));
          const m = Math.floor(s / 60);
          return m >= 60
            ? `${Math.floor(m / 60)}시간 ${m % 60}분 남음`
            : `${m}분 ${s % 60}초 남음`;
        })()
      : null;

  return (
    <div className="max-w-[90%] min-w-[200px] rounded-2xl border border-mist bg-white/95 px-3 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold text-[#0066D6]">
          {payload.isQuiz || payload.correctKey ? "퀴즈 폴" : "OX 폴"}
        </p>
        {closed ? (
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-white">
            마감
          </span>
        ) : leftLabel ? (
          <span className="text-[10px] text-fog">{leftLabel}</span>
        ) : null}
      </div>
      <p className="mt-1 font-display text-[13px] font-semibold text-ink">
        {payload.question}
      </p>
      <div className="mt-2 space-y-1.5">
        {payload.options.map((opt) => {
          const count = tallies[opt.key] ?? 0;
          const pct = total ? Math.round((count / total) * 100) : 0;
          const selected = myVote === opt.key;
          const isCorrect = reveal && payload.correctKey === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              disabled={disabled || closed}
              onClick={() => onVote(opt.key)}
              className={`relative w-full overflow-hidden rounded-xl border px-3 py-2 text-left text-[13px] ${
                isCorrect
                  ? "border-[#007AFF] bg-[#007AFF]/15 font-semibold text-[#0066D6]"
                  : selected
                    ? "border-[#007AFF] bg-[#007AFF]/10 font-semibold text-[#0066D6]"
                    : "border-mist bg-ice/60 text-ink"
              } ${closed || disabled ? "opacity-90" : ""}`}
            >
              <span
                className="absolute inset-y-0 left-0 bg-[#007AFF]/15"
                style={{ width: `${pct}%` }}
              />
              <span className="relative flex justify-between gap-2">
                <span>
                  {opt.label}
                  {isCorrect ? (
                    <span className="ml-1.5 rounded-full bg-[#007AFF] px-1.5 py-0.5 text-[9px] font-bold text-white">
                      정답
                    </span>
                  ) : null}
                </span>
                <span className="tabular-nums text-fog">
                  {count} · {pct}%
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {closed && total > 0 ? (
        <p className="mt-2 text-[11px] text-fog">총 {total}표</p>
      ) : null}
      {reveal && payload.correctKey ? (
        <p className="mt-1.5 text-[11px] font-semibold text-[#0066D6]">
          정답 · {payload.correctKey}
        </p>
      ) : null}
    </div>
  );
}

export function MockInviteBubble({
  payload,
  mine,
  onOpenMini,
}: {
  payload: MockInvitePayload;
  mine?: boolean;
  onOpenMini?: () => void;
}) {
  return (
    <div
      className={`max-w-[85%] rounded-2xl border px-3 py-2.5 ${
        mine
          ? "border-[#007AFF]/30 bg-[#007AFF]/10"
          : "border-mist bg-white/90"
      }`}
    >
      <p className="text-[10px] font-semibold text-[#0066D6]">모의고사 같이 풀기</p>
      <p className="mt-1 font-display text-[13px] font-semibold text-ink">
        {payload.label ||
          `${payload.subjectLabel || payload.subject} ${payload.year}년`}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {onOpenMini ? (
          <button
            type="button"
            onClick={onOpenMini}
            className="rounded-full bg-[#007AFF] px-3 py-1 text-[11px] font-semibold text-white"
          >
            채팅에서 열기
          </button>
        ) : null}
        <Link
          href={payload.href}
          className="rounded-full border border-[#007AFF]/30 px-3 py-1 text-[11px] font-semibold text-[#0066D6]"
        >
          전체 화면 →
        </Link>
      </div>
    </div>
  );
}

export function MockResultBubble({
  payload,
  mine,
}: {
  payload: MockResultPayload;
  mine?: boolean;
}) {
  const pct =
    payload.total > 0 ? Math.round((payload.correct / payload.total) * 100) : 0;
  const elapsed =
    payload.elapsedSec != null
      ? `${Math.floor(payload.elapsedSec / 60)}분 ${payload.elapsedSec % 60}초`
      : null;
  return (
    <div
      className={`max-w-[85%] rounded-2xl border px-3 py-2.5 ${
        mine
          ? "border-[#007AFF]/30 bg-[#007AFF]/10"
          : "border-mist bg-white/90"
      }`}
    >
      <p className="text-[10px] font-semibold text-[#0066D6]">모의고사 결과</p>
      <p className="mt-1 font-display text-[13px] font-semibold text-ink">
        {payload.subjectLabel || payload.subject} {payload.year}년
      </p>
      <p className="mt-1 text-[20px] font-bold tabular-nums text-[#0066D6]">
        {payload.correct}/{payload.total}
        <span className="ml-1 text-[13px] font-semibold text-smoke">({pct}%)</span>
      </p>
      {elapsed ? <p className="mt-0.5 text-[11px] text-fog">소요 {elapsed}</p> : null}
      {payload.href ? (
        <Link
          href={payload.href}
          className="mt-2 inline-block text-[11px] font-semibold text-[#0066D6]"
        >
          다시 풀기 →
        </Link>
      ) : null}
    </div>
  );
}

export function SpoilerChip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className={`mx-0.5 inline rounded px-1.5 py-0.5 align-baseline text-[12px] font-medium transition ${
        open
          ? "bg-[#007AFF]/10 text-ink"
          : "bg-slate-800 text-transparent select-none"
      }`}
      title={open ? "가리기" : "탭해서 보기"}
      aria-label={open ? "스포일러 가리기" : "스포일러 보기"}
    >
      {open ? text : "████"}
    </button>
  );
}

export function CheckinBubble({
  payload,
  content,
  mine,
}: {
  payload: CheckinPayload;
  content: string;
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
      <p className="text-[10px] font-semibold text-[#0066D6]">학습 인증</p>
      <p className="mt-1 font-display text-[13px] text-ink">{content}</p>
      {payload.streak ? (
        <p className="mt-1.5 text-[11px] font-semibold text-[#0066D6]">
          🔥 {payload.streak}일 연속
        </p>
      ) : null}
    </div>
  );
}

export function SystemBubble({
  content,
  payload,
}: {
  content: string;
  payload?: Record<string, unknown> | null;
}) {
  const kind = payload?.kind;
  if (kind === "weekly" || kind === "dday" || kind === "goal" || payload?.reminderKey) {
    return (
      <ReminderBubble
        payload={{
          kind: (kind === "dday" || kind === "goal" ? kind : "weekly") as
            | "dday"
            | "weekly"
            | "goal",
          title: content.replace(/^📅\s*/, "").replace(/^⏰\s*/, ""),
          body: typeof payload?.body === "string" ? payload.body : undefined,
          dday: typeof payload?.dday === "string" ? payload.dday : null,
          reminderKey:
            typeof payload?.reminderKey === "string" ? payload.reminderKey : undefined,
        }}
      />
    );
  }
  return (
    <div className="mx-auto max-w-[92%] rounded-full bg-slate-100/90 px-3 py-1.5 text-center text-[11px] text-smoke">
      {content}
    </div>
  );
}

export function ReminderBubble({ payload }: { payload: ReminderPayload }) {
  const tone =
    payload.kind === "dday"
      ? "border-[#007AFF]/30 bg-[#007AFF]/10"
      : payload.kind === "goal"
        ? "border-amber-200 bg-amber-50"
        : "border-mist bg-white/90";
  const eyebrow =
    payload.kind === "dday" ? "D-DAY 알림" : payload.kind === "goal" ? "목표 리마인더" : "주간 리마인더";
  return (
    <div className={`mx-auto w-full max-w-[92%] rounded-2xl border px-3 py-2.5 ${tone}`}>
      <p className="text-[10px] font-semibold text-[#0066D6]">{eyebrow}</p>
      <p className="mt-1 font-display text-[13px] font-semibold text-ink">{payload.title}</p>
      {payload.body ? (
        <p className="mt-1 text-[12px] text-smoke">{payload.body}</p>
      ) : null}
      {payload.dday ? (
        <p className="mt-1.5 text-[11px] font-semibold text-[#0066D6]">시험일 {payload.dday}</p>
      ) : null}
    </div>
  );
}

export function ScheduleShareBubble({
  payload,
  mine,
}: {
  payload: ScheduleSharePayload;
  mine?: boolean;
}) {
  const due = new Date(payload.dueAt);
  const when = Number.isNaN(due.getTime())
    ? payload.dueAt
    : new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        dateStyle: "medium",
        timeStyle: "short",
      }).format(due);
  return (
    <div
      className={`max-w-[85%] rounded-2xl border px-3 py-2.5 ${
        mine ? "border-[#007AFF]/30 bg-[#007AFF]/10" : "border-mist bg-white/90"
      }`}
    >
      <p className="text-[10px] font-semibold text-[#0066D6]">스터디 일정</p>
      <p className="mt-1 font-display text-[13px] font-semibold text-ink">{payload.title}</p>
      <p className="mt-1 text-[12px] text-smoke">{when}</p>
      {payload.place ? (
        <p className="mt-1 text-[11px] text-fog">장소 · {payload.place}</p>
      ) : null}
      {payload.note ? (
        <p className="mt-1 line-clamp-2 text-[12px] text-smoke">{payload.note}</p>
      ) : null}
    </div>
  );
}
