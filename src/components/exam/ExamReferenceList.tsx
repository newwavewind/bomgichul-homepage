import type { ExamReferenceEntry } from "@/lib/exam-questions";
import { plainStudyText } from "@/lib/study-text";

export function ExamReferenceList({
  entries,
  heading = "<보기>",
}: {
  entries?: ExamReferenceEntry[];
  heading?: string;
}) {
  if (!entries?.length) return null;

  return (
    <fieldset className="min-w-0 rounded-[var(--radius-cards)] border border-carbon bg-paper px-5 pb-4">
      <legend className="mx-auto px-3 text-center font-display text-body-sm font-medium text-smoke">
        {heading}
      </legend>
      <dl className="space-y-2 pt-2 font-system text-[15px] leading-7 text-ink">
        {entries.map((entry) => (
          <div key={entry.label} className="flex gap-2">
            <dt className="shrink-0 font-semibold">{entry.label}:</dt>
            <dd>{plainStudyText(entry.text)}</dd>
          </div>
        ))}
      </dl>
    </fieldset>
  );
}
