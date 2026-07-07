import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { PRODUCT_TYPE_BY_SUBJECT, subjectFromProductType } from "@/lib/premium-subjects";
import type { ExamSubject } from "@/lib/exam-questions";

export async function getUnlockedSubjects(userId: string): Promise<Set<ExamSubject>> {
  if (!isSupabaseConfigured()) return new Set();

  const supabase = await createClient();
  const { data } = await supabase
    .from("user_entitlements")
    .select("product_type, expires_at")
    .eq("user_id", userId)
    .eq("status", "active");

  const now = Date.now();
  const subjects = new Set<ExamSubject>();
  for (const row of data ?? []) {
    if (row.expires_at && new Date(row.expires_at).getTime() <= now) continue;
    const subject = subjectFromProductType(row.product_type);
    if (subject) subjects.add(subject);
  }
  return subjects;
}

export async function isSubjectUnlocked(
  userId: string,
  subject: ExamSubject
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const productType = PRODUCT_TYPE_BY_SUBJECT[subject];
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_entitlements")
    .select("expires_at")
    .eq("user_id", userId)
    .eq("product_type", productType)
    .eq("status", "active");

  const now = Date.now();
  return (data ?? []).some((row) => !row.expires_at || new Date(row.expires_at).getTime() > now);
}
