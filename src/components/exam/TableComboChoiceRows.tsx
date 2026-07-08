import { ElevatedCard } from "@/components/ui/Card";
import { CorrectAnswerBadge } from "@/components/exam/CorrectAnswerBadge";
import { SelectedAnswerBadge } from "@/components/exam/SelectedAnswerBadge";
import {
  defaultTableHeaders,
  getComboColumnCells,
  isTableCompositeQuestion,
  tableColumnCount,
} from "@/lib/composite-exam";
import type { ExamComboChoice } from "@/lib/exam-questions";

export function TableComboChoiceRows({
  comboChoices,
  tableHeader,
  stem,
  year,
  questionNo,
  correctChoice,
  revealed,
  interactive = false,
  selectedNo,
  onSelect,
}: {
  comboChoices: ExamComboChoice[];
  tableHeader?: string[];
  stem?: string;
  year?: number;
  questionNo?: number;
  correctChoice: string;
  revealed: boolean;
  interactive?: boolean;
  selectedNo?: number | null;
  onSelect?: (no: number) => void;
}) {
  const tableMeta = { tableHeader, comboChoices, stem, year, questionNo };
  const headers = defaultTableHeaders(tableMeta);
  const colCount = tableColumnCount(tableMeta);
  const gridCols = `minmax(4.75rem, max-content) repeat(${colCount}, minmax(0, 1fr))`;

  return (
    <ElevatedCard className="mt-4 overflow-hidden">
      <div
        className="grid gap-x-3 border-b border-mist/60 bg-surface px-4 py-2.5 font-display text-body-sm text-ink"
        style={{ gridTemplateColumns: gridCols }}
      >
        <span aria-hidden />
        {headers.slice(0, colCount).map((header, idx) => (
          <span
            key={`${header}-${idx}`}
            className="text-center font-semibold underline decoration-carbon underline-offset-2"
          >
            {header}
          </span>
        ))}
      </div>

      {comboChoices.map((choice) => {
        const cells = getComboColumnCells(choice);
        while (cells.length < colCount) cells.push("");
        const isCorrectChoice = String(choice.no) === correctChoice;
        const isSelected = selectedNo === choice.no;
        const isGradedSelection = !interactive && revealed && isSelected;

        const rowClass = interactive
          ? isSelected
            ? "bg-snow"
            : "hover:bg-snow"
          : isGradedSelection
            ? isCorrectChoice
              ? "border-l-4 border-l-[#6366f1] bg-[#6366f1]/5"
              : "border-l-4 border-l-[#ef4444] bg-[#ef4444]/5"
            : "";

        const inner = (
          <>
            <span className="flex min-w-0 items-center gap-1.5 font-display text-body-sm font-bold text-ink">
              <span className="shrink-0">{choice.label}</span>
              {isGradedSelection ? (
                <SelectedAnswerBadge correct={isCorrectChoice} className="!text-[10px]" />
              ) : (
                revealed && isCorrectChoice && <CorrectAnswerBadge className="!text-[10px]" />
              )}
            </span>
            {cells.slice(0, colCount).map((cell, idx) => (
              <span key={idx} className="text-center font-display text-body-sm text-ink">
                {cell}
              </span>
            ))}
          </>
        );

        if (interactive) {
          return (
            <button
              key={choice.no}
              type="button"
              onClick={() => onSelect?.(choice.no)}
              className={`grid w-full gap-x-3 border-b border-mist/60 px-4 py-3 text-left transition-colors last:border-b-0 ${rowClass}`}
              style={{ gridTemplateColumns: gridCols }}
            >
              {inner}
            </button>
          );
        }

        return (
          <div
            key={choice.no}
            className={`grid gap-x-3 border-b border-mist/60 px-4 py-3 last:border-b-0 ${rowClass}`}
            style={{ gridTemplateColumns: gridCols }}
          >
            {inner}
          </div>
        );
      })}
    </ElevatedCard>
  );
}
