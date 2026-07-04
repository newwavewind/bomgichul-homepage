import {
  SITE_NAME,
  SITE_IDENTITY,
  SITE_PLATFORM,
  SITE_TAGLINE,
} from "@/lib/constants";
import { ElectricHighlight, HandCaption } from "@/components/ui/Typography";

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
      <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
        <HandCaption>Dear 공인중개사 수험생,</HandCaption>
        <p className="font-display text-eyebrow font-semibold text-electric-blue">
          {SITE_IDENTITY} · {SITE_PLATFORM}
        </p>
        <h1 className="font-display text-display font-semibold text-ink">
          질문은
          <br />
          <ElectricHighlight underline>봄기출</ElectricHighlight>이 작성합니다.
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
        <span className="hidden h-4 w-px bg-carbon/30 sm:block" aria-hidden />
        <span className="font-display text-body-sm font-semibold text-electric-blue">
          {SITE_IDENTITY}
        </span>
        <span className="hidden h-4 w-px bg-carbon/30 sm:block" aria-hidden />
        <span className="font-handwritten text-[1.15rem] font-semibold text-smoke">
          {SITE_TAGLINE}
        </span>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={`flex flex-col gap-2 ${alignClass} ${className}`}>
        <p className="font-display text-subheading font-semibold text-ink">{SITE_NAME}</p>
        <p className="font-display text-body font-medium text-electric-blue">
          {SITE_IDENTITY}
        </p>
        <p className="font-handwritten text-[1.35rem] font-semibold text-smoke">
          {SITE_TAGLINE}
        </p>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <p className={`font-display text-body-sm text-ink/80 ${className}`}>
        <span className="font-semibold">{SITE_NAME}</span>
        <span className="mx-1.5 text-carbon/40" aria-hidden>
          |
        </span>
        <span className="text-electric-blue">{SITE_IDENTITY}</span>
      </p>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${alignClass} ${className}`}>
      <HandCaption>{SITE_IDENTITY}</HandCaption>
      <p className="font-display text-heading-sm font-semibold text-ink">
        {SITE_TAGLINE}
      </p>
    </div>
  );
}

export function BrandTaglineInline({ className = "" }: { className?: string }) {
  return (
    <span className={`marker-underline ${className}`}>
      {SITE_TAGLINE}
    </span>
  );
}
