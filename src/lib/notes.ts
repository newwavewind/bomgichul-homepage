import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ExamSubject } from "@/lib/exam-questions";
import type { QuestionNote } from "@/types/database";

export async function getQuestionNote(
  userId: string,
  subject: ExamSubject,
  year: number,
  questionNo: number
): Promise<QuestionNote | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("question_notes")
    .select("*")
    .eq("user_id", userId)
    .eq("subject", subject)
    .eq("year", year)
    .eq("question_no", questionNo)
    .maybeSingle();

  return data ?? null;
}

export async function getNotesForUser(userId: string): Promise<QuestionNote[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("question_notes")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  return data ?? [];
}

export async function getNotesForSubject(
  userId: string,
  subject: ExamSubject
): Promise<QuestionNote[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("question_notes")
    .select("*")
    .eq("user_id", userId)
    .eq("subject", subject)
    .order("updated_at", { ascending: false });

  return data ?? [];
}
