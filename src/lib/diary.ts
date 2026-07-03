import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getKSTDateString } from "@/lib/exam";
import type { StudyDiary } from "@/types/database";

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

export async function getRecentDiaries(
  userId: string,
  limit = 14
): Promise<StudyDiary[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("study_diaries")
    .select("*")
    .eq("author_id", userId)
    .order("diary_date", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as StudyDiary[];
}
