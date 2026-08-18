import { Fragment } from "react";
import type { HistoryConceptBlock, HistoryConceptNote as Note } from "@/lib/exam-track/types";

/**
 * 문항 아래에 붙는 「핵심 개념」 카드 — 한국사능력검정 전용.
 *
 * 선지 해설은 「왜 이 선지가 참/거짓인가」를 답하고, 이 카드는 「이 문항을 풀려면
 * 무엇을 알아야 했는가」를 답한다. 앱(historybomgichul)에서 쓰는 블록 구조를 그대로
 * 옮기되, 좁은 화면을 전제한 앱과 달리 PC 폭을 살려 카드를 가로로 벌려 놓는다.
 *
 * 블록은 다섯 — p(문단) · stack(카드) · timeline(연표) · compare(대조) · callout(한 줄).
 * 표(table)는 쓰지 않는다. 가로로 밀어야 읽히는 자리를 만들지 않기 위해서다.
 */
function withEmphasis(text: string) {
  const parts = String(text ?? "").split(/\*\*(.+?)\*\*/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-ink">
        {part}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

function ConceptBlock({ block }: { block: HistoryConceptBlock }) {
  switch (block.유형) {
    case "p":
      return (
        <p className="font-system text-[15px] leading-[1.75] text-smoke">
          {withEmphasis(block.글)}
        </p>
      );

    case "callout":
      return (
        <p className="flex gap-2.5 rounded-2xl border border-amber/35 bg-amber/[0.07] px-4 py-3.5 font-system text-[15px] leading-[1.7] text-ink">
          <span aria-hidden className="shrink-0 text-amber">
            ★
          </span>
          <span>{withEmphasis(block.글)}</span>
        </p>
      );

    case "stack":
      return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {block.카드.map((card, i) => (
            <div
              key={i}
              className="rounded-2xl border border-mist bg-paper px-4 py-3.5 shadow-[var(--shadow-subtle)]"
            >
              <p className="mb-2.5 font-display text-[13px] font-semibold text-ink">{card.이름}</p>
              <dl className="space-y-2">
                {card.행.map((row, ri) => (
                  <div key={ri}>
                    <dt className="font-display text-[11px] font-medium text-fog">{row.라벨}</dt>
                    <dd className="mt-0.5 font-system text-[14px] leading-[1.6] text-smoke">
                      {withEmphasis(row.값)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      );

    case "timeline":
      return (
        <ol className="relative space-y-0 border-l-[1.5px] border-mist pl-0">
          {block.사건.map((ev, i) => (
            <li key={i} className="relative grid gap-1 py-2.5 pl-5 sm:grid-cols-[8.5rem_1fr] sm:gap-4">
              <span
                aria-hidden
                className="absolute left-[-5px] top-[1.15rem] size-2.5 rounded-full border-[1.5px] border-paper bg-ios-blue"
              />
              <span className="font-display text-[13px] font-semibold text-ios-blue">{ev.때}</span>
              <span className="font-system text-[15px] leading-[1.65] text-smoke">
                {withEmphasis(ev.일)}
              </span>
            </li>
          ))}
        </ol>
      );

    case "compare":
      return (
        <div className="grid gap-3 md:grid-cols-2">
          {block.묶음.map((group, i) => (
            <div key={i} className="rounded-2xl border border-mist bg-snow px-4 py-3.5">
              <p className="mb-2 font-display text-[13px] font-semibold text-ink">{group.이름}</p>
              <ul className="space-y-1.5">
                {group.항목.map((point, pi) => (
                  <li
                    key={pi}
                    className="flex gap-2 font-system text-[14px] leading-[1.6] text-smoke"
                  >
                    <span aria-hidden className="mt-[0.45rem] size-1 shrink-0 rounded-full bg-fog" />
                    <span>{withEmphasis(point)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}

export function HistoryConceptNote({ concept }: { concept?: Note | null }) {
  if (!concept?.블록?.length) return null;

  return (
    <section
      aria-label="핵심 개념"
      className="mt-8 overflow-hidden rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper"
    >
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-mist bg-snow px-5 py-3.5">
        <span className="rounded-full border border-carbon/30 bg-paper px-2.5 py-1 font-display text-[11px] font-semibold text-ink">
          핵심 개념
        </span>
        <h3 className="font-display text-[17px] font-semibold tracking-tight text-ink">
          {concept.제목}
        </h3>
      </header>
      <div className="space-y-4 px-5 py-5">
        {concept.블록.map((block, i) => (
          <ConceptBlock key={i} block={block} />
        ))}
      </div>
    </section>
  );
}
