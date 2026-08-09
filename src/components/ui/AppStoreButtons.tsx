"use client";

import { APP_LINKS, type AppStoreLinks } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

interface AppStoreButtonsProps {
  className?: string;
  size?: "default" | "sm";
  /** 시험별 스토어 링크. 없으면 공인중개사(기본) */
  links?: AppStoreLinks;
}

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

/** Clean Google Play mark — no screenshot overlays */
function GooglePlayMark({ height = 40 }: { height?: number }) {
  const icon = height * 0.72;
  const textSize = height * 0.42;

  return (
    <span
      className="inline-flex items-center gap-2.5"
      style={{ height }}
    >
      <svg
        aria-hidden
        width={icon}
        height={icon}
        viewBox="0 0 24 24"
        className="shrink-0"
      >
        <path
          fill="#4285F4"
          d="M3 20.5V3.5c0-.59.34-1.11.84-1.35L13.69 12 3.84 21.85C3.34 21.6 3 21.09 3 20.5Z"
        />
        <path
          fill="#34A853"
          d="M6.05 2.66 16.81 8.88l-2.27 2.27L6.05 2.66Z"
        />
        <path
          fill="#FBBC04"
          d="M16.81 15.12 6.05 21.34l8.49-8.49 2.27 2.27Z"
        />
        <path
          fill="#EA4335"
          d="M20.16 10.81c.34.27.59.69.59 1.19s-.22.82-.57 1.09l-2.29 1.32-2.5-2.5 2.5-2.5 2.29 1.32Z"
        />
      </svg>
      <span
        className="font-sans font-medium leading-none text-[#5F6368]"
        style={{ fontSize: textSize }}
      >
        Google Play
      </span>
    </span>
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
    min-w-[168px] border border-carbon ${badgePadding[size]}
    font-display shadow-[var(--shadow-button)] transition-colors
    ${
      disabled
        ? "cursor-not-allowed bg-concrete/30 text-fog opacity-80"
        : "bg-paper text-ink hover:bg-snow"
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
      onClick={() => trackEvent("app_store_click", { store: "ios" })}
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
      className="inline-flex items-center rounded-[var(--radius-buttons)] border border-carbon bg-paper px-3.5 py-2 shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
      aria-label="Google Play에서 봄기출 앱 다운로드"
      onClick={() => trackEvent("app_store_click", { store: "android" })}
    >
      <GooglePlayMark height={logoHeight} />
    </a>
  );
}

export function AppStoreButtons({
  className = "",
  size = "default",
  links,
}: AppStoreButtonsProps) {
  const store = links ?? { android: APP_LINKS.android, ios: APP_LINKS.ios };
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <AppStoreBadge
        href={store.ios ?? undefined}
        disabled={!store.ios}
        size={size}
      />
      <GooglePlayBadge href={store.android} size={size} />
    </div>
  );
}
