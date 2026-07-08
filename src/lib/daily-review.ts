import {
  filterExamQuestions,
  getExamQuestion,
  shuffleQuestions,
  type ExamQuestion,
  type ExamSubject,
} from "@/lib/exam-questions";
import { getWeakestCategories, type SubjectStudyStats } from "@/lib/study-analytics";
import type { QuestionBookmark, QuestionAttempt } from "@/types/database";

const DAILY_REVIEW_SIZE = 10;

function questionKey(q: Pick<ExamQuestion, "year" | "questionNo">): string {
  return `${q.year}-${q.questionNo}`;
}

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function seededShuffle<T>(input: T[], seed: string): T[] {
  const arr = [...input];
  let state = hashSeed(seed) || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const j = state % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function buildDailyReviewQueue(input: {
  subject: ExamSubject;
  dateKey: string;
  daysUntilExam: number | null;
  wrongAttempts: QuestionAttempt[];
  bookmarks: QuestionBookmark[];
  stats: SubjectStudyStats;
}): ExamQuestion[] {
  const { subject, dateKey, daysUntilExam, wrongAttempts, bookmarks, stats } = input;
  const picked = new Map<string, ExamQuestion>();

  const addQuestion = (q: ExamQuestion | undefined) => {
    if (!q) return;
    const key = questionKey(q);
    if (!picked.has(key)) picked.set(key, q);
  };

  for (const attempt of wrongAttempts) {
    if (picked.size >= 5) break;
    addQuestion(getExamQuestion(subject, attempt.year, attempt.question_no));
  }

  for (const bookmark of bookmarks) {
    if (picked.size >= 8) break;
    addQuestion(getExamQuestion(subject, bookmark.year, bookmark.question_no));
  }

  const weakCategories = getWeakestCategories(stats, 3);
  if (weakCategories.length > 0) {
    const weakPool = filterExamQuestions(subject, { categories: weakCategories });
    for (const q of seededShuffle(weakPool, `${dateKey}-weak`)) {
      if (picked.size >= DAILY_REVIEW_SIZE) break;
      addQuestion(q);
    }
  }

  if (picked.size < DAILY_REVIEW_SIZE) {
    const urgency = daysUntilExam != null && daysUntilExam <= 30 ? "urgent" : "normal";
    const filler = seededShuffle(
      filterExamQuestions(subject, {}),
      `${dateKey}-${urgency}-${subject}`
    );
    for (const q of filler) {
      if (picked.size >= DAILY_REVIEW_SIZE) break;
      addQuestion(q);
    }
  }

  return shuffleQuestions([...picked.values()]).slice(0, DAILY_REVIEW_SIZE);
}
