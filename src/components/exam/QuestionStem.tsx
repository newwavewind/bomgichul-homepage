function isBulletLine(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith("ㅇ") || trimmed.startsWith("○");
}

export function QuestionStem({ stem }: { stem: string }) {
  const lines = stem.split("\n");
  const boxStart = lines.findIndex(isBulletLine);

  if (boxStart === -1) {
    return (
      <p className="mb-8 max-w-3xl whitespace-pre-line font-display text-body-lg leading-relaxed text-ink">
        {stem}
      </p>
    );
  }

  const intro = lines.slice(0, boxStart).join("\n").trim();
  const boxLines = lines.slice(boxStart).filter((line) => line.trim().length > 0);

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
          const isSubItem = trimmed.startsWith("-");
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
