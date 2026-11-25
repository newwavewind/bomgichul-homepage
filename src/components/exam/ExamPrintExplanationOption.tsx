"use client";

import { useId } from "react";

export function ExamPrintExplanationOption({ value, onChange, disabled, className }: {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
}) {
  const name = useId();
  return <fieldset className={className} disabled={disabled}>
    <legend className="font-display font-semibold text-ink">해설</legend>
    <div className="mt-2 flex flex-wrap gap-2">
      {([true, false] as const).map(include => <label key={String(include)}
        className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-mist bg-white px-3 py-1.5 text-sm text-ink has-checked:border-ios-blue has-checked:bg-slate-50">
        <input type="radio" name={name} checked={value === include} onChange={() => onChange(include)}
          className="size-4 accent-[#0066d6]" />
        {include ? "해설 포함" : "해설 미포함"}
      </label>)}
    </div>
    <p className="mt-2 text-sm text-fog">{value ? "시험지, 정답표, 문항별 해설" : "시험지와 정답표"}</p>
  </fieldset>;
}
