type DailyChoiceBadgeTone = "default" | "selected" | "incorrect";

const toneClasses: Record<DailyChoiceBadgeTone, string> = {
  default: "border-[#D6E7FA] bg-[#F7FBFF] text-[#007AFF]",
  selected: "border-[#007AFF] bg-[#007AFF] text-white",
  incorrect: "border-[#FF2D55] bg-[#FF2D55] text-white",
};

export function DailyChoiceBadge({
  label,
  tone = "default",
}: {
  label: string;
  tone?: DailyChoiceBadgeTone;
}) {
  // Render circled numerals as full-size digits inside the badge's own circle.
  const displayLabel = label.normalize("NFKC");

  return (
    <span
      className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-sm font-semibold leading-none transition-colors ${toneClasses[tone]}`}
    >
      {displayLabel}
    </span>
  );
}
