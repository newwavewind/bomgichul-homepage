"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

type EventParams = Record<string, string | number | boolean>;

function useTrackedClick(event?: string, eventParams?: EventParams, onClick?: () => void) {
  return () => {
    if (event) trackEvent(event, eventParams);
    onClick?.();
  };
}

interface PrimaryButtonProps {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "nav";
  event?: string;
  eventParams?: EventParams;
}

const sizeStyles = {
  default: "px-7 py-2.5",
  sm: "px-5 py-2",
  nav: "px-5 py-2",
};

/** Pill action — cream fill, charcoal border (DESIGN.md primary language) */
export function PrimaryButton({
  href,
  onClick,
  type = "button",
  disabled,
  children,
  className = "",
  size = "default",
  event,
  eventParams,
}: PrimaryButtonProps) {
  const styles = `
    inline-flex items-center justify-center gap-2
    rounded-[var(--radius-buttons)] border-[1.5px] border-carbon
    bg-paper ${sizeStyles[size]} font-display text-body-sm font-medium text-ink
    shadow-[var(--shadow-button)]
    transition-colors hover:bg-snow
    disabled:cursor-not-allowed disabled:opacity-50
    ${className}
  `;
  const handleClick = useTrackedClick(event, eventParams, onClick);

  if (href) {
    return <Link href={href} className={styles} onClick={handleClick}>{children}</Link>;
  }

  return (
    <button type={type} onClick={handleClick} disabled={disabled} className={styles}>
      {children}
    </button>
  );
}

/** Filled charcoal — secondary emphasis from current system */
export function SecondaryButton({
  href,
  onClick,
  type = "button",
  disabled,
  children,
  className = "",
  event,
  eventParams,
}: Omit<PrimaryButtonProps, "size">) {
  const styles = `
    inline-flex items-center justify-center gap-2
    rounded-[var(--radius-buttons)] border-[1.5px] border-carbon
    bg-carbon px-5 py-2 font-display text-body-sm font-medium text-paper
    shadow-[var(--shadow-button)]
    transition-opacity hover:opacity-90
    disabled:cursor-not-allowed disabled:opacity-50
    ${className}
  `;
  const handleClick = useTrackedClick(event, eventParams, onClick);

  if (href) {
    return <Link href={href} className={styles} onClick={handleClick}>{children}</Link>;
  }

  return (
    <button type={type} onClick={handleClick} disabled={disabled} className={styles}>
      {children}
    </button>
  );
}

interface OutlineButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  event?: string;
  eventParams?: EventParams;
}

export function OutlineButton({
  href,
  onClick,
  children,
  className = "",
  active = false,
  event,
  eventParams,
}: OutlineButtonProps) {
  const styles = `
    inline-flex items-center justify-center
    rounded-[var(--radius-buttons)] px-3.5 py-2
    font-display text-body-sm font-medium text-ink
    transition-colors
    ${
      active
        ? "border-[1.5px] border-carbon bg-snow"
        : "border border-transparent hover:border-mist hover:bg-snow"
    }
    ${className}
  `;
  const handleClick = useTrackedClick(event, eventParams, onClick);

  if (href) {
    const external = /^https?:\/\//.test(href);
    if (external) {
      return (
        <a href={href} className={styles} onClick={handleClick}>
          {children}
        </a>
      );
    }
    return <Link href={href} className={styles} onClick={handleClick}>{children}</Link>;
  }

  return (
    <button type="button" onClick={handleClick} className={styles}>
      {children}
    </button>
  );
}

export function TextButton({
  onClick,
  children,
  className = "",
  type = "button",
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`font-display text-body-sm font-medium text-fog transition-colors hover:text-ink ${className}`}
    >
      {children}
    </button>
  );
}
