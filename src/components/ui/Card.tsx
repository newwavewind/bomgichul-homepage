interface FeatureCardProps {
  children: React.ReactNode;
  className?: string;
  tint?: "none" | "ice" | "lavender" | "blush" | "paper" | "snow";
}

const tintStyles = {
  none: "bg-surface",
  paper: "bg-paper",
  snow: "bg-snow",
  ice: "bg-ice",
  lavender: "bg-lavender",
  blush: "bg-blush",
};

export function FeatureCard({ children, className = "", tint = "none" }: FeatureCardProps) {
  return (
    <div
      className={`
        rounded-[var(--radius-cards)] border-[1.5px] border-carbon/90
        p-[var(--card-padding)] shadow-[var(--shadow-card)]
        ${tintStyles[tint]} ${className}
      `}
    >
      {children}
    </div>
  );
}

export function ElevatedCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`
        rounded-[var(--radius-cards)] border-[1.5px] border-carbon
        bg-paper shadow-[var(--shadow-card)] ${className}
      `}
    >
      {children}
    </div>
  );
}

export function LargePanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`
        rounded-[var(--radius-largecards)] border-[1.5px] border-carbon
        bg-surface px-8 py-16 shadow-[var(--shadow-card)]
        md:px-12 md:py-20 ${className}
      `}
    >
      {children}
    </div>
  );
}

export function TintedAccentCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`
        rounded-[var(--radius-largecards)] border-[1.5px] border-carbon
        bg-ice p-8 shadow-[var(--shadow-card)] md:p-12 ${className}
      `}
    >
      {children}
    </div>
  );
}

export function Divider() {
  return <hr className="border-0 border-t border-mist" />;
}
