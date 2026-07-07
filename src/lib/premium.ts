import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ExamSubject } from "@/lib/exam-questions";

export async function getUnlockedSubjects(userId: string): Promise<Set<ExamSubject>> {
  if (!isSupabaseConfigured()) return new Set();

  const supabase = await createClient();
  const { data } = await supabase
    .from("subject_unlocks")
    .select("subject")
    .eq("user_id", userId);

  return new Set((data ?? []).map((row) => row.subject as ExamSubject));
}

export async function isSubjectUnlocked(
  userId: string,
  subject: ExamSubject
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = await createClient();
  const { data } = await supabase
    .from("subject_unlocks")
    .select("id")
    .eq("user_id", userId)
    .eq("subject", subject)
    .maybeSingle();

  return Boolean(data);
}
