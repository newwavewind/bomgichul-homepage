export function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}) {
  return (
    <div className="overflow-x-auto">
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
    <div className="rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper px-5 py-4 shadow-[var(--shadow-card)]">
      <p className="font-display text-[12px] font-medium uppercase tracking-wide text-fog">
        {label}
      </p>
      <p className="mt-2 font-display text-heading-sm font-semibold text-ink">{value}</p>
      {hint && <p className="mt-1 font-display text-[12px] text-smoke">{hint}</p>}
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
