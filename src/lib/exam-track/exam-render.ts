import type { ExamTrackExam } from "./types";

/**
 * 상세 페이지로 렌더할 수 있는 문항인지 한 곳에서 판정한다.
 * 상세 라우트(notFound 여부)와 sitemap(수록 여부)이 같은 규칙을 쓰도록 공유한다.
 *
 * - "objective": 발문(stem)이 있는 객관식
 * - "subjective": 발문(prompt)과 빈칸 정답이 있는 단답형 주관식
 * - null       : 보여 줄 본문이 없는 레코드 → 404, sitemap 제외
 */
export type ExamRenderKind = "objective" | "subjective";

type ExamLike = Pick<ExamTrackExam, "kind" | "stem" | "prompt" | "blanks"> & {
  items?: unknown[];
};

export function examRenderKind(exam: ExamLike | null | undefined): ExamRenderKind | null {
  if (!exam) return null;

  if (exam.kind === "subjective") {
    const hasPrompt = Boolean(exam.prompt?.trim());
    const hasAnswer = (exam.blanks ?? []).some((blank) => Boolean(blank.answer?.trim()));
    return hasPrompt && hasAnswer ? "subjective" : null;
  }

  return exam.stem?.trim() ? "objective" : null;
}

export function isRenderableExam(exam: ExamLike | null | undefined): boolean {
  return examRenderKind(exam) !== null;
}
