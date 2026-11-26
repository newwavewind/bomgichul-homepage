import type { ExamTrackMaterial } from "./types";

export type OriginalExamImage = {
  src: string;
  width: number;
  height: number;
  alt?: string;
};

export type OriginalExamChoices = {
  header?: OriginalExamImage;
  rows?: OriginalExamImage[];
};

export type OriginalExamPaper = OriginalExamChoices & {
  prompt?: OriginalExamImage;
};

export function originalPromptMaterial(paper?: OriginalExamPaper): ExamTrackMaterial | undefined {
  if (!paper?.prompt) return undefined;
  const { src, width, height, alt } = paper.prompt;
  return { image: src, width, height, alt, originalPaper: true };
}
