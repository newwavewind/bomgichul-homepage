import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ExamSubject } from "@/lib/exam-questions";
import type { QuestionBookmark } from "@/types/database";

export async function isQuestionBookmarked(
  userId: string,
  subject: ExamSubject,
  year: number,
  questionNo: number
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = await createClient();
  const { data } = await supabase
    .from("question_bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("subject", subject)
    .eq("year", year)
    .eq("question_no", questionNo)
    .maybeSingle();

  return Boolean(data);
}

export async function getBookmarksForUser(userId: string): Promise<QuestionBookmark[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("question_bookmarks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return data ?? [];
}
