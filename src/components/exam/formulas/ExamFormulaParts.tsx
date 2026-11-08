import type { ReactNode } from "react";

/** 시험지형 보기 수식 — 세로 분수·위첨자 */

const FORMULA_CLASS = "text-[15px] leading-none text-ink";

export function Frac({
  num,
  den,
  className = "",
  compactNum = false,
}: {
  num: ReactNode;
  den: ReactNode;
  className?: string;
  compactNum?: boolean;
}) {
  return (
    <span className={`mx-0.5 inline-flex shrink-0 flex-col items-center align-middle ${FORMULA_CLASS} ${className}`.trim()}>
      <span
        className={`inline-flex items-baseline justify-center gap-1 px-0.5 pb-0.5 text-center leading-normal ${
          compactNum ? "whitespace-nowrap" : "flex-wrap"
        }`}
      >
        {num}
      </span>
      <span className="w-full min-w-full border-t border-current" />
      <span className="whitespace-nowrap px-0.5 pt-0.5 text-center leading-tight">{den}</span>
    </span>
  );
}

export function Sup({ children, exp }: { children: ReactNode; exp: ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-baseline">
      <span className="inline-flex items-center">{children}</span>
      <sup className="ml-0.5 align-super text-[0.72em] font-normal leading-none">{exp}</sup>
    </span>
  );
}

export function MinusOne() {
  return <span className="shrink-0 text-[15px] font-normal leading-none">− 1</span>;
}

export function PoweredMinusOne({ base, exp }: { base: ReactNode; exp: ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-baseline gap-1.5">
      <Sup exp={exp}>{base}</Sup>
      <MinusOne />
    </span>
  );
}

export function BraceFrac({ num, den }: { num: ReactNode; den: ReactNode }) {
  return (
    <span className="mx-0.5 inline-flex items-center align-middle">
      <span className="select-none text-[1.35em] font-light leading-none text-ink/80">{"{"}</span>
      <Frac num={num} den={den} />
      <span className="select-none text-[1.35em] font-light leading-none text-ink/80">{"}"}</span>
    </span>
  );
}

export function FormulaPrefix({ children }: { children: ReactNode }) {
  return (
    <span className={`inline-flex flex-wrap items-center gap-x-1.5 ${FORMULA_CLASS}`}>
      <span className="tabular-nums">500,000</span>
      <span>×</span>
      {children}
    </span>
  );
}
