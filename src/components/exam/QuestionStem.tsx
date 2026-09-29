import { BOX_LABEL_AT_START, parseQuestionStem } from "@/lib/exam-stem";
import { plainStudyText } from "@/lib/study-text";
import {
  inlineBoxStartOffset,
  renderUnderlinedText,
  type UnderlineRange,
} from "@/lib/underlined-text";

function StemHeading({
  questionNo,
  text,
  className,
  underlines,
  baseOffset = 0,
}: {
  questionNo?: number;
  text: string;
  className: string;
  underlines?: readonly UnderlineRange[] | null;
  baseOffset?: number;
}) {
  const body = renderUnderlinedText(text, underlines, baseOffset);
  if (questionNo == null) {
    return <h1 className={className}>{body}</h1>;
  }

  return (
    <h1 className={`flex gap-x-2 ${className}`}>
      <span className="shrink-0 select-none tabular-nums">{questionNo}.</span>
      <span className="min-w-0 flex-1 whitespace-pre-line">{body}</span>
    </h1>
  );
}

/**
 * 보기 줄을 상자 단위로 묶는다. 「< 보기 1 >」·「< 보기 2 >」처럼 이름이 둘이면
 * 상자도 둘이다 — 시험지가 그렇게 생겼고, 한 상자에 몰아넣으면 어디까지가
 * 1번 묶음인지 읽는 사람이 세어야 한다.
 */
export function toBoxGroups(boxLines: string[]): { label: string | null; lines: string[] }[] {
  const groups: { label: string | null; lines: string[] }[] = [];
  for (const line of boxLines) {
    const trimmed = line.trim();
    if (BOX_LABEL_AT_START.test(trimmed)) {
      // 꺾쇠는 남기고 안쪽 공백만 고른다 — `<보기 1>` 과 `< 보기 1 >` 이 섞여 있다.
      groups.push({ label: `< ${trimmed.replace(/^<\s*|\s*>$/g, "").replace(/\s+/g, " ")} >`, lines: [] });
      continue;
    }
    if (groups.length === 0) groups.push({ label: null, lines: [] });
    groups[groups.length - 1].lines.push(trimmed);
  }
  return groups.filter((group) => group.lines.length > 0);
}

export function QuestionStem({
  stem,
  questionNo,
  /**
   * 보기 상자를 여기서 그리지 않는다. 「모두 몇 개인가」 문항처럼 도입부와 ㉠~㉤ 이
   * 한 문장으로 이어질 때는 지문 바로 위(ExamOxQuestion)에서 함께 그려야 끊겨 보이지 않는다.
   */
  renderBox = true,
  /** 공무원 영어 — stem 기준 밑줄 구간 */
  underlines = null,
}: {
  stem: string;
  questionNo?: number;
  renderBox?: boolean;
  underlines?: readonly UnderlineRange[] | null;
}) {
  // 밑줄 offset 는 원문 기준이다. * 각주 표시를 지우면 자리가 밀리므로
  // 밑줄이 있는 문항에서는 원문을 그대로 쓴다.
  const cleanStem = underlines?.length ? stem : plainStudyText(stem);
  const { intro, boxLines } = parseQuestionStem(cleanStem);
  const headingClass =
    "mb-8 max-w-3xl font-display text-body-lg font-normal leading-relaxed text-ink";

  if (!renderBox && boxLines.length > 0) {
    return (
      <StemHeading
        questionNo={questionNo}
        text={intro}
        className={`${headingClass} whitespace-pre-line`}
        underlines={underlines}
      />
    );
  }

  if (boxLines.length === 0) {
    return (
      <StemHeading
        questionNo={questionNo}
        text={cleanStem}
        className={`${headingClass} whitespace-pre-line`}
        underlines={underlines}
      />
    );
  }

  // 물음표 뒤 지문을 한 덩이로 박스에 넣은 경우(영어 독해·어휘) — 밑줄을 그 지문에 맞춘다.
  const proseBoxStart =
    underlines?.length && boxLines.length === 1
      ? inlineBoxStartOffset(cleanStem)
      : null;
  const proseBox =
    proseBoxStart != null &&
    boxLines[0] === cleanStem.slice(proseBoxStart).replace(/\s+$/, "");

  return (
    <>
      {(intro || questionNo != null) && (
        <StemHeading
          questionNo={questionNo}
          text={intro}
          className="mb-4 max-w-3xl font-display text-body-lg font-normal leading-relaxed text-ink"
          underlines={underlines}
          baseOffset={0}
        />
      )}
      {toBoxGroups(boxLines).map((group, gi) => (
        <fieldset
          key={gi}
          className="mb-8 min-w-0 max-w-3xl rounded-[var(--radius-cards)] border border-carbon px-5 pb-4 last:mb-8"
        >
          {group.label ? (
            <legend className="mx-auto px-3 text-center font-display text-body-sm font-medium text-smoke">
              {group.label}
            </legend>
          ) : null}
          <div className={group.label ? "pt-2" : "pt-4"}>
            {group.lines.map((line, i) => {
              const trimmed = line.trim();
              const isSubItem =
                trimmed.startsWith("-") ||
                /^[가-힣]\.\s/.test(trimmed) ||
                /^[ㄱ-ㅎ]\.\s/.test(trimmed);
              const isNote = trimmed.startsWith("※");
              const isJamoItem = /^[ㄱ-ㅎ]\.\s/.test(trimmed);
              const lineOffset =
                proseBox && proseBoxStart != null && gi === 0 && i === 0
                  ? proseBoxStart
                  : null;
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
                  {lineOffset != null
                    ? renderUnderlinedText(trimmed, underlines, lineOffset)
                    : trimmed}
                </p>
              );
            })}
          </div>
        </fieldset>
      ))}
    </>
  );
}
