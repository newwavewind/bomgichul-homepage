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
          ? "group mb-5 inline-flex items-center gap-2.5 font-display text-body-sm font-semibold text-ios-blue transition-colors hover:opacity-80"
          : "group mb-5 inline-flex items-center gap-2.5 font-display text-body-sm font-medium text-smoke transition-colors hover:text-ios-blue"
      }
    >
      <span
        aria-hidden
        className="inline-grid size-8 shrink-0 place-items-center rounded-full border border-ios-blue/25 bg-ios-blue/[0.12] text-ios-blue shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] transition-[background-color,border-color,transform] group-hover:border-ios-blue/40 group-hover:bg-ios-blue/[0.18] group-active:scale-[0.96]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </span>
      <span className="underline-offset-4 group-hover:underline">{children}</span>
    </Link>
  );
}
