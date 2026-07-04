import {
  SITE_NAME,
  SITE_PLATFORM,
  SITE_TAGLINE,
} from "@/lib/constants";
import { ElectricHighlight } from "@/components/ui/Typography";

type BrandLockupVariant = "hero" | "section" | "footer" | "compact" | "banner";

interface BrandLockupProps {
  variant?: BrandLockupVariant;
  className?: string;
  align?: "left" | "center";
}

export function BrandLockup({
  variant = "section",
  className = "",
  align = "left",
}: BrandLockupProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  if (variant === "hero") {
    return (
      <div className={`flex flex-col gap-4 ${alignClass} ${className}`}>
        <p className="font-system text-eyebrow font-semibold uppercase tracking-[0.08em] text-electric-blue">
          {SITE_PLATFORM}
        </p>
        <h1 className="font-display text-display font-semibold text-ink">
          질문은
          <br />
          <ElectricHighlight>봄기출</ElectricHighlight>이 작성합니다.
        </h1>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={`flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3 ${alignClass} ${className}`}
      >
        <span className="font-display text-body font-semibold text-ink">{SITE_NAME}</span>
        <span className="hidden h-4 w-px bg-mist sm:block" aria-hidden />
        <span className="font-display text-body-sm font-medium text-smoke">
          {SITE_TAGLINE}
        </span>
        <span className="hidden h-4 w-px bg-mist sm:block" aria-hidden />
        <span className="font-system text-eyebrow font-semibold uppercase tracking-[0.06em] text-electric-blue">
          {SITE_PLATFORM}
        </span>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={`flex flex-col gap-2 ${alignClass} ${className}`}>
        <p className="font-display text-subheading font-semibold text-ink">{SITE_NAME}</p>
        <p className="font-display text-body font-medium text-ink">{SITE_TAGLINE}</p>
        <p className="font-system text-eyebrow font-semibold uppercase tracking-[0.06em] text-electric-blue">
          {SITE_PLATFORM}
        </p>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <p className={`font-display text-body-sm text-smoke ${className}`}>
        <span className="font-semibold text-ink">{SITE_NAME}</span>
        <span className="mx-1.5 text-mist" aria-hidden>
          |
        </span>
        <span>{SITE_TAGLINE}</span>
      </p>
    );
  }

  // section
  return (
    <div className={`flex flex-col gap-2 ${alignClass} ${className}`}>
      <p className="font-system text-eyebrow font-semibold uppercase tracking-[0.06em] text-electric-blue">
        {SITE_PLATFORM}
      </p>
      <p className="font-display text-heading-sm font-semibold text-ink">
        {SITE_TAGLINE}
      </p>
    </div>
  );
}

/** 인라인 강조용 — 본문 속 슬로건 */
export function BrandTaglineInline({ className = "" }: { className?: string }) {
  return (
    <span className={`font-semibold text-ink ${className}`}>
      {SITE_TAGLINE}
    </span>
  );
}
