import {
  isInvalidElapsed,
  LONG_ELAPSED_THRESHOLD_MS,
} from "@/lib/daily-challenge/timing";

export function formatElapsed(ms: number) {
  if (isInvalidElapsed(ms)) return "시간 확인 불가";
  if (ms >= LONG_ELAPSED_THRESHOLD_MS) return "30분 이상";
  const seconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}분 ${String(rest).padStart(2, "0")}초`;
}

export function formatKoreanDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-");
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}
