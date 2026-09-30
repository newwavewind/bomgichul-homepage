import { toBoxGroups } from "@/components/exam/QuestionStem";
import { parseQuestionStem } from "@/lib/exam-stem";
import { toExamOxCombos } from "@/lib/exam-track/combo-choices";
import type { ExamTrackExam } from "@/lib/exam-track/types";
import { plainStudyText } from "@/lib/study-text";

/** Keep compound passages and answer choices identical in detail and practice views. */
export function getTrackQuestionPresentation(exam: ExamTrackExam) {
  const comboChoices = toExamOxCombos(exam.comboChoices, exam.correctChoice);
  const groups = comboChoices.length
    ? toBoxGroups(parseQuestionStem(plainStudyText(exam.stem ?? "")).boxLines)
    : [];
  return {
    comboChoices,
    passageLead: groups.flatMap((group) => group.lines),
    passageLabel: groups.find((group) => group.label)?.label
      ?? (comboChoices.length && /<\s*보\s?기[^>]*>/.test(exam.stem ?? "") ? "< 보기 >" : undefined),
  };
}
