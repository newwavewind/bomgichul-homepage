import Link from "next/link";

export function BackLink({
  href,
  children,
  emphasized = false,
}: {
  href: string;
  children: React.ReactNode;
  /** 개념 복귀 등 눈에 띄게 강조할 때 */
  emphasized?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        emphasized
          ? "group mb-4 inline-flex items-center gap-1.5 rounded-[var(--radius-buttons)] border border-electric-blue/30 bg-ice px-3.5 py-2 font-display text-body-sm font-semibold text-electric-blue transition-colors hover:border-electric-blue/50 hover:bg-ice/80"
          : "group -ml-3 mb-4 inline-flex items-center gap-1.5 rounded-[var(--radius-buttons)] border border-transparent px-3 py-1.5 font-display text-body-sm font-medium text-smoke transition-colors hover:border-mist hover:bg-snow hover:text-ink"
      }
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="shrink-0 transition-transform group-hover:-translate-x-0.5"
      >
        <path
          d="M8.5 3L4.5 7L8.5 11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </Link>
  );
}
