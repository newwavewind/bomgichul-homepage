import { BraceFrac, FormulaPrefix, Frac, PoweredMinusOne, Sup } from "@/components/exam/formulas/ExamFormulaParts";

function monthlyRate() {
  return <Frac num="0.03" den="12" compactNum />;
}

function OnePlusMonthlyRate() {
  return (
    <span className="inline-flex items-center">
      <span>(1+</span>
      {monthlyRate()}
      <span>)</span>
    </span>
  );
}

/** ① 500,000 × {[(1+0.03)⁵ − 1] / 0.03} */
export function Exam2020Q30Formula1() {
  return (
    <FormulaPrefix>
      <BraceFrac num={<PoweredMinusOne base={<span>(1+0.03)</span>} exp="5" />} den="0.03" />
    </FormulaPrefix>
  );
}

/** ② 500,000 × {[(1+0.03/12)^(5×12) − 1] / (0.03/12)} */
export function Exam2020Q30Formula2() {
  return (
    <FormulaPrefix>
      <BraceFrac num={<PoweredMinusOne base={<OnePlusMonthlyRate />} exp="5 × 12" />} den={monthlyRate()} />
    </FormulaPrefix>
  );
}

/** ③ 500,000 × (1+0.03/12)^(5×12) */
export function Exam2020Q30Formula3() {
  return (
    <FormulaPrefix>
      <Sup exp="5 × 12">
        <OnePlusMonthlyRate />
      </Sup>
    </FormulaPrefix>
  );
}

/** ④ 500,000 × {0.03 / [1 − (1+0.03)⁻⁵]} */
export function Exam2020Q30Formula4() {
  const den = (
    <span className="inline-flex items-baseline gap-1">
      <span>1</span>
      <span>−</span>
      <Sup exp="-5">
        <span>(1+0.03)</span>
      </Sup>
    </span>
  );
  return (
    <FormulaPrefix>
      <BraceFrac num="0.03" den={den} />
    </FormulaPrefix>
  );
}

/** ⑤ 500,000 × {(0.03/12) / [1 − (1+0.03/12)^(−5×12)]} */
export function Exam2020Q30Formula5() {
  const den = (
    <span className="inline-flex items-baseline gap-1">
      <span>1</span>
      <span>−</span>
      <Sup exp="-5 × 12">
        <OnePlusMonthlyRate />
      </Sup>
    </span>
  );
  return (
    <FormulaPrefix>
      <BraceFrac num={monthlyRate()} den={den} />
    </FormulaPrefix>
  );
}
