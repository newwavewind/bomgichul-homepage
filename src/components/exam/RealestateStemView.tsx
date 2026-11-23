import type { ReactNode } from "react";
import {
  formatCircleBulletDashes,
  parseInlineJamoColonDefinitions,
  prepareRealestateStem,
  splitCircleBullets,
  type JamoDef,
} from "@/lib/realestate-stem-layout";

function linesOf(text: string): string[] {
  return formatCircleBulletDashes(text)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function StemLines({ lines, exam }: { lines: string[]; exam: boolean }) {
  return (
    <>
      {lines.map((line, index) => {
        const circle = line.match(/^([ㅇ○])\s+(.*)$/);
        const sub = index > 0 && (/^-\s/.test(line) || /^:\s/.test(line));
        const jamo = line.match(/^([ㄱ-ㅎ][.:：])\s*(.*)$/);
        const textClass = exam
          ? "font-display leading-relaxed text-body text-ink"
          : "text-[1.0625rem] leading-7 text-ink";
        if (circle && !sub) {
          return (
            <p key={index} className={`flex gap-2 ${textClass}`}>
              <span className="shrink-0">{circle[1]}</span>
              <span>{circle[2]}</span>
            </p>
          );
        }
        if (jamo) {
          return (
            <p key={index} className={`flex gap-2 ${textClass}`}>
              <span className="shrink-0 font-semibold">{jamo[1]}</span>
              <span>{jamo[2]}</span>
            </p>
          );
        }
        return (
          <p key={index} className={`${textClass} whitespace-pre-line ${sub ? "pl-6" : ""}`}>
            {line}
          </p>
        );
      })}
    </>
  );
}

function Box({
  exam,
  legend,
  children,
}: {
  exam: boolean;
  legend?: string;
  children: ReactNode;
}) {
  return (
    <fieldset
      className={
        exam
          ? "mb-8 min-w-0 max-w-3xl rounded-[var(--radius-cards)] border border-carbon px-5 pb-4"
          : "mt-4 min-w-0 rounded-2xl border border-[#d7e3f4] bg-white/85 px-4 pb-3"
      }
    >
      {legend ? (
        <legend
          className={
            exam
              ? "mx-auto px-3 text-center font-display text-body-sm font-medium text-smoke"
              : "mx-auto px-3 text-center text-xs font-semibold text-[#64748b]"
          }
        >
          {legend}
        </legend>
      ) : null}
      <div className={legend ? "space-y-2 pt-2" : exam ? "space-y-2 pt-4" : "space-y-2.5 pt-3"}>
        {children}
      </div>
    </fieldset>
  );
}

function Defs({ defs, exam }: { defs: JamoDef[]; exam: boolean }) {
  const textClass = exam
    ? "font-display leading-relaxed text-body text-ink"
    : "text-[1.0625rem] leading-7 text-ink";
  return (
    <Box exam={exam}>
      {defs.map((def) => (
        <p key={def.jamo} className={`flex gap-2 ${textClass}`}>
          <span className="shrink-0 font-semibold">{def.jamo}:</span>
          <span>{def.text}</span>
        </p>
      ))}
    </Box>
  );
}

export function RealestateStemView({
  stem,
  questionNo,
  tone,
  heading = "h2",
}: {
  stem: string;
  questionNo?: number;
  tone: "daily" | "exam";
  heading?: "h2" | "h3";
}) {
  const exam = tone === "exam";
  const parts = prepareRealestateStem(stem);
  const Heading = heading;
  const headingClass = exam
    ? "mb-4 max-w-3xl font-display text-body-lg font-normal leading-relaxed text-ink"
    : "mt-3 whitespace-pre-line text-[1.0625rem] font-semibold leading-7 text-ink";
  const inlineDefs = parts.embeddedBlock ? parseInlineJamoColonDefinitions(parts.embeddedBlock) : null;
  const embeddedBullets = parts.embeddedBlock ? splitCircleBullets(parts.embeddedBlock) : [];
  const bogi = parts.bogiBlock;

  return (
    <>
      {exam ? (
        <h1 className={`flex gap-x-2 ${headingClass}`}>
          {questionNo != null ? (
            <span className="shrink-0 select-none tabular-nums">{questionNo}.</span>
          ) : null}
          <span className="min-w-0 flex-1 whitespace-pre-line">{parts.intro}</span>
        </h1>
      ) : (
        <Heading className={headingClass}>{parts.intro}</Heading>
      )}
      {parts.jamoDefs?.length ? <Defs defs={parts.jamoDefs} exam={exam} /> : null}
      {bogi?.fillSentence ? (
        <Box exam={exam}>
          <StemLines lines={[bogi.fillSentence]} exam={exam} />
        </Box>
      ) : null}
      {bogi?.bogiItems?.length ? (
        <Box exam={exam} legend="<보기>">
          {bogi.bogiItems.map((item) => {
            const sep = /^[가-힣]$/.test(item.key) ? ":" : ".";
            const textClass = exam
              ? "flex gap-2 font-display leading-relaxed text-body text-ink"
              : "flex gap-2 text-[1.0625rem] leading-7 text-ink";
            return (
              <p key={item.key} className={textClass}>
                <span className="shrink-0 font-semibold">
                  {item.key}
                  {sep}
                </span>
                <span>{item.text}</span>
              </p>
            );
          })}
        </Box>
      ) : null}
      {parts.jamoFillBlock ? (
        <Box exam={exam}>
          <StemLines lines={[parts.jamoFillBlock.fillSentence]} exam={exam} />
        </Box>
      ) : null}
      {!bogi && !parts.jamoFillBlock && parts.embeddedBlock ? (
        <Box exam={exam}>
          {inlineDefs ? (
            inlineDefs.map((def) => (
              <p
                key={def.jamo}
                className={
                  exam
                    ? "flex gap-2 font-display leading-relaxed text-body text-ink"
                    : "flex gap-2 text-[1.0625rem] leading-7 text-ink"
                }
              >
                <span className="shrink-0 font-semibold">{def.jamo}:</span>
                <span>{def.text}</span>
              </p>
            ))
          ) : embeddedBullets.length > 0 ? (
            embeddedBullets.map((bullet, index) => (
              <StemLines key={index} lines={linesOf(bullet)} exam={exam} />
            ))
          ) : (
            <StemLines lines={parts.embeddedBlock.split("\n")} exam={exam} />
          )}
        </Box>
      ) : null}
      {!bogi && !parts.jamoFillBlock && (parts.bulletsProse || parts.bullets?.length) ? (
        <Box exam={exam}>
          {parts.bulletsProse ? <StemLines lines={[parts.bulletsProse]} exam={exam} /> : null}
          {parts.bullets?.map((bullet, index) => (
            <StemLines key={index} lines={linesOf(bullet)} exam={exam} />
          ))}
        </Box>
      ) : null}
      {parts.tail ? (
        <p
          className={
            exam
              ? "mb-8 max-w-3xl whitespace-pre-line font-display text-body-lg leading-relaxed text-ink"
              : "mt-4 whitespace-pre-line text-[1.0625rem] leading-7 text-ink"
          }
        >
          {parts.tail}
        </p>
      ) : null}
    </>
  );
}
