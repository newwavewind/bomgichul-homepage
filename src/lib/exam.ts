import { BROKER_EXAM_SCHEDULE } from "@/lib/constants";

const KST = "Asia/Seoul";

/** KST 기준 YYYY-MM-DD */
export function getKSTDateString(date = new Date()): string {
  return date.toLocaleDateString("en-CA", { timeZone: KST });
}

function parseDateOnly(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** 시험일까지 남은 일수 (시험 당일 = 0, 이후 = 음수) */
export function getDaysUntilExam(examDate: string, fromDate = getKSTDateString()): number {
  const exam = parseDateOnly(examDate);
  const today = parseDateOnly(fromDate);
  const diffMs = exam.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function formatDDay(days: number): string {
  if (days > 0) return `D-${days}`;
  if (days === 0) return "D-Day";
  return `D+${Math.abs(days)}`;
}

export function formatKoreanDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[new Date(y, m - 1, d).getDay()];
  return `${y}년 ${m}월 ${d}일 (${weekday})`;
}

export function getNextBrokerExam(fromDate = getKSTDateString()) {
  const upcoming = BROKER_EXAM_SCHEDULE.filter((exam) => exam.examDate >= fromDate);
  if (upcoming.length > 0) return upcoming[0];
  return BROKER_EXAM_SCHEDULE[BROKER_EXAM_SCHEDULE.length - 1];
}

export function getExamCountdown(fromDate = getKSTDateString()) {
  const exam = getNextBrokerExam(fromDate);
  const days = getDaysUntilExam(exam.examDate, fromDate);
  return {
    exam,
    days,
    label: formatDDay(days),
    formattedDate: formatKoreanDate(exam.examDate),
  };
}
