"use client";

import Image from "next/image";
import { DailyQuestionStem } from "@/components/daily/DailyQuestionStem";
import { ExamMaterialFigure } from "@/components/exam/ExamMaterialFigure";
import { ExamReferenceList } from "@/components/exam/ExamReferenceList";
import { ExamStructuredMaterials } from "@/components/exam/ExamStructuredMaterials";
import { ExamSubjectNotice } from "@/components/exam/ExamSubjectNotice";
import type {
  DailyChoice,
  DailyQuestionPresentation,
} from "@/lib/daily-challenge/types";
import { plainStudyText } from "@/lib/study-text";

export function DailyQuestionBody({
  stem,
  presentation,
  questionNo,
  heading = "h2",
}: {
  stem: string;
  presentation: DailyQuestionPresentation;
  questionNo: number;
  heading?: "h2" | "h3";
}) {
  const passages = [presentation.passage, presentation.passageText]
    .map((value) => value?.trim() ?? "")
    .filter((value, index, all) => value && all.indexOf(value) === index);

  return (
    <>
      <ExamSubjectNotice notice={presentation.notice} className="mt-4" />
      <DailyQuestionStem
        stem={stem}
        heading={heading}
        underlines={presentation.underlines}
        keepLineBreaks={presentation.keepStemLines}
      />
      {presentation.material?.figureFirst ? (
        <div className="mt-4">
          <ExamMaterialFigure
            material={presentation.material}
            questionNo={questionNo}
          />
        </div>
      ) : null}
      <ExamStructuredMaterials
        table={presentation.table}
        tAccounts={presentation.tAccounts}
        stemTail={presentation.stemTail}
      />
      {passages.map((passage, index) => (
        <div
          key={index}
          className="mt-4 whitespace-pre-line rounded-2xl border border-[#d7e3f4] bg-white/85 px-4 py-3 text-[1.0625rem] leading-7 text-ink"
        >
          {plainStudyText(passage)}
        </div>
      ))}
      {presentation.material && !presentation.material.figureFirst ? (
        <div className="mt-4">
          <ExamMaterialFigure
            material={presentation.material}
            questionNo={questionNo}
          />
        </div>
      ) : null}
      {presentation.leadEntries.length ? (
        <div className="mt-4">
          <ExamReferenceList
            entries={presentation.leadEntries}
            heading="시장 유형"
          />
        </div>
      ) : null}
      {presentation.promptItems.length ? (
        <fieldset className="mt-4 min-w-0 rounded-2xl border border-[#d7e3f4] bg-white/85 px-4 pb-4">
          <legend className="mx-auto px-3 text-center text-xs font-semibold text-[#64748b]">
            &lt; 보기 &gt;
          </legend>
          <div className="space-y-3 pt-2">
            {presentation.promptItems.map((item) => (
              <div
                key={item.key}
                className="flex gap-2 text-[1.0625rem] leading-7 text-ink"
              >
                <span className="shrink-0 font-semibold text-[#0066D6]">
                  {item.label}
                </span>
                <div className="min-w-0 flex-1">
                  {item.text ? <p>{plainStudyText(item.text)}</p> : null}
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={`${item.label} 보기 자료`}
                      width={1200}
                      height={900}
                      className="mt-2 h-auto max-h-[520px] w-auto max-w-full rounded-xl border border-[#e6eef8] bg-white object-contain"
                      sizes="(max-width: 640px) 100vw, 560px"
                    />
                  ) : null}
                  {item.translation ? (
                    <p className="mt-1 text-sm leading-6 text-[#64748b]">
                      {item.translation}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      ) : null}
      {presentation.referenceEntries.length ? (
        <div className="mt-4">
          <ExamReferenceList entries={presentation.referenceEntries} />
        </div>
      ) : null}
      {presentation.choiceHeaders.length ? (
        <div
          className="mt-4 flex gap-3 rounded-xl bg-[#f8fafc] px-3 py-2 text-sm font-semibold text-[#64748b] sm:px-4"
          aria-label="선택지 열 제목"
        >
          <span className="w-6 shrink-0" aria-hidden />
          <div
            className="grid flex-1 gap-2 text-center"
            style={{
              gridTemplateColumns: `repeat(${presentation.choiceHeaders.length}, minmax(0, 1fr))`,
            }}
          >
            {presentation.choiceHeaders.map((header, index) => (
              <span key={`${header}-${index}`}>{header}</span>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

export function DailyChoiceContent({
  choice,
  choiceHeaders = [],
}: {
  choice: DailyChoice;
  choiceHeaders?: string[];
}) {
  const cells = choice.text.split("/").map((cell) => cell.trim());
  const showCells =
    choiceHeaders.length >= 2 && cells.length === choiceHeaders.length;

  return (
    <div className="min-w-0 flex-1 break-words text-[1.0625rem] leading-7">
      {choice.text ? (
        showCells ? (
          <span
            className="grid gap-2 text-center"
            style={{
              gridTemplateColumns: `repeat(${choiceHeaders.length}, minmax(0, 1fr))`,
            }}
          >
            {cells.map((cell, index) => (
              <span key={`${cell}-${index}`}>{plainStudyText(cell)}</span>
            ))}
          </span>
        ) : (
          <span>{plainStudyText(choice.text)}</span>
        )
      ) : null}
      {choice.image ? (
        <Image
          src={choice.image}
          alt={`${choice.label} 선택지 자료`}
          width={1200}
          height={900}
          className="mt-2 h-auto max-h-[420px] w-auto max-w-full rounded-xl border border-[#e6eef8] bg-white object-contain"
          sizes="(max-width: 640px) 100vw, 560px"
        />
      ) : null}
      {choice.translation ? (
        <p className="mt-1 text-sm leading-6 text-[#64748b]">
          {choice.translation}
        </p>
      ) : null}
    </div>
  );
}
