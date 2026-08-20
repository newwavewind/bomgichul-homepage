import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { ARCHIVE_SUBJECT_MAP } from "@/lib/constants";

export type PersonalHomeData = {
  attemptCount: number;
  wrongCount: number;
  bookmarkCount: number;
  accuracy: number;
  streak: number;
  recent: null | { label: string; href: string; updatedAt: string };
};

const BASE_PATHS: Record<string, string> = {
  public_service: "/public-service",
  police: "/police",
  housing: "/housing",
  social_worker: "/social-worker",
  history: "/history",
  english: "/english",
};

const SCOPE_LABELS: Record<string, string> = {
  public_service: "공무원",
  police: "경찰공무원",
  housing: "주택관리사",
  social_worker: "사회복지사 1급",
  history: "한국사능력검정",
  english: "공무원 영어",
};

function kstDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function previousDate(date: string) {
  const value = new Date(`${date}T12:00:00+09:00`);
  value.setUTCDate(value.getUTCDate() - 1);
  return kstDate(value);
}

export function calculateStudyStreak(loginDates: string[], today = kstDate()) {
  const dates = new Set(loginDates);
  let cursor = dates.has(today) ? today : previousDate(today);
  let streak = 0;
  while (dates.has(cursor)) {
    streak += 1;
    cursor = previousDate(cursor);
  }
  return streak;
}

export function resolveAttemptDestination(subject: string, year: number, questionNo: number) {
  const [scope, subjectId, sourceCode] = subject.split(":");
  if (BASE_PATHS[scope] && subjectId && sourceCode) {
    return {
      label: `${SCOPE_LABELS[scope]} · ${ARCHIVE_SUBJECT_MAP[subjectId] ?? subjectId} ${year}년 ${questionNo}번`,
      href: `${BASE_PATHS[scope]}/exam/${subjectId}/${year}/${encodeURIComponent(sourceCode)}/${questionNo}`,
    };
  }
  return {
    label: `공인중개사 · ${ARCHIVE_SUBJECT_MAP[subject] ?? subject} ${year}년 ${questionNo}번`,
    href: `/exam/${subject}/${year}/${questionNo}`,
  };
}

export async function getPersonalHomeData(userId: string): Promise<PersonalHomeData> {
  const empty: PersonalHomeData = { attemptCount: 0, wrongCount: 0, bookmarkCount: 0, accuracy: 0, streak: 0, recent: null };
  if (!isSupabaseConfigured()) return empty;
  const supabase = await createClient();
  const [attempts, wrong, bookmarks, dates] = await Promise.all([
    supabase.from("question_attempts").select("subject,year,question_no,result,updated_at", { count: "exact" }).eq("user_id", userId).order("updated_at", { ascending: false }).limit(1),
    supabase.from("question_attempts").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("result", "wrong"),
    supabase.from("question_bookmarks").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("user_daily_logins").select("login_date").eq("user_id", userId).order("login_date", { ascending: false }).limit(400),
  ]);
  const attemptCount = attempts.count ?? 0;
  const wrongCount = wrong.count ?? 0;
  const row = attempts.data?.[0];
  const destination = row ? resolveAttemptDestination(row.subject, row.year, row.question_no) : null;
  return {
    attemptCount,
    wrongCount,
    bookmarkCount: bookmarks.count ?? 0,
    accuracy: attemptCount ? Math.round(((attemptCount - wrongCount) / attemptCount) * 100) : 0,
    streak: calculateStudyStreak((dates.data ?? []).map((item) => item.login_date)),
    recent: row && destination ? { ...destination, updatedAt: row.updated_at } : null,
  };
}
