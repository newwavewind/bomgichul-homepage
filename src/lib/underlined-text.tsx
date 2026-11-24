import type { ReactNode } from "react";
import { plainStudyText } from "@/lib/study-text";

export type UnderlineRange = readonly [number, number];

/**
 * stem 글자 offset 밑줄을 React 노드로 그린다.
 * 영어 기출은 밑줄 친 자리가 곧 문제라, 안 보이면 무엇을 묻는지 알 수 없다.
 */
export function renderUnderlinedText(
  text: string,
  underlines: readonly UnderlineRange[] | null | undefined,
  baseOffset = 0
): ReactNode {
  if (!text) return text;
  if (!underlines?.length) return text;

  const local = underlines
    .map(([start, end]) => [start - baseOffset, end - baseOffset] as const)
    .map(([start, end]) => [Math.max(0, start), Math.min(text.length, end)] as const)
    .filter(([start, end]) => start < end);

  if (!local.length) return text;

  const points = new Set<number>([0, text.length]);
  for (const [start, end] of local) {
    points.add(start);
    points.add(end);
  }
  const sorted = [...points].sort((a, b) => a - b);
  const nodes: ReactNode[] = [];
  for (let i = 0; i < sorted.length - 1; i += 1) {
    const start = sorted[i]!;
    const end = sorted[i + 1]!;
    if (start >= end) continue;
    const slice = text.slice(start, end);
    const underlined = local.some(([a, b]) => start >= a && end <= b);
    nodes.push(
      underlined ? (
        <u
          key={`${start}-${end}`}
          className="underline decoration-carbon underline-offset-[3px]"
        >
          {slice}
        </u>
      ) : (
        <span key={`${start}-${end}`}>{slice}</span>
      )
    );
  }
  return nodes;
}

/**
 * `parseInlineMaterialBox` 가 물음표 뒤 지문을 trim 해 박스로 넣을 때,
 * 원문 stem 기준 밑줄 offset 를 그 지문 문자열 기준으로 옮긴다.
 */
export function inlineBoxStartOffset(stem: string): number | null {
  const qIdx = stem.indexOf("?");
  if (qIdx < 0) return null;
  const after = stem.slice(qIdx + 1);
  const lead = after.match(/^\s*/)?.[0].length ?? 0;
  return qIdx + 1 + lead;
}

/**
 * 선지·보기 글 — 밑줄(`underlines`, 그 글 안 자리)이 있으면 원문 그대로 밑줄을 긋고,
 * 없으면 여느 때처럼 `*` 표시를 지운 글을 낸다. 자리는 원문 기준이라 밑줄이 있을 때는 지우지 않는다.
 * 「밑줄 친 부분이 바르게 쓰이지 않은 것은?」처럼 선지마다 밑줄이 곧 묻는 자리인 문항(국어·영어)에 쓴다.
 */
export function renderStudyText(
  text: string,
  underlines?: readonly UnderlineRange[] | null
): ReactNode {
  return underlines?.length ? renderUnderlinedText(text, underlines) : plainStudyText(text);
}
