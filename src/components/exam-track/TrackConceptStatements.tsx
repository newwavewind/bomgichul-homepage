"use client";

import Link from "next/link";
import { useState } from "react";

export type TrackConceptStatement = {
  id: string;
  text: string;
  answer?: string;
  explanation?: string;
  sourceLabel: string;
  href: string;
};

function plainStatementText(text: string): string {
  return text.replace(/\*\*/g, "");
}

export function TrackConceptStatements({ statements }: { statements: TrackConceptStatement[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? statements : statements.slice(0, 12);
  return (
    <div className="space-y-3">
      {visible.map((statement) => {
        const correct = statement.answer === "O";
        return (
          <article key={statement.id} className="rounded-2xl border border-[var(--cx-ebook-line)] bg-[var(--cx-ebook-chip)] px-5 py-4">
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 font-display text-[15px] font-bold ${correct ? "text-ios-blue" : "text-[#ef6a2c]"}`}>{correct ? "O" : "X"}</span>
              <div className="min-w-0 flex-1">
                <p className="font-system text-[15px] leading-7 text-ink">{plainStatementText(statement.text)}</p>
                {statement.explanation ? <p className="mt-3 border-t border-[var(--cx-ebook-line)] pt-3 font-system text-[14px] leading-6 text-smoke">{plainStatementText(statement.explanation)}</p> : null}
                <Link href={statement.href} className="mt-3 inline-flex font-display text-[12px] font-semibold text-ios-blue hover:underline">{statement.sourceLabel} 문제 보기 →</Link>
              </div>
            </div>
          </article>
        );
      })}
      {statements.length > 12 ? <button type="button" onClick={() => setExpanded((value) => !value)} className="w-full rounded-2xl border border-[var(--cx-ebook-line)] bg-[var(--cx-ebook-chip)] px-4 py-3 font-display text-body-sm font-semibold text-ink hover:border-carbon">{expanded ? "기출 지문 접기" : `기출 지문 ${statements.length - 12}개 더 보기`}</button> : null}
    </div>
  );
}
