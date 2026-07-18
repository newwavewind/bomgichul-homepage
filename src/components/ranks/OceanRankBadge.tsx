import Image from "next/image";
import type { OceanRank } from "@/lib/ocean-ranks";

type OceanRankBadgeProps = {
  rank: OceanRank;
  size?: "sm" | "md";
  /** icon: 헤더용 — 동물 아이콘만 표시 */
  variant?: "full" | "icon";
  className?: string;
};

export function OceanRankBadge({
  rank,
  size = "sm",
  variant = "full",
  className = "",
}: OceanRankBadgeProps) {
  const medium = size === "md";
  const iconOnly = variant === "icon";

  return (
    <span
      className={`inline-flex shrink-0 items-center text-[#155e75] ${
        medium ? "gap-1.5" : "gap-1"
      } ${className}`}
      aria-label={`나의 바다 레벨: Lv.${rank.level} ${rank.name}`}
      title={`Lv.${rank.level} ${rank.name}`}
    >
      <span
        className={`relative shrink-0 ${
          iconOnly
            ? medium
              ? "h-8 w-8"
              : "h-6 w-6"
            : medium
              ? "h-10 w-10"
              : "h-7 w-7"
        }`}
      >
        <Image
          src={rank.image}
          alt=""
          fill
          sizes={
            iconOnly
              ? medium
                ? "32px"
                : "24px"
              : medium
                ? "36px"
                : "24px"
          }
          className="object-contain"
        />
      </span>
      {!iconOnly ? (
        <span
          className={`whitespace-nowrap rounded-full border border-[#b8dce4] bg-[#f0fbfd] font-display font-semibold leading-none shadow-[0_1px_2px_rgba(15,23,42,0.05)] ${
            medium ? "px-2.5 py-1.5 text-[13px]" : "px-2 py-1 text-[10px]"
          }`}
        >
          Lv.{rank.level} {rank.name}
        </span>
      ) : null}
    </span>
  );
}
