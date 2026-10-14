export type DailyChoice = { key: string; label: string; text: string };

export type DailyReviewItem = {
  id: string;
  stem: string;
  sourceLabel: string;
  href: string;
  picked: string;
  pickedLabel: string;
  answerLabel: string;
  explanation: string;
  ok: boolean;
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

export type DailyQuestion = {
  id: string;
  subjectId: string;
  stem: string;
  choices: DailyChoice[];
  correctKeys: string[];
  href: string;
  roundHref: string;
  sourceLabel: string;
  explanation: string;
};

export type DailyQuestionView = Omit<DailyQuestion, "correctKeys" | "explanation">;
