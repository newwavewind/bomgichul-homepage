import { parseQuestionStem } from "@/lib/exam-stem";

export function QuestionStem({ stem }: { stem: string }) {
  const { intro, boxLines } = parseQuestionStem(stem);

  if (boxLines.length === 0) {
    return (
      <p className="mb-8 max-w-3xl whitespace-pre-line font-display text-body-lg leading-relaxed text-ink">
        {stem}
      </p>
    );
  }

  return (
    <>
      {intro && (
        <p className="mb-4 max-w-3xl whitespace-pre-line font-display text-body-lg leading-relaxed text-ink">
          {intro}
        </p>
      )}
      <div className="mb-8 max-w-3xl rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-surface px-5 py-4">
        {boxLines.map((line, i) => {
          const trimmed = line.trim();
          const isSubItem = trimmed.startsWith("-") || /^[가-힣]\.\s/.test(trimmed);
          const isNote = trimmed.startsWith("※");
          return (
            <p
              key={i}
              className={`font-display leading-relaxed ${
                isSubItem
                  ? "ml-4 mt-1 text-body-sm text-smoke"
                  : isNote
                    ? "mt-2 text-body-sm text-smoke"
                    : "mt-2 text-body text-ink first:mt-0"
              }`}
            >
              {trimmed}
            </p>
          );
        })}
      </div>
    </>
  );
}
