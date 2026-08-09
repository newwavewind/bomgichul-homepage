import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getExamQuestion, type ExamSubject, type ExamQuestion } from "@/lib/exam-questions";
import type { QuestionBookmark } from "@/types/database";

export async function isQuestionBookmarked(
  userId: string,
  subject: string,
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

export async function getBookmarkedQuestionsForSubject(
  userId: string,
  subject: ExamSubject
): Promise<ExamQuestion[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("question_bookmarks")
    .select("year, question_no")
    .eq("user_id", userId)
    .eq("subject", subject)
    .order("created_at", { ascending: false });

  if (!data) return [];

  return data
    .map((b) => getExamQuestion(subject, b.year, b.question_no))
    .filter((q): q is ExamQuestion => Boolean(q));
}
