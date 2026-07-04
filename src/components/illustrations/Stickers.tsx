/** Decorative sticker illustrations — DESIGN.md personality accents only */

function Bolt({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="40" height="48" viewBox="0 0 40 48" fill="none" aria-hidden>
      <path
        d="M22 2L6 26h12l-4 20L34 18H20l2-16z"
        fill="#0f766e"
        stroke="#0f172a"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Heart({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="44" height="40" viewBox="0 0 44 40" fill="none" aria-hidden>
      <path
        d="M22 36S4 24 4 14a9 9 0 0 1 18-2 9 9 0 0 1 18 2c0 10-18 22-18 22Z"
        fill="#475569"
        stroke="#0f172a"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="14" r="1.5" fill="#0f172a" />
      <circle cx="28" cy="14" r="1.5" fill="#0f172a" />
    </svg>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <path
        d="M18 2l3.5 12.5L34 18l-12.5 3.5L18 34l-3.5-12.5L2 18l12.5-3.5L18 2z"
        fill="#334155"
        stroke="#0f172a"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Ghost({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="40" height="44" viewBox="0 0 40 44" fill="none" aria-hidden>
      <path
        d="M20 2c9 0 16 7 16 16v20l-5-3-5 3-6-3-6 3-5-3-5 3V18C4 9 11 2 20 2Z"
        fill="#f8fafc"
        stroke="#0f172a"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="18" r="2" fill="#171717" />
      <circle cx="26" cy="18" r="2" fill="#171717" />
    </svg>
  );
}

export function StickerCluster({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="sticker-float absolute left-[4%] top-[8%]" style={{ ["--sticker-rot" as string]: "-12deg" }}>
        <Bolt />
      </div>
      <div className="sticker-float absolute right-[6%] top-[18%]" style={{ ["--sticker-rot" as string]: "10deg", animationDelay: "0.6s" }}>
        <Heart />
      </div>
      <div className="sticker-float absolute bottom-[12%] left-[10%]" style={{ ["--sticker-rot" as string]: "8deg", animationDelay: "1.2s" }}>
        <Sparkle />
      </div>
      <div className="sticker-float absolute bottom-[20%] right-[8%]" style={{ ["--sticker-rot" as string]: "-6deg", animationDelay: "0.3s" }}>
        <Ghost />
      </div>
    </div>
  );
}

export function FloatingStickers({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none relative ${className}`} aria-hidden>
      <div className="absolute -left-4 -top-6 rotate-[-12deg] md:-left-8">
        <Bolt />
      </div>
      <div className="absolute -right-2 top-8 rotate-[14deg] md:-right-6">
        <Heart />
      </div>
      <div className="absolute -bottom-4 left-1/3 rotate-[8deg]">
        <Sparkle />
      </div>
    </div>
  );
}
