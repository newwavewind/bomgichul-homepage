import toc from "@/data/exam-questions/toc.json";

/**
 * 공인중개사 과목의 교재 목차(편 → 장)와 「연도-번호 → 장」 대응표(2026-10-21).
 * 원천은 앱(봄기출 공인중개사)의 표준 목차 — scripts/build-realestate-toc.mjs 가 옮겨 쓴다.
 * 문제 데이터의 옛 단원(category)은 가나다순이라 목차 순서가 아니었다.
 */
export type ExamTocPart = { label: string; chapters: { id: string; label: string }[] };
type SubjectToc = { parts: ExamTocPart[]; byQuestion: Record<string, string> };

const TOC = toc as Record<string, SubjectToc>;

export function getExamToc(subject: string): SubjectToc | null {
  return TOC[subject] ?? null;
}

export function tocChapterOf(subject: string, year: number, questionNo: number): string | null {
  return TOC[subject]?.byQuestion[`${year}-${questionNo}`] ?? null;
}
