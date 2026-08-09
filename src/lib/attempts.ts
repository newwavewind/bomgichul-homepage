import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getExamQuestion, type ExamSubject, type ExamQuestion } from "@/lib/exam-questions";
import type { AttemptResult } from "@/types/database";

export async function getAttemptResult(
  userId: string,
  subject: string,
  year: number,
  questionNo: number
): Promise<AttemptResult | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("question_attempts")
    .select("result")
    .eq("user_id", userId)
    .eq("subject", subject)
    .eq("year", year)
    .eq("question_no", questionNo)
    .maybeSingle();

  return (data?.result as AttemptResult | undefined) ?? null;
}

export async function getWrongQuestionsForUser(userId: string): Promise<ExamQuestion[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("question_attempts")
    .select("subject, year, question_no")
    .eq("user_id", userId)
    .eq("result", "wrong")
    .order("updated_at", { ascending: false });

  if (!data) return [];

  return data
    .map((a) => getExamQuestion(a.subject as ExamSubject, a.year, a.question_no))
    .filter((q): q is ExamQuestion => Boolean(q));
}

export async function getWrongQuestionsForSubject(
  userId: string,
  subject: ExamSubject
): Promise<ExamQuestion[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("question_attempts")
    .select("subject, year, question_no")
    .eq("user_id", userId)
    .eq("subject", subject)
    .eq("result", "wrong")
    .order("updated_at", { ascending: false });

  if (!data) return [];

  return data
    .map((a) => getExamQuestion(subject, a.year, a.question_no))
    .filter((q): q is ExamQuestion => Boolean(q));
}

export async function getWrongAttemptsForSubject(userId: string, subject: ExamSubject) {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("question_attempts")
    .select("*")
    .eq("user_id", userId)
    .eq("subject", subject)
    .eq("result", "wrong")
    .order("updated_at", { ascending: false });

  return data ?? [];
}
