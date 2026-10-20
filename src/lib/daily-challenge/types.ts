import type {
  ExamReferenceEntry,
  ExamQuestionTable,
} from "@/lib/exam-questions";
import type { ExamTrackMaterial, ExamTrackTable } from "@/lib/exam-track/types";
import type { UnderlineRange } from "@/lib/underlined-text";

export type DailyChoice = {
  key: string;
  label: string;
  text: string;
  image?: string;
  translation?: string;
};

export type DailyMode = "ranked" | "practice" | "review";
export type DailyConfidence = "sure" | "unsure" | null;

export type DailyTAccount = {
  title: string;
  debit?: [string, string][];
  credit?: [string, string][];
};

export type DailyQuestionPresentation = {
  promptItems: DailyChoice[];
  notice?: string;
  passage?: string;
  passageText?: string;
  material?: ExamTrackMaterial & { figureFirst?: boolean };
  table?: ExamTrackTable | ExamTrackTable[] | ExamQuestionTable;
  tAccounts?: DailyTAccount[];
  stemTail?: string;
  leadEntries: ExamReferenceEntry[];
  referenceEntries: ExamReferenceEntry[];
  choiceHeaders: string[];
  underlines?: UnderlineRange[];
  keepStemLines?: boolean;
};

export type DailyReviewItem = {
  id: string;
  stem: string;
  presentation: DailyQuestionPresentation;
  sourceLabel: string;
  href: string;
  choices: DailyChoice[];
  correctKeys: string[];
  picked: string;
  pickedLabel: string;
  answerLabel: string;
  explanation: string;
  translation?: string;
  vocab?: DailyVocabEntry[];
  ok: boolean;
  confidence: DailyConfidence;
  category: string;
  subcategory: string;
};

export type DailyLearningReport = {
  participants: number;
  percentile: number | null;
  previousDelta: number | null;
  weakTopic: string | null;
  wrongCount: number;
  uncertainCount: number;
  streak: number;
  monthDone: number;
  dueReviewCount: number;
  achievements: DailyAchievementStats;
  wrongNotebook: DailyWrongSummary;
};

export type DailyScore = {
  attemptId: string | null;
  nickname: string;
  correct: number;
  total: number;
  elapsedMs: number;
  rank: number | null;
  saved: boolean;
  alreadyRanked: boolean;
  message: string | null;
  report: DailyLearningReport;
  review: DailyReviewItem[];
  roundHref: string;
  dateKey: string;
  share: {
    attemptId: string | null;
    nickname: string;
    correct: number;
    total: number;
    elapsedMs: number;
    rank: number | null;
  };
};

export type BoardRow = {
  rank: number;
  nickname: string;
  correct: number;
  total: number;
  elapsedMs: number | null;
  days: number | null;
  mine: boolean;
};

export type DailyCalendarStatus = {
  correct: number;
  total: number;
  needsReview: boolean;
};

export type DailyWeakness = {
  topic: string;
  correct: number;
  total: number;
  accuracy: number;
};

export type DailyAchievementStats = {
  learningDays: number;
  totalAnswered: number;
  uniqueSolved: number;
  poolCount: number;
  perfectDays: number;
  reviewCorrect: number;
  yearsStarted: number;
  yearsCompleted: number;
  totalYears: number;
};

export type DailyWrongSummary = {
  active: number;
  due: number;
  repeated: number;
  recovered: number;
};

export type DailyWrongHistoryPoint = {
  date: string;
  correct: boolean;
  kind?: "attempt" | "graduation";
};

export type DailyChoiceSelectionStat = {
  key: string;
  count: number;
  percent: number;
};

export type DailyWeakPattern = {
  topic: string;
  cue: string;
  summary: string;
  wrongCount: number;
  questionCount: number;
};

export type DailyWrongNotebookItem = {
  id: string;
  year: number;
  sourceLabel: string;
  stem: string;
  presentation: DailyQuestionPresentation;
  choices: DailyChoice[];
  correctKeys: string[];
  explanation: string;
  href: string;
  category: string;
  subcategory: string;
  wrongCount: number;
  attemptCount: number;
  correctAfterWrong: number;
  consecutiveCorrect: number;
  lastWrongDate: string;
  lastAttemptDate: string;
  nextReviewDate: string;
  due: boolean;
  mastered: boolean;
  history: DailyWrongHistoryPoint[];
  note: string;
  pinned: boolean;
  myLastWrongKey: string;
  memoryRule: string;
  choiceStats: {
    total: number;
    choices: DailyChoiceSelectionStat[];
  } | null;
  lawChangeNote: string | null;
  examDate?: string;
  lawVersions?: Record<string, string>;
  graduationQuestion: {
    id: string;
    stem: string;
    sourceLabel: string;
  } | null;
};

export type DailyWrongNotebook = {
  summary: DailyWrongSummary;
  weakPatterns: DailyWeakPattern[];
  items: DailyWrongNotebookItem[];
};

export type DailyInsights = {
  calendar: Record<string, DailyCalendarStatus>;
  streak: number;
  monthDone: number;
  dueReviewCount: number;
  weeklyWeakness: DailyWeakness[];
  achievements: DailyAchievementStats;
  wrongNotebook: DailyWrongSummary;
};

export type DailyComposition = {
  years: number;
  yearSpan: number;
  topics: number;
  latestCount: number;
  poolCount: number;
  rotationDays: number;
  daysFromToday: number;
};

export type DailyCoverage = {
  total: number;
  solved: number;
  remaining: number;
  daysToFinish: number;
  years: { year: number; total: number; solved: number }[];
  questions: {
    id: string;
    year: number;
    sourceLabel: string;
    stem: string;
    href: string;
    solved: boolean;
    lastDate: string | null;
  }[];
};

export type DailyQuestion = {
  id: string;
  subjectId: string;
  stem: string;
  presentation: DailyQuestionPresentation;
  choices: DailyChoice[];
  correctKeys: string[];
  href: string;
  roundHref: string;
  sourceLabel: string;
  explanation: string;
  lawChangeNote: string | null;
  examDate?: string;
  lawVersions?: Record<string, string>;
  year: number;
  category: string;
  subcategory: string;
  /** 공무원 영어 — 지문 해석·어휘(채점 뒤에만 보낸다) */
  translation?: string;
  vocab?: DailyVocabEntry[];
};

export type DailyVocabEntry = import("@/lib/exam-track/types").ExamTrackVocabEntry;

export type DailyQuestionView = Omit<
  DailyQuestion,
  "correctKeys" | "explanation" | "translation" | "vocab"
> & {
  nextDateKey: string | null;
};
