import type { ExplanationSource } from "@/components/exam/ExamExplanationSources";

const IAS_1 = "https://www.ifrs.org/content/dam/ifrs/publications/pdf-standards/english/2022/issued/part-a/ias-1-presentation-of-financial-statements.pdf?bypass=on";

const accounting2024Question1 = {
  "1": "IAS 1 문단 25 · 계속기업 가정",
  "2": "IAS 1 문단 18 · 부적절한 회계정책",
  "3": "IAS 1 문단 36 · 재무제표 보고 빈도와 비교정보",
  "4": "IAS 1 문단 32 · 상계",
  "5": "IAS 1 문단 27 · 발생기준과 현금흐름 정보",
};

export function housingExplanationSources(examId: string): Record<string, ExplanationSource[]> {
  if (examId !== "accounting-2024-Q1") return {};
  return Object.fromEntries(Object.entries(accounting2024Question1).map(([key, label]) => [key, [{ label, url: IAS_1 }]]));
}
