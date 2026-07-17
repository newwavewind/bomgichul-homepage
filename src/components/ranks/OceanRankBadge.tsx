import Image from "next/image";
import type { OceanRank } from "@/lib/ocean-ranks";

type OceanRankBadgeProps = {
  rank: OceanRank;
  size?: "sm" | "md";
  className?: string;
};

export function OceanRankBadge({
  rank,
  size = "sm",
  className = "",
}: OceanRankBadgeProps) {
  const medium = size === "md";

  return (
    <span
      className={`inline-flex shrink-0 items-center text-[#155e75] ${
        medium ? "gap-1.5" : "gap-1"
      } ${className}`}
      aria-label={`레벨 ${rank.level} ${rank.name}`}
    >
      <span
        className={`relative shrink-0 ${
          medium ? "h-10 w-10" : "h-7 w-7"
        }`}
      >
        <Image
          src={rank.image}
          alt=""
          fill
          sizes={medium ? "36px" : "24px"}
          className="object-contain"
        />
      </span>
      <span
        className={`whitespace-nowrap rounded-full border border-[#b8dce4] bg-[#f0fbfd] font-display font-semibold leading-none shadow-[0_1px_2px_rgba(15,23,42,0.05)] ${
          medium ? "px-2.5 py-1.5 text-[13px]" : "px-2 py-1 text-[10px]"
        }`}
      >
        Lv.{rank.level} {rank.name}
      </span>
    </span>
  );
}
