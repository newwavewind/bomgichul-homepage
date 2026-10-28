"use client";

import type { ReactNode } from "react";
import { DailyChoiceBadge } from "@/components/daily/DailyChoiceBadge";
import type { DailyChoice } from "@/lib/daily-challenge/types";
import {
  getOxComboTable,
  jamoHeadersFromItems,
} from "@/lib/ox-combo-table";

export function dailyOxTableFrom(
  promptItems: { key?: string; label?: string }[],
  choices: DailyChoice[],
) {
  const headers = jamoHeadersFromItems(promptItems);
  if (!headers) return null;
  return getOxComboTable(
    headers,
    choices.map((choice) => choice.text),
  );
}

export function DailyOxComboTable({
  headers,
  rows,
  choices,
  selectedKey,
  onSelect,
  disabled = false,
  correctKeys = [],
  pickedKey,
  showAnswers = false,
  renderRowExtra,
}: {
  headers: string[];
  rows: string[][];
  choices: DailyChoice[];
  selectedKey?: string;
  onSelect?: (key: string) => void;
  disabled?: boolean;
  correctKeys?: string[];
  pickedKey?: string;
  showAnswers?: boolean;
  renderRowExtra?: (choice: DailyChoice, index: number) => ReactNode;
}) {
  const gridCols = `2.25rem repeat(${headers.length}, minmax(0, 1fr))`;

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-[#DDE9F6] bg-white">
      <div
        className="grid items-center gap-x-2 border-b border-[#E6EEF8] bg-[#F8FBFF] px-3 py-2.5 text-sm font-semibold text-[#64748b] sm:px-4"
        style={{ gridTemplateColumns: gridCols }}
        aria-label="선택지 열 제목"
      >
        <span />
        {headers.map((header, index) => (
          <span key={`${header}-${index}`} className="text-center">
            {header}
          </span>
        ))}
      </div>
      <div className="divide-y divide-[#E6EEF8]">
        {choices.map((choice, index) => {
          const cells = rows[index] ?? [];
          const selected = selectedKey === choice.key;
          const isCorrect = correctKeys.includes(choice.key);
          const isPicked = pickedKey === choice.key;
          const rowClass = showAnswers
            ? isCorrect
              ? "bg-[#F1F8FF]"
              : isPicked
                ? "bg-[#FFF2F5]"
                : "bg-white"
            : selected
              ? "bg-[#F1F8FF]"
              : "bg-white hover:bg-[#F8FBFF]";
          const badgeTone = showAnswers
            ? isCorrect
              ? "selected"
              : isPicked
                ? "incorrect"
                : "default"
            : selected
              ? "selected"
              : "default";
          const extra = renderRowExtra?.(choice, index);
          const inner = (
            <>
              <span className="flex justify-center">
                <DailyChoiceBadge label={choice.label} tone={badgeTone} />
              </span>
              {cells.map((cell, cellIndex) => (
                <span
                  key={`${choice.key}-${cellIndex}`}
                  className="text-center text-[1.0625rem] leading-7 text-ink"
                >
                  {cell}
                </span>
              ))}
            </>
          );

          if (onSelect) {
            return (
              <div key={choice.key}>
                <button
                  type="button"
                  onClick={() => onSelect(choice.key)}
                  disabled={disabled}
                  aria-pressed={selected}
                  className={`grid w-full items-center gap-x-2 px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2 disabled:opacity-60 sm:px-4 ${rowClass}`}
                  style={{ gridTemplateColumns: gridCols }}
                >
                  {inner}
                </button>
                {extra}
              </div>
            );
          }

          return (
            <div key={choice.key}>
              <div
                className={`grid items-center gap-x-2 px-3 py-3 sm:px-4 ${rowClass}`}
                style={{ gridTemplateColumns: gridCols }}
              >
                {inner}
              </div>
              {showAnswers && (isPicked || isCorrect) ? (
                <p
                  className={`px-3 pb-2.5 pl-12 text-sm font-semibold sm:px-4 sm:pl-14 ${isCorrect ? "text-[#007AFF]" : "text-[#D7003A]"}`}
                >
                  {isPicked && isCorrect
                    ? "내 선택 · 정답"
                    : isCorrect
                      ? "정답"
                      : "내 선택"}
                </p>
              ) : null}
              {extra}
            </div>
          );
        })}
      </div>
    </div>
  );
}
