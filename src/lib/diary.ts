import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getExamYearFromDiary, getKSTDateString } from "@/lib/exam";
import type { StudyDiary } from "@/types/database";

export type PublicDiary = StudyDiary & {
  examYear: number;
};

export type DiaryYearGroup = {
  examYear: number;
  diaries: PublicDiary[];
};

export async function getTodayDiary(userId: string): Promise<StudyDiary | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const today = getKSTDateString();

  const { data, error } = await supabase
    .from("study_diaries")
    .select("*")
    .eq("author_id", userId)
    .eq("diary_date", today)
    .maybeSingle();

  if (error || !data) return null;
  return data as StudyDiary;
}

/** 특정 D-day에 쓴 모든 공개 일기 (연도 무관, 매년 누적) */
export async function getDiariesByDDay(
  daysUntilExam: number
): Promise<PublicDiary[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("study_diaries")
    .select("*, profiles(nickname, avatar_url)")
    .eq("days_until_exam", daysUntilExam)
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
