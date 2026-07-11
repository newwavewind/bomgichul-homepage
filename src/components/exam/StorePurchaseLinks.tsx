import { APP_LINKS } from "@/lib/constants";

/** 모바일 앱 스토어 구매 링크 (PC앱 URL이 아님) */
export function StorePurchaseLinks({
  className = "",
  size = "default",
}: {
  className?: string;
  size?: "default" | "sm";
}) {
  const btnClass =
    size === "sm"
      ? "inline-flex items-center rounded-[var(--radius-buttons)] border border-mist bg-paper px-3 py-1 font-display text-[12px] font-medium text-ink hover:bg-snow"
      : "inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border border-carbon bg-paper px-4 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow";

  return (
    <span className={`inline-flex flex-wrap gap-2 ${className}`}>
      <a href={APP_LINKS.android} className={btnClass}>
        Google Play
      </a>
      <a href={APP_LINKS.ios} className={btnClass}>
        App Store
      </a>
    </span>
  );
}
