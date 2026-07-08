import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ExamSubject } from "@/lib/exam-questions";
import type { MockExamSession } from "@/types/database";

export async function getMockExamSessions(
  userId: string,
  subject: ExamSubject,
  year: number,
  limit = 10
): Promise<MockExamSession[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("mock_exam_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("subject", subject)
    .eq("year", year)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function saveMockExamSession(input: {
  userId: string;
  subject: ExamSubject;
  year: number;
  total: number;
  correct: number;
  elapsedSeconds: number;
}): Promise<MockExamSession | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mock_exam_sessions")
    .insert({
      user_id: input.userId,
      subject: input.subject,
      year: input.year,
      total: input.total,
      correct: input.correct,
      elapsed_seconds: input.elapsedSeconds,
    })
    .select("*")
    .single();

  if (error) return null;
  return data;
}
