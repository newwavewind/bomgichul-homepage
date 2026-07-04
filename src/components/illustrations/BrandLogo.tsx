import Image from "next/image";
import { SITE_NAME } from "@/lib/constants";

export const BRAND_LOGO_SRC = "/brand/logo.png";

const sizes = {
  xs: 24,
  sm: 36,
  header: 56,
  md: 64,
  lg: 120,
  hero: 140,
} as const;

interface BrandLogoProps {
  size?: keyof typeof sizes;
  className?: string;
  priority?: boolean;
  /** 크림 프레임으로 흰 배경 이질감 완화 */
  framed?: boolean;
}

export function BrandLogo({
  size = "sm",
  className = "",
  priority = false,
  framed = false,
}: BrandLogoProps) {
  const px = sizes[size];
  const responsive =
    size === "hero"
      ? "h-[112px] w-[112px] md:h-[140px] md:w-[140px]"
      : "";

  const image = (
    <Image
      src={BRAND_LOGO_SRC}
      alt={`${SITE_NAME} 로고`}
      width={px}
      height={px}
      priority={priority}
      className={`select-none object-contain ${responsive || "h-auto w-auto"} ${framed ? "" : className}`}
      style={size === "hero" ? undefined : { width: px, height: px }}
    />
  );

  if (!framed) return image;

  return (
    <div
      className={`inline-flex items-center justify-center rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-snow p-2 shadow-[var(--shadow-card)] ${className}`}
    >
      {image}
    </div>
  );
}
