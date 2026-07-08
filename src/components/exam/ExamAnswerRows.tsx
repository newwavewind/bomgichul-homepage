import { ElevatedCard } from "@/components/ui/Card";
import { ExamAiButtons } from "@/components/exam/ExamAiButtons";
import { CorrectAnswerBadge } from "@/components/exam/CorrectAnswerBadge";
import { SelectedAnswerBadge } from "@/components/exam/SelectedAnswerBadge";
import { buildExamItemAiPrompt } from "@/lib/ai-links";
import type { ExamComboChoice, ExamQuestionItem, ExamSubject } from "@/lib/exam-questions";

const EXPLANATION_PREVIEW_LENGTH = 40;

export interface ExamAnswerAiContext {
  subject: ExamSubject;
  subjectLabel: string;
  unlocked: boolean;
  year: number;
  round: number;
  questionNo: number;
  category: string;
  stem: string;
  correctChoice: string;
}

function previewText(text: string): string {
  if (text.length <= EXPLANATION_PREVIEW_LENGTH) return text;
  return `${text.slice(0, EXPLANATION_PREVIEW_LENGTH)}…`;
}

function buildPrompt(aiContext: ExamAnswerAiContext, item: ExamQuestionItem, free: boolean) {
  return buildExamItemAiPrompt({
    ...aiContext,
    item,
    includeExplanation: free,
  });
}

function ExplanationRow({
  item,
  free,
  revealed,
  aiContext,
}: {
  item: ExamQuestionItem;
  free: boolean;
  revealed: boolean;
  aiContext?: ExamAnswerAiContext;
}) {
  const prompt = aiContext ? buildPrompt(aiContext, item, free) : "";

  // 해설 전문/요약은 아래 SEO 섹션에서만 보여주고,
  // 카드 안에서는 AI 버튼만 유지한다.
  if (!revealed && !free) return null;
  if (!prompt || !aiContext) return null;

  return (
    <div className="ml-10 mt-2 flex flex-wrap items-center gap-2">
      <ExamAiButtons
        prompt={free ? prompt : buildPrompt(aiContext, item, false)}
        unlocked={aiContext.unlocked}
        subject={aiContext.subject}
        subjectLabel={aiContext.subjectLabel}
      />
    </div>
  );
}

export function StatementRows({
  items,
  revealed,
  free,
  aiContext,
}: {
  items: ExamQuestionItem[];
  revealed: boolean;
  free: boolean;
  aiContext?: ExamAnswerAiContext;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.key}
          className="rounded-[var(--radius-buttons)] border-[1.5px] border-mist bg-surface px-4 py-3"
        >
          <div className="flex items-start gap-3">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-icons)] border-[1.5px] border-carbon font-display text-body-sm font-bold ${
                revealed ? "visible" : "invisible"
              } ${item.answer === "O" ? "bg-[#6366f1] text-paper" : "bg-[#ef4444] text-paper"}`}
            >
              {item.answer}
            </span>
            <p className="flex-1 font-display text-body font-medium text-ink">
              {item.label} {item.text}
            </p>
          </div>
          {(free || revealed) && (
            <ExplanationRow item={item} free={free} revealed={revealed} aiContext={aiContext} />
          )}
        </div>
      ))}
    </div>
  );
}

export function ChoiceRows({
  items,
  correctChoice,
  revealed,
  free,
  aiContext,
  selectedKey,
}: {
  items: ExamQuestionItem[];
  correctChoice: string;
  revealed: boolean;
  free: boolean;
  aiContext?: ExamAnswerAiContext;
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
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-icons)] border-[1.5px] border-carbon font-display text-body-sm font-bold ${
                  revealed ? "visible" : "invisible"
                } ${item.answer === "O" ? "bg-[#6366f1] text-paper" : "bg-[#ef4444] text-paper"}`}
              >
                {item.answer}
              </span>
              <p className="flex-1 font-display text-body font-medium text-ink">
                {item.label} {item.text}
                {isSelected ? (
                  <SelectedAnswerBadge correct={isCorrectChoice} className="ml-2" />
                ) : (
                  <CorrectAnswerBadge visible={revealed && isCorrectChoice} className="ml-2" />
                )}
              </p>
            </div>
            <ExplanationRow item={item} free={free} revealed={revealed} aiContext={aiContext} />
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
              {choice.label} {choice.text}
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
