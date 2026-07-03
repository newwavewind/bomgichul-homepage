import Image from "next/image";
import { APP_LINKS } from "@/lib/constants";

interface AppStoreButtonsProps {
  className?: string;
  size?: "default" | "sm";
}

const GOOGLE_PLAY_LOGO = {
  src: "/brand/google-play-logo.png",
  width: 190,
  height: 56,
} as const;

function AppleIcon({ className = "shrink-0" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

const badgePadding = {
  default: "px-4 py-2.5",
  sm: "px-3.5 py-2",
};

function AppStoreBadge({
  href,
  disabled,
  size,
}: {
  href?: string;
  disabled?: boolean;
  size: "default" | "sm";
}) {
  const styles = `
    inline-flex items-center gap-3 rounded-[var(--radius-buttons)]
    min-w-[168px] ${badgePadding[size]} font-display shadow-[var(--shadow-button)]
    transition-opacity
    ${
      disabled
        ? "cursor-not-allowed bg-concrete/40 text-fog opacity-80"
        : "bg-midnight text-paper hover:opacity-90"
    }
  `;

  const content = (
    <>
      <AppleIcon />
      <span className="text-left leading-tight">
        <span className="block text-[10px] font-medium tracking-wide opacity-80">
          Download on the
        </span>
        <span className="block text-body-sm font-semibold">
          {disabled ? "출시 예정" : "App Store"}
        </span>
      </span>
    </>
  );

  if (disabled || !href) {
    return (
      <span className={styles} aria-disabled="true">
        {content}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles}
      aria-label="App Store에서 봄기출 앱 다운로드"
    >
      {content}
    </a>
  );
}

function GooglePlayBadge({
  href,
  size,
}: {
  href: string;
  size: "default" | "sm";
}) {
  const logoHeight = size === "sm" ? 32 : 40;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block transition-opacity hover:opacity-90"
      aria-label="Google Play에서 봄기출 앱 다운로드"
    >
      <Image
        src={GOOGLE_PLAY_LOGO.src}
        alt="Google Play"
        width={GOOGLE_PLAY_LOGO.width}
        height={GOOGLE_PLAY_LOGO.height}
        className="h-auto w-auto"
        style={{ height: logoHeight }}
        priority={false}
      />
    </a>
  );
}

export function AppStoreButtons({
  className = "",
  size = "default",
}: AppStoreButtonsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <AppStoreBadge
        href={APP_LINKS.ios ?? undefined}
        disabled={!APP_LINKS.ios}
        size={size}
      />
      <GooglePlayBadge href={APP_LINKS.android} size={size} />
    </div>
  );
}
