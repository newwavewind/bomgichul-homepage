import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getKSTDateString } from "@/lib/exam";

export async function hasCompletedTodayQuiz(userId: string, dateKey: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = await createClient();
  const { data } = await supabase
    .from("daily_quiz_results")
    .select("id")
    .eq("user_id", userId)
    .eq("quiz_date", dateKey)
    .maybeSingle();

  return Boolean(data);
}

/** 오늘/어제부터 거슬러 연속으로 일일 OX 퀴즈를 완료한 날수 */
export async function getUserQuizStreak(userId: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("daily_quiz_results")
    .select("quiz_date")
    .eq("user_id", userId)
    .order("quiz_date", { ascending: false })
    .limit(400);

  if (error || !data || data.length === 0) return 0;

  const dates = new Set(data.map((d) => d.quiz_date as string));
  const [y, m, d] = getKSTDateString().split("-").map(Number);
  const cursor = new Date(y, m - 1, d);

  const cursorKey = () =>
    `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(
      cursor.getDate()
    ).padStart(2, "0")}`;

  let streak = 0;

  if (!dates.has(cursorKey())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (dates.has(cursorKey())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
