import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getExamYearFromDiary, getKSTDateString } from "@/lib/exam";
import type { CommunityScope, StudyDiary } from "@/types/database";

/** 오늘/어제부터 거슬러 연속으로 일기를 쓴 날수 */
export async function getUserDiaryStreak(
  userId: string,
  scope: CommunityScope = "real_estate",
): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("study_diaries")
    .select("diary_date")
    .eq("author_id", userId)
    .eq("community_scope", scope)
    .order("diary_date", { ascending: false })
    .limit(400);

  if (error || !data || data.length === 0) return 0;

  const dates = new Set(data.map((d) => d.diary_date as string));
  const [y, m, d] = getKSTDateString().split("-").map(Number);
  const cursor = new Date(y, m - 1, d);

  const cursorKey = () =>
    `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(
      cursor.getDate(),
    ).padStart(2, "0")}`;

  let streak = 0;

  // 오늘 일기가 없으면 어제부터 streak을 센다 (오늘 아직 안 썼을 수 있으므로)
  if (!dates.has(cursorKey())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (dates.has(cursorKey())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export type PublicDiary = StudyDiary & {
  examYear: number;
};

export type DiaryYearGroup = {
  examYear: number;
  diaries: PublicDiary[];
};

export async function getTodayDiary(
  userId: string,
  scope: CommunityScope = "real_estate",
): Promise<StudyDiary | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const today = getKSTDateString();

  const { data, error } = await supabase
    .from("study_diaries")
    .select("*")
    .eq("author_id", userId)
    .eq("diary_date", today)
    .eq("community_scope", scope)
    .maybeSingle();

  if (error || !data) return null;
  return data as StudyDiary;
}

/** 특정 D-day에 쓴 모든 공개 일기 (연도 무관, 매년 누적) */
export async function getDiariesByDDay(
  daysUntilExam: number,
  scope: CommunityScope = "real_estate",
): Promise<PublicDiary[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("study_diaries")
    .select("*, profiles(nickname, avatar_url)")
    .eq("days_until_exam", daysUntilExam)
    .eq("community_scope", scope)
    .order("diary_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(200);

  if (error || !data) return [];

  return (data as StudyDiary[]).map((diary) => ({
    ...diary,
    examYear: getExamYearFromDiary(diary.diary_date, diary.days_until_exam),
  }));
}

/** 시험 연도별 그룹 (최신 연도 먼저) */
export function groupDiariesByExamYear(diaries: PublicDiary[]): DiaryYearGroup[] {
  const map = new Map<number, PublicDiary[]>();

  for (const diary of diaries) {
    const list = map.get(diary.examYear) ?? [];
    list.push(diary);
    map.set(diary.examYear, list);
  }

  return [...map.entries()]
    .sort(([a], [b]) => b - a)
    .map(([examYear, items]) => ({ examYear, diaries: items }));
}
