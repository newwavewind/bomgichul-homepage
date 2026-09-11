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
  files: PastExamPdfFile[];
};
