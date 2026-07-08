export function CorrectAnswerBadge({
  visible = true,
  className = "",
}: {
  visible?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-[#6366f1] px-2 py-0.5 font-display text-[11px] font-bold leading-none tracking-wide text-paper ${
        visible ? "visible" : "invisible"
      } ${className}`}
    >
      정답
    </span>
  );
}
