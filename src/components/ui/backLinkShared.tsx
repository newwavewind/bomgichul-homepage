export function NavigationChevron({ direction, size = 16 }: { direction: "left" | "right"; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"
      stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
      <path d={direction === "left" ? "M16 5L8 12L16 19" : "M8 5L16 12L8 19"} />
    </svg>
  );
}

export function BackLinkChevron() {
  return (
    <span
      aria-hidden
      className="inline-grid size-11 shrink-0 place-items-center rounded-full border border-ios-blue/25 bg-ios-blue/[0.12] text-ios-blue shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] transition-[background-color,border-color,transform] group-hover:border-ios-blue/40 group-hover:bg-ios-blue/[0.18] group-active:scale-[0.96]"
    >
      <NavigationChevron direction="left" />
    </span>
  );
}

export function backLinkClass(emphasized: boolean) {
  return emphasized
    ? "group mb-5 inline-flex items-center gap-2.5 font-display text-body-sm font-semibold text-ios-blue transition-colors hover:opacity-80"
    : "group mb-5 inline-flex items-center gap-2.5 font-display text-body-sm font-medium text-smoke transition-colors hover:text-ios-blue";
}
