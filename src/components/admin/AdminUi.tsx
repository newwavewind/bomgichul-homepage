import {
  formatKstDateTime,
  formatKstDateTimeShort,
} from "@/lib/datetime";

export function formatDateTime(iso: string | null): string {
  return formatKstDateTime(iso);
}

export function formatDateTimeShort(iso: string | null): string {
  return formatKstDateTimeShort(iso);
}

export function AdminTable({
  headers,
  rows,
  mobilePrimaryIndex = 0,
}: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
  /** 모바일 카드에서 제목으로 쓸 열 인덱스 */
  mobilePrimaryIndex?: number;
}) {
  return (
    <>
      <div className="divide-y divide-mist/60 md:hidden">
        {rows.map((cells, i) => (
          <div key={i} className="px-4 py-3.5">
            <p className="font-display text-body-sm font-semibold text-ink">
              {cells[mobilePrimaryIndex]}
            </p>
            <dl className="mt-2.5 space-y-2">
              {headers.map((header, j) => {
                if (j === mobilePrimaryIndex) return null;
                const value = cells[j];
                if (value === "—" || value === "" || value == null) return null;
                return (
                  <div key={header} className="grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-0.5 text-[13px] leading-snug">
                    <dt className="font-display text-fog">{header}</dt>
                    <dd className="font-display break-all text-ink">{value}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] border-collapse font-display text-body-sm">
          <thead>
            <tr className="border-b border-mist text-left text-fog">
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((cells, i) => (
              <tr key={i} className="border-b border-mist/60 hover:bg-snow">
                {cells.map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-ink">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function AdminStatCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
}) {
  const card = (
    <div className="rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper px-4 py-3 shadow-[var(--shadow-card)] sm:px-5 sm:py-4">
      <p className="font-display text-[11px] font-medium uppercase tracking-wide text-fog sm:text-[12px]">
        {label}
      </p>
      <p className="mt-1.5 font-display text-heading-sm font-semibold text-ink sm:mt-2">{value}</p>
      {hint && (
        <p className="mt-1 font-display text-[11px] text-smoke sm:text-[12px]">{hint}</p>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block transition-opacity hover:opacity-90">
        {card}
      </a>
    );
  }

  return card;
}
