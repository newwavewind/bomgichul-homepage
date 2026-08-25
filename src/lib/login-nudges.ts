/**
 * 비로그인 학습 유도용 로컬 상태.
 * 진도·리마인드는 기기(localStorage)에만 두고, 로그인 시 서버 기록으로 이어지게 유도한다.
 */

const ATTEMPT_KEY = "bom_anon_attempts_v1";
const ATTEMPT_DISMISS_KEY = "bom_anon_progress_nudge_dismissed_v1";
const REMINDERS_KEY = "bom_exam_reminders_v1";

/** 이 횟수부터 「진도 저장」 유도를 보여 준다 */
export const ANON_PROGRESS_NUDGE_AT = 4;

export type ExamReminder = {
  eventId: string;
  examKey: string;
  examLabel: string;
  title: string;
  date: string;
  href: string;
  createdAt: string;
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode */
  }
}

export function getAnonAttemptCount(): number {
  const n = readJson<number>(ATTEMPT_KEY, 0);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

/** @returns 갱신된 횟수 */
export function bumpAnonAttemptCount(): number {
  const next = getAnonAttemptCount() + 1;
  writeJson(ATTEMPT_KEY, next);
  return next;
}

export function isProgressNudgeDismissed(): boolean {
  return readJson<boolean>(ATTEMPT_DISMISS_KEY, false) === true;
}

export function dismissProgressNudge() {
  writeJson(ATTEMPT_DISMISS_KEY, true);
}

export function shouldShowProgressNudge(loggedIn: boolean): boolean {
  if (loggedIn) return false;
  if (isProgressNudgeDismissed()) return false;
  return getAnonAttemptCount() >= ANON_PROGRESS_NUDGE_AT;
}

export function listExamReminders(): ExamReminder[] {
  const rows = readJson<ExamReminder[]>(REMINDERS_KEY, []);
  if (!Array.isArray(rows)) return [];
  return rows
    .filter((r) => r && typeof r.eventId === "string" && typeof r.date === "string")
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

export function hasExamReminder(eventId: string): boolean {
  return listExamReminders().some((r) => r.eventId === eventId);
}

export function addExamReminder(reminder: Omit<ExamReminder, "createdAt">): ExamReminder[] {
  const existing = listExamReminders().filter((r) => r.eventId !== reminder.eventId);
  const next = [
    ...existing,
    { ...reminder, createdAt: new Date().toISOString() },
  ].sort((a, b) => (a.date < b.date ? -1 : 1));
  writeJson(REMINDERS_KEY, next);
  return next;
}

export function removeExamReminder(eventId: string): ExamReminder[] {
  const next = listExamReminders().filter((r) => r.eventId !== eventId);
  writeJson(REMINDERS_KEY, next);
  return next;
}

/** 오늘(KST YYYY-MM-DD) 기준 앞으로 남은 리마인드 */
export function upcomingExamReminders(todayIso: string, withinDays = 60): ExamReminder[] {
  const limit = (() => {
    const [y, m, d] = todayIso.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d + withinDays));
    return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
  })();
  return listExamReminders().filter((r) => r.date >= todayIso && r.date <= limit);
}
