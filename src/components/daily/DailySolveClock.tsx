"use client";

import { useEffect, useState } from "react";

function formatSolveClock(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}

/** 멈추지 않는 풀이 시계. 시작 시각은 서버가 찍어 둔 값이고, 화면은 그 시각과의 차이만 보여 준다. */
export function DailySolveClock({
  startedAt,
  serverNow,
}: {
  startedAt: number | null;
  serverNow: number | null;
}) {
  const running = startedAt != null && serverNow != null;
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running || startedAt == null || serverNow == null) {
      setElapsed(0);
      return;
    }
    const skew = serverNow - Date.now();
    const tick = () => setElapsed(Math.max(0, Date.now() + skew - startedAt));
    tick();
    const id = window.setInterval(tick, 200);
    return () => window.clearInterval(id);
  }, [running, startedAt, serverNow]);

  return (
    <div
      className={`daily-solve-clock${running ? " is-running" : ""}`}
      aria-label={
        running
          ? `경과 시간 ${formatSolveClock(elapsed)}`
          : "지문을 누르면 시간이 시작됩니다"
      }
    >
      <style>{CLOCK_CSS}</style>
      <span className="daily-solve-clock__mark" aria-hidden="true">
        <span className="daily-solve-clock__pulse" />
      </span>
      <span className="daily-solve-clock__time">{formatSolveClock(elapsed)}</span>
    </div>
  );
}

const CLOCK_CSS = `
.daily-solve-clock {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 2.125rem;
  padding: 0 0.7rem 0 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.34);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.72) 0%, rgba(248, 250, 252, 0.52) 100%);
  box-shadow: inset 0 0.5px 0 rgba(255, 255, 255, 0.9), 0 1px 2px rgba(15, 23, 42, 0.05), 0 6px 16px -8px rgba(15, 23, 42, 0.18);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  backdrop-filter: blur(20px) saturate(150%);
  user-select: none;
}
.daily-solve-clock__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0.9rem;
  height: 0.9rem;
  flex-shrink: 0;
}
.daily-solve-clock__pulse {
  position: relative;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 999px;
  background: #cbd5e1;
}
.daily-solve-clock.is-running .daily-solve-clock__pulse { background: #f43f5e; }
.daily-solve-clock.is-running .daily-solve-clock__pulse::after {
  content: "";
  position: absolute;
  inset: -0.22rem;
  border-radius: 999px;
  background: rgba(244, 63, 94, 0.28);
  animation: daily-solve-clock-breath 2.4s ease-in-out infinite;
}
@keyframes daily-solve-clock-breath {
  0%, 100% { transform: scale(0.55); opacity: 0; }
  45% { transform: scale(1); opacity: 1; }
}
.daily-solve-clock__time {
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.01em;
  font-variant-numeric: tabular-nums;
  color: rgb(100 116 139);
}
.daily-solve-clock.is-running .daily-solve-clock__time { color: rgb(30 41 59); }
@media (prefers-reduced-motion: reduce) {
  .daily-solve-clock.is-running .daily-solve-clock__pulse::after {
    animation: none;
    opacity: 0.5;
    transform: scale(0.8);
  }
}
`;
