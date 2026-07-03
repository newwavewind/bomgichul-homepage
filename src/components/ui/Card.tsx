interface FeatureCardProps {
  children: React.ReactNode;
  className?: string;
  tint?: "none" | "ice" | "lavender" | "blush" | "paper";
}

const tintStyles = {
  none: "bg-surface",
  paper: "bg-paper",
  ice: "bg-[rgba(0,152,242,0.16)]",
  lavender: "bg-lavender/60",
  blush: "bg-blush/60",
};

export function FeatureCard({ children, className = "", tint = "none" }: FeatureCardProps) {
  return (
    <div
      className={`rounded-[var(--radius-cards)] p-[var(--card-padding)] ${tintStyles[tint]} ${className}`}
    >
      {children}
    </div>
  );
}

export function ElevatedCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[var(--radius-images)] bg-paper shadow-[var(--shadow-elevated)] ${className}`}
    >
      {children}
    </div>
  );
}

export function LargePanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[var(--radius-largecards)] bg-surface px-12 py-24 md:px-[48px] md:py-[96px] ${className}`}
    >
      {children}
    </div>
  );
}

export function TintedAccentCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[var(--radius-cards)] bg-[rgba(0,152,242,0.16)] p-[var(--card-padding)] ${className}`}>
      {children}
    </div>
  );
}

export function Divider() {
  return <hr className="border-0 border-t border-mist" />;
}
