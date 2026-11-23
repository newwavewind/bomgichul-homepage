import type { ComponentType } from "react";
import {
  Exam2020Q30Formula1,
  Exam2020Q30Formula2,
  Exam2020Q30Formula3,
  Exam2020Q30Formula4,
  Exam2020Q30Formula5,
} from "@/components/exam/formulas/Exam2020Q30Formulas";

const FORMULA_BY_EXAM_CHOICE: Record<string, Record<string, ComponentType>> = {
  "realestate-2020-30": {
    "1": Exam2020Q30Formula1,
    "2": Exam2020Q30Formula2,
    "3": Exam2020Q30Formula3,
    "4": Exam2020Q30Formula4,
    "5": Exam2020Q30Formula5,
  },
};

export function dailyFormulaExamId(questionId: string) {
  const parts = questionId.split(":");
  if (parts.length < 5 || !parts[1] || !parts[2] || !parts[4]) return "";
  return `${parts[1]}-${parts[2]}-${parts[4]}`;
}

export function getExamFormulaChoice(examId: string | undefined, choiceKey: string | number | undefined) {
  if (!examId || choiceKey == null) return null;
  return FORMULA_BY_EXAM_CHOICE[examId]?.[String(choiceKey)] ?? null;
}
