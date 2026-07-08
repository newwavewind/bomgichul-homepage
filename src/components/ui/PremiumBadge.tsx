export function PremiumBadge({ label }: { label: string }) {
  const isFull = label === "전과목 인증";
  const isRoundComplete = label.includes("전과목 인증");

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 font-display text-[10px] font-bold ${
        isFull
          ? "bg-[#6366f1] text-paper"
          : isRoundComplete
            ? "border border-[#6366f1] text-[#6366f1]"
            : "border border-carbon text-ink"
      }`}
    >
      {label}
    </span>
  );
}
