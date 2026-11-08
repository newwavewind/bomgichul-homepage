import { parseQuestionStem } from "@/lib/exam-stem";
import { toBoxGroups } from "@/components/exam/QuestionStem";
import { prepareRealestateStem, realestateStemHasBoxes } from "@/lib/realestate-stem-layout";
import { RealestateStemView } from "@/components/exam/RealestateStemView";
import { plainStudyText } from "@/lib/study-text";
import {
  renderUnderlinedText,
  type UnderlineRange,
} from "@/lib/underlined-text";

export function DailyQuestionStem({
  stem,
  heading = "h2",
  underlines,
  keepLineBreaks = false,
  subjectId,
}: {
  stem: string;
  heading?: "h2" | "h3";
  underlines?: readonly UnderlineRange[] | null;
  keepLineBreaks?: boolean;
  subjectId?: string;
}) {
  const cleanStem = underlines?.length ? stem : plainStudyText(stem);
  if (
    subjectId === "realestate" &&
    !underlines?.length &&
    !keepLineBreaks &&
    realestateStemHasBoxes(prepareRealestateStem(cleanStem))
  ) {
    return <RealestateStemView stem={cleanStem} tone="daily" heading={heading} />;
  }
  const lines = keepLineBreaks ? cleanStem.split("\n") : null;
  const { intro, boxLines } = lines
    ? {
        intro: lines[0]?.trim() ?? "",
        boxLines: lines
          .slice(1)
          .map((line) => line.trim())
          .filter(Boolean),
      }
    : parseQuestionStem(cleanStem);
  const Heading = heading;

  if (boxLines.length === 0) {
    return (
      <Heading className="mt-3 whitespace-pre-line text-[1.0625rem] font-semibold leading-7 text-ink">
        {renderUnderlinedText(cleanStem, underlines)}
      </Heading>
    );
  }

  const groups = toBoxGroups(boxLines);
  let lineCursor = intro.length;

  return (
    <>
      <Heading className="mt-3 whitespace-pre-line text-[1.0625rem] font-semibold leading-7 text-ink">
        {renderUnderlinedText(intro, underlines)}
      </Heading>
      {groups.map((group, groupIndex) => (
        <fieldset
          key={groupIndex}
          className="mt-4 min-w-0 rounded-2xl border border-[#d7e3f4] bg-white/85 px-4 pb-3"
        >
          {group.label ? (
            <legend className="px-2 text-[0.95rem] font-semibold text-ink">{group.label}</legend>
          ) : null}
          <div className="space-y-2.5 pt-3">
            {group.lines.map((line, index) => {
              const trimmed = line.trim();
              const match = trimmed.match(/^([ㄱ-ㅎ]\.)\s*(.*)$/);
              const sub = trimmed.startsWith("-") || /^[가-힣]\.\s/.test(trimmed);
              const offset = underlines?.length
                ? cleanStem.indexOf(trimmed, lineCursor)
                : -1;
              if (offset >= 0) lineCursor = offset + trimmed.length;
              const body =
                offset >= 0
                  ? renderUnderlinedText(trimmed, underlines, offset)
                  : trimmed;
              return match ? (
                <p key={index} className="flex gap-2 text-[1.0625rem] leading-7 text-ink">
                  <span className="shrink-0 font-semibold">{match[1]}</span>
                  <span>
                    {offset >= 0
                      ? renderUnderlinedText(
                          match[2],
                          underlines,
                          offset + trimmed.indexOf(match[2]),
                        )
                      : match[2]}
                  </span>
                </p>
              ) : (
                <p
                  key={index}
                  className={`whitespace-pre-line text-[1.0625rem] leading-7 text-ink${sub ? " pl-4" : ""}`}
                >
                  {body}
                </p>
              );
            })}
          </div>
        </fieldset>
      ))}
    </>
  );
}
