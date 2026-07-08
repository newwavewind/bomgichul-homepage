import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getExamQuestion, type ExamSubject } from "@/lib/exam-questions";
import type { QuestionAttempt } from "@/types/database";

export interface CategoryStat {
  category: string;
  correct: number;
  wrong: number;
  total: number;
  accuracy: number;
}

export interface YearStat {
  year: number;
  correct: number;
  wrong: number;
  total: number;
  accuracy: number;
}

export interface SubjectStudyStats {
  subject: ExamSubject;
  categories: CategoryStat[];
  years: YearStat[];
  totalAttempts: number;
}

export async function getAttemptsForSubject(
  userId: string,
  subject: ExamSubject
): Promise<QuestionAttempt[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("question_attempts")
    .select("*")
    .eq("user_id", userId)
    .eq("subject", subject)
    .order("updated_at", { ascending: false });

  return data ?? [];
}

export function buildSubjectStudyStats(
  subject: ExamSubject,
  attempts: QuestionAttempt[]
): SubjectStudyStats {
  const categoryMap = new Map<string, { correct: number; wrong: number }>();
  const yearMap = new Map<number, { correct: number; wrong: number }>();

  for (const attempt of attempts) {
    const question = getExamQuestion(subject, attempt.year, attempt.question_no);
    if (!question) continue;

    const cat = question.category || "미분류";
    const catEntry = categoryMap.get(cat) ?? { correct: 0, wrong: 0 };
    if (attempt.result === "correct") catEntry.correct += 1;
    else catEntry.wrong += 1;
    categoryMap.set(cat, catEntry);

    const yearEntry = yearMap.get(attempt.year) ?? { correct: 0, wrong: 0 };
    if (attempt.result === "correct") yearEntry.correct += 1;
    else yearEntry.wrong += 1;
    yearMap.set(attempt.year, yearEntry);
  }

  const categories: CategoryStat[] = [...categoryMap.entries()]
    .map(([category, { correct, wrong }]) => {
      const total = correct + wrong;
      return {
        category,
        correct,
        wrong,
        total,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      };
    })
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total);

  const years: YearStat[] = [...yearMap.entries()]
    .map(([year, { correct, wrong }]) => {
      const total = correct + wrong;
      return {
        year,
        correct,
        wrong,
        total,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      };
    })
    .sort((a, b) => a.year - b.year);

  return {
    subject,
    categories,
    years,
    totalAttempts: attempts.length,
  };
}

export function getWeakestCategories(stats: SubjectStudyStats, limit = 3): string[] {
  return stats.categories
    .filter((c) => c.total >= 2)
    .slice(0, limit)
    .map((c) => c.category);
}
