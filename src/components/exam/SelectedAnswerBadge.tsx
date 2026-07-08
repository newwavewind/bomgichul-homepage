export function SelectedAnswerBadge({
  correct,
  className = "",
}: {
  correct: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 font-display text-[11px] font-bold leading-none tracking-wide text-paper ${
        correct ? "bg-[#6366f1]" : "bg-[#ef4444]"
      } ${className}`}
    >
      {correct ? "✓ 내 선택" : "✕ 내 선택"}
    </span>
  );
}
