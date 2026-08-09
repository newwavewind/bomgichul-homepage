import { ElevatedCard } from "@/components/ui/Card";
import { CorrectAnswerBadge } from "@/components/exam/CorrectAnswerBadge";
import { SelectedAnswerBadge } from "@/components/exam/SelectedAnswerBadge";
import type { ExamComboChoice, ExamQuestionItem } from "@/lib/exam-questions";
import { plainStudyText } from "@/lib/study-text";

export function StatementRows({
  items,
  revealed,
}: {
  items: ExamQuestionItem[];
  revealed: boolean;
  free?: boolean;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.key}
          className="rounded-[var(--radius-buttons)] border border-mist bg-surface px-4 py-3"
        >
          <div className="flex items-start gap-3">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-icons)] border border-carbon font-display text-body-sm font-bold ${
                revealed ? "visible" : "invisible"
              } ${item.answer === "O" ? "bg-[#6366f1] text-paper" : "bg-[#ef4444] text-paper"}`}
            >
              {item.answer}
            </span>
            <p className="flex-1 font-display text-body font-medium text-ink">
              {item.label} {plainStudyText(item.text)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChoiceRows({
  items,
  correctChoice,
  revealed,
  selectedKey,
}: {
  items: ExamQuestionItem[];
  correctChoice: string;
  revealed: boolean;
  free?: boolean;
  selectedKey?: string;
}) {
  return (
    <ElevatedCard className="overflow-hidden">
      {items.map((item) => {
        const isCorrectChoice = item.key === correctChoice;
        const isSelected = revealed && selectedKey === item.key;
        return (
          <div
            key={item.key}
            className={`border-b border-mist/60 px-5 py-5 last:border-b-0 ${
              isSelected
                ? isCorrectChoice
                  ? "border-l-4 border-l-[#6366f1] bg-[#6366f1]/5"
                  : "border-l-4 border-l-[#ef4444] bg-[#ef4444]/5"
                : ""
            }`}
          >
            <div className="mb-2 flex items-start gap-3">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-icons)] border border-carbon font-display text-body-sm font-bold ${
                  revealed ? "visible" : "invisible"
                } ${item.answer === "O" ? "bg-[#6366f1] text-paper" : "bg-[#ef4444] text-paper"}`}
              >
                {item.answer}
              </span>
              <p className="flex-1 font-display text-body font-medium text-ink">
                {item.label} {plainStudyText(item.text)}
                {isSelected ? (
                  <SelectedAnswerBadge correct={isCorrectChoice} className="ml-2" />
                ) : (
                  <CorrectAnswerBadge visible={revealed && isCorrectChoice} className="ml-2" />
                )}
              </p>
            </div>
          </div>
        );
      })}
    </ElevatedCard>
  );
}

export function ComboChoiceRows({
  comboChoices,
  correctChoice,
  revealed,
  selectedNo,
}: {
  comboChoices: ExamComboChoice[];
  correctChoice: string;
  revealed: boolean;
  selectedNo?: number | null;
}) {
  return (
    <ElevatedCard className="mt-4 overflow-hidden">
      {comboChoices.map((choice) => {
        const isCorrectChoice = String(choice.no) === correctChoice;
        const isSelected = revealed && selectedNo === choice.no;
        return (
          <div
            key={choice.no}
            className={`border-b border-mist/60 px-5 py-4 last:border-b-0 ${
              isSelected
                ? isCorrectChoice
                  ? "border-l-4 border-l-[#6366f1] bg-[#6366f1]/5"
                  : "border-l-4 border-l-[#ef4444] bg-[#ef4444]/5"
                : ""
            }`}
          >
            <p className="font-display text-body font-medium text-ink">
              {choice.label} {plainStudyText(choice.text)}
              {isSelected ? (
                <SelectedAnswerBadge correct={isCorrectChoice} className="ml-2" />
              ) : (
                <CorrectAnswerBadge visible={revealed && isCorrectChoice} className="ml-2" />
              )}
            </p>
          </div>
        );
      })}
    </ElevatedCard>
  );
}
