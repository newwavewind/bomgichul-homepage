import { parseQuestionStem } from "@/lib/exam-stem";
import { plainStudyText } from "@/lib/study-text";

function StemHeading({
  questionNo,
  text,
  className,
}: {
  questionNo?: number;
  text: string;
  className: string;
}) {
  if (questionNo == null) {
    return <h1 className={className}>{text}</h1>;
  }

  return (
    <h1 className={`flex gap-x-2 ${className}`}>
      <span className="shrink-0 select-none tabular-nums">{questionNo}.</span>
      <span className="min-w-0 flex-1 whitespace-pre-line">{text}</span>
    </h1>
  );
}

export function QuestionStem({
  stem,
  questionNo,
}: {
  stem: string;
  questionNo?: number;
}) {
  const cleanStem = plainStudyText(stem);
  const { intro, boxLines } = parseQuestionStem(cleanStem);
  const headingClass =
    "mb-8 max-w-3xl font-display text-body-lg font-normal leading-relaxed text-ink";

  if (boxLines.length === 0) {
    return (
      <StemHeading
        questionNo={questionNo}
        text={cleanStem}
        className={`${headingClass} whitespace-pre-line`}
      />
    );
  }

  return (
    <>
      {(intro || questionNo != null) && (
        <StemHeading
          questionNo={questionNo}
          text={intro}
          className="mb-4 max-w-3xl font-display text-body-lg font-normal leading-relaxed text-ink"
        />
      )}
      <div className="mb-8 max-w-3xl rounded-[var(--radius-cards)] border border-carbon bg-surface px-5 py-4">
        {boxLines.map((line, i) => {
          const trimmed = line.trim();
          const isSubItem =
            trimmed.startsWith("-") ||
            /^[가-힣]\.\s/.test(trimmed) ||
            /^[ㄱ-ㅎ]\.\s/.test(trimmed);
          const isNote = trimmed.startsWith("※");
          const isJamoItem = /^[ㄱ-ㅎ]\.\s/.test(trimmed);
          return (
            <p
              key={i}
              className={`font-display leading-relaxed ${
                isJamoItem
                  ? "mt-1.5 text-body text-ink first:mt-0"
                  : isSubItem
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
