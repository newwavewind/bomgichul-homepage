import { trackWebFunnel } from "@/lib/web-funnel";
/** Website-only records. Account scoped; never changes the mobile apps' storage. */
export type WrongReason = "개념 부족" | "선지 혼동" | "실수" | "시간 부족";
export type StudyEntry = {
  id: string;
  href: string;
  title: string;
  scope: string;
  day: string;
  result: "correct" | "wrong" | "read";
  reason?: WrongReason;
  note?: string;
  review?: boolean;
  answerSummary?: string;
  wrongCount?: number;
};
export type StudyPlan = {
  scope: string;
  deadline: string;
  minutes: number;
  total: number;
  started: string;
};
export type WebStudy = { entries: StudyEntry[]; plan?: StudyPlan };
export const EXAM_CHOICES = [
  ["real-estate", "공인중개사", "전문자격"],
  ["public-service", "공무원", "공무원"],
  ["police", "경찰공무원", "공무원"],
  ["firefighter", "소방공무원", "공무원"],
  ["housing", "주택관리사", "전문자격"],
  ["social-worker", "사회복지사 1급", "전문자격"],
  ["english", "공무원 영어", "어학·한국사"],
  ["history", "한국사능력검정", "어학·한국사"],
  ["gugeo", "공무원 국어", "공무원"],
  ["haengjeongsa", "행정사", "전문자격"],
  ["semusa", "세무사", "전문자격"],
  ["sanan", "산업안전지도사", "전문자격"],
  ["sonhae", "손해평가사", "전문자격"],
  ["nomusa", "공인노무사", "전문자격"],
] as const;
export function scopeForPath(path: string) {
  return (
    EXAM_CHOICES.find(
      ([id]) => path === `/${id}` || path.startsWith(`/${id}/`),
    )?.[0] ?? "real-estate"
  );
}
export function studyDay(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(
    date,
  );
}
export function readWebStudy(actor: string): WebStudy {
  try {
    const value = JSON.parse(
      localStorage.getItem(`bom:web-study:v1:${actor}`) || "{}",
    );
    if (!value || typeof value !== "object") return { entries: [] };
    const plan = value.plan;
    const validPlan =
      plan &&
      EXAM_CHOICES.some(([id]) => id === plan.scope) &&
      /^\d{4}-\d{2}-\d{2}$/.test(plan.deadline) &&
      /^\d{4}-\d{2}-\d{2}$/.test(plan.started) &&
      Number.isFinite(Date.parse(plan.deadline)) &&
      Number.isInteger(plan.total) &&
      plan.total > 0 &&
      Number.isInteger(plan.minutes) &&
      plan.minutes >= 5;
    return {
      ...(validPlan ? { plan } : {}),
      entries: Array.isArray(value.entries)
        ? value.entries.filter(
            (e: StudyEntry) =>
              e &&
              typeof e.id === "string" &&
              typeof e.title === "string" &&
              typeof e.scope === "string" &&
              typeof e.href === "string" &&
              e.href.startsWith("/") &&
              !e.href.startsWith("//") &&
              !e.href.includes("\\") &&
              /^\d{4}-\d{2}-\d{2}$/.test(e.day) &&
              ["correct", "wrong", "read"].includes(e.result),
          )
        : [],
    };
  } catch {
    return { entries: [] };
  }
}
export function saveWebStudy(actor: string, data: WebStudy) {
  try {
    localStorage.setItem(`bom:web-study:v1:${actor}`, JSON.stringify(data));
    window.dispatchEvent(new Event("bom:web-study"));
    return true;
  } catch {
    return false;
  }
}
export function recordWebStudy(actor: string, entry: Omit<StudyEntry, "day">) {
  const data = readWebStudy(actor);
  const day = studyDay();
  const index = data.entries.findIndex(
    (e) => e.id === entry.id && e.day === day,
  );
  const previous = data.entries[index];
  const last = data.entries.findLast((e) => e.id === entry.id);
  const next = {
    ...previous,
    ...entry,
    day,
    note: entry.note ?? last?.note,
    wrongCount:
      (last?.wrongCount ?? (last?.result === "wrong" ? 1 : 0)) +
      (entry.result === "wrong" ? 1 : 0),
    review: Boolean(previous || data.entries.some((e) => e.id === entry.id)),
  };
  if (index < 0) data.entries.push(next);
  else data.entries[index] = next;
  const saved = saveWebStudy(actor, data);
  if (saved && next.review)
    trackWebFunnel("web_review_completed", {
      scope: entry.scope,
      result: entry.result,
    });
  return saved;
}
export function studyStreak(entries: StudyEntry[], today = studyDay()) {
  const days = new Set(entries.map((e) => e.day));
  let cursor = today;
  let count = 0;
  const previous = (day: string) =>
    studyDay(new Date(new Date(`${day}T12:00:00+09:00`).getTime() - 86400000));
  if (!days.has(cursor)) cursor = previous(cursor);
  while (days.has(cursor)) {
    count++;
    cursor = previous(cursor);
  }
  return count;
}
export function weeklyReport(entries: StudyEntry[], today = studyDay()) {
  const end = new Date(`${today}T12:00:00+09:00`).getTime();
  const current = entries.filter((e) => {
    const days =
      (end - new Date(`${e.day}T12:00:00+09:00`).getTime()) / 86400000;
    return days >= 0 && days < 7;
  });
  const previous = entries.filter((e) => {
    const days =
      (end - new Date(`${e.day}T12:00:00+09:00`).getTime()) / 86400000;
    return days >= 7 && days < 14;
  });
  const accuracy = (rows: StudyEntry[]) => {
    const questions = rows.filter((e) => e.result !== "read");
    return questions.length
      ? Math.round(
          (questions.filter((e) => e.result === "correct").length /
            questions.length) *
            100,
        )
      : null;
  };
  const reasons = current
    .filter((e) => e.result === "wrong" && e.reason)
    .reduce<
      Record<string, number>
    >((r, e) => ({ ...r, [e.reason!]: (r[e.reason!] || 0) + 1 }), {});
  return {
    current,
    previous,
    accuracy: accuracy(current),
    previousAccuracy: accuracy(previous),
    reasons,
    days: new Set(current.map((e) => e.day)).size,
  };
}
export function calculatePlan(
  plan: StudyPlan,
  entries: StudyEntry[],
  today = studyDay(),
) {
  const days = Math.max(
    0,
    Math.floor(
      (new Date(`${plan.deadline}T12:00:00+09:00`).getTime() -
        new Date(`${today}T12:00:00+09:00`).getTime()) /
        86400000,
    ) + 1,
  );
  const done = new Set(
    entries
      .filter(
        (e) =>
          e.scope === plan.scope &&
          e.day >= plan.started &&
          e.result !== "read",
      )
      .map((e) => e.id),
  ).size;
  const remaining = Math.max(0, plan.total - done);
  const daily = days > 0 ? Math.ceil(remaining / days) : remaining;
  return {
    days,
    done,
    remaining,
    daily,
    estimatedMinutes: daily * 2,
    overloaded: daily * 2 > plan.minutes,
  };
}
export function latestWrong(entries: StudyEntry[]) {
  const latest = new Map<string, StudyEntry>();
  for (const entry of entries) latest.set(entry.id, entry);
  return [...latest.values()]
    .filter((e) => e.result === "wrong")
    .sort(
      (a, b) =>
        (b.wrongCount ?? 1) - (a.wrongCount ?? 1) || b.day.localeCompare(a.day),
    );
}
export function selectedExam() {
  try {
    const value = localStorage.getItem("bom:selected-exam");
    return EXAM_CHOICES.some(([id]) => id === value) ? value : null;
  } catch {
    return null;
  }
}
export function selectExam(id: string) {
  if (!EXAM_CHOICES.some(([key]) => id === key)) return;
  try {
    localStorage.setItem("bom:selected-exam", id);
    window.dispatchEvent(new Event("bom:exam"));
  } catch {}
}
