import Link from "next/link";

interface PrimaryButtonProps {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "nav";
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

  if (href) {
    return <Link href={href} className={styles}>{children}</Link>;
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={styles}>
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

  if (href) {
    return <Link href={href} className={styles}>{children}</Link>;
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={styles}>
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
}

export function OutlineButton({
  href,
  onClick,
  children,
  className = "",
  active = false,
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

  if (href) {
    return <Link href={href} className={styles}>{children}</Link>;
  }

  return (
    <button type="button" onClick={onClick} className={styles}>
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
