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
          ? "group mb-5 inline-flex items-center gap-2.5 font-display text-body-sm font-semibold text-electric-blue transition-colors hover:text-burnt"
          : "group mb-5 inline-flex items-center gap-2.5 font-display text-body-sm font-medium text-smoke transition-colors hover:text-ink"
      }
    >
      <span
        aria-hidden
        className={
          emphasized
            ? "inline-grid size-8 shrink-0 place-items-center rounded-full border-[1.5px] border-electric-blue/40 bg-paper text-electric-blue transition-colors group-hover:border-electric-blue group-hover:bg-ice"
            : "inline-grid size-8 shrink-0 place-items-center rounded-full border-[1.5px] border-carbon bg-paper text-ink transition-colors group-hover:bg-snow"
        }
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </span>
      <span className="underline-offset-4 group-hover:underline">{children}</span>
    </Link>
  );
}
