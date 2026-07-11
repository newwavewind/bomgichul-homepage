export function CheckBadge({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[var(--radius-icons)] border border-carbon bg-electric-blue">
        <svg width="9" height="9" viewBox="0 0 8 8" fill="none">
          <path
            d="M1.5 4L3.5 6L6.5 2"
            stroke="#f8fafc"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="font-display text-body font-medium text-ink">{label}</span>
      {value && (
        <span className="font-display text-body font-semibold text-ink">{value}</span>
      )}
    </div>
  );
}

interface TagProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export function Tag({ children, active = false, className = "" }: TagProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-[var(--radius-tags)]
        border border-carbon px-4 py-1.5
        font-display text-body-sm font-medium
        ${active ? "bg-carbon text-paper" : "bg-paper text-ink"}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export function CategoryChip({
  label,
  color,
}: {
  label: string;
  color: "iris" | "leaf" | "magenta" | "electric";
}) {
  const colors = {
    iris: "bg-iris",
    leaf: "bg-leaf",
    magenta: "bg-magenta",
    electric: "bg-electric-blue",
  };

  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-[var(--radius-icons)] border border-carbon ${colors[color]}`} />
      <span className="font-display text-body-sm text-smoke">{label}</span>
    </span>
  );
}
