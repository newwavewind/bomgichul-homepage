interface EyebrowLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function EyebrowLabel({ children, className = "" }: EyebrowLabelProps) {
  return (
    <p className={`font-display text-eyebrow font-semibold text-electric-blue ${className}`}>
      {children}
    </p>
  );
}

/** Handwritten caption in marker orange */
export function HandCaption({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={`hand-caption ${className}`}>{children}</p>;
}

interface DisplayHeadlineProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function DisplayHeadline({
  children,
  className = "",
  as: Tag = "h1",
}: DisplayHeadlineProps) {
  return (
    <Tag className={`font-display text-display font-semibold text-ink ${className}`}>
      {children}
    </Tag>
  );
}

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function SectionHeading({
  children,
  className = "",
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <Tag className={`font-display text-heading font-semibold text-ink ${className}`}>
      {children}
    </Tag>
  );
}

interface ElectricHighlightProps {
  children: React.ReactNode;
  underline?: boolean;
}

/** Marker orange emphasis — optional hand-drawn underline */
export function ElectricHighlight({
  children,
  underline = false,
}: ElectricHighlightProps) {
  return (
    <span className={underline ? "marker-underline" : "font-semibold text-electric-blue"}>
      {children}
    </span>
  );
}
