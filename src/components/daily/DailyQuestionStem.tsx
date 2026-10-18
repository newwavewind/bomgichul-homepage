import { parseQuestionStem } from "@/lib/exam-stem";
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
}: {
  stem: string;
  heading?: "h2" | "h3";
  underlines?: readonly UnderlineRange[] | null;
  keepLineBreaks?: boolean;
}) {
  const cleanStem = underlines?.length ? stem : plainStudyText(stem);
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

  let lineCursor = intro.length;

  return (
    <>
      <Heading className="mt-3 whitespace-pre-line text-[1.0625rem] font-semibold leading-7 text-ink">
        {renderUnderlinedText(intro, underlines)}
      </Heading>
      <fieldset className="mt-4 min-w-0 rounded-2xl border border-[#d7e3f4] bg-white/85 px-4 pb-3">
        <div className="space-y-2.5 pt-3">
          {boxLines.map((line, index) => {
            const match = line.match(/^([ㄱ-ㅎ]\.)\s*(.*)$/);
            const offset = underlines?.length
              ? cleanStem.indexOf(line.trim(), lineCursor)
              : -1;
            if (offset >= 0) lineCursor = offset + line.length;
            const body =
              offset >= 0
                ? renderUnderlinedText(line, underlines, offset)
                : line;
            return match ? (
              <p key={index} className="flex gap-2 text-[1.0625rem] leading-7 text-ink">
                <span className="shrink-0 font-semibold">{match[1]}</span>
                <span>
                  {offset >= 0
                    ? renderUnderlinedText(
                        match[2],
                        underlines,
                        offset + line.indexOf(match[2]),
                      )
                    : match[2]}
                </span>
              </p>
            ) : (
              <p
                key={index}
                className="whitespace-pre-line text-[1.0625rem] leading-7 text-ink"
              >
                {body}
              </p>
            );
          })}
        </div>
      </fieldset>
    </>
  );
}
