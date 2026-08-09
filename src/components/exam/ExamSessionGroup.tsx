import type { ReactNode } from "react";

export function ExamSessionGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-largecards)] border border-mist bg-snow/60 p-4 md:p-5">
      <div className="mb-4 flex items-center border-b border-mist pb-4">
        <h3 className="font-display text-[24px] font-semibold text-ink">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
