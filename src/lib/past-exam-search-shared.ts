import type { CommunityScope } from "@/types/database";

export const PAST_EXAM_TITLE_PREFIX = "[기출 원본]";

export const PAST_EXAM_SCOPE_OPTIONS: { value: "all" | CommunityScope; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "public_service", label: "공무원" },
  { value: "real_estate", label: "공인중개사" },
  { value: "police", label: "경찰" },
  { value: "housing", label: "주택관리사" },
  { value: "social_worker", label: "사회복지사" },
  { value: "english", label: "공무원 영어" },
  { value: "history", label: "한국사" },
];

/** 홈 기출 PDF 연도 칩 — 최근 연도부터 */
export const PAST_EXAM_YEAR_OPTIONS: number[] = (() => {
  const latest = 2026;
  const years: number[] = [];
  for (let y = latest; y >= 2016; y -= 1) years.push(y);
  return years;
})();

/** 한국사능력검정은 연도 대신 회차 */
export const PAST_EXAM_ROUND_OPTIONS: number[] = [
  79, 78, 77, 76, 75, 74, 73, 72, 71, 70,
];

export type PastExamFileKind = "question" | "answer" | "other";

export type PastExamPdfFile = {
  kind: PastExamFileKind;
  kindLabel: string;
  postId: string;
  fileName: string;
  url: string;
};

export type PastExamPdfGroup = {
  key: string;
  label: string;
  scope: CommunityScope;
  scopeLabel: string;
  year: number | null;
  round: number | null;
  files: PastExamPdfFile[];
};
