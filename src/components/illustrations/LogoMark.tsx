"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";

const BETA_HINT =
  "지금은 베타 버전이에요. 다듬는 중이라 아직 미완인 부분이 있지만, 업데이트는 계속됩니다.";

export function LogoMark() {
  const [open, setOpen] = useState(false);
  const tipId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="flex items-center gap-2">
      <Link href="/study" className="transition-opacity hover:opacity-80">
        <span className="font-display text-body font-semibold text-ink">
          봄기출 공인중개사
        </span>
      </Link>

      <div ref={wrapRef} className="group relative">
        <button
          type="button"
          aria-describedby={tipId}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-5 items-center rounded-full border border-ios-blue/30 bg-ios-blue/[0.1] px-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.06em] text-ios-blue transition-colors hover:border-ios-blue/45 hover:bg-ios-blue/[0.16]"
        >
          Beta
        </button>

        <p
          id={tipId}
          role="tooltip"
          className={`pointer-events-none absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[min(16.5rem,calc(100vw-2.5rem))] rounded-[var(--radius-cards)] border border-carbon/10 bg-carbon px-3 py-2.5 font-display text-[12px] font-medium leading-relaxed text-paper shadow-[var(--shadow-card)] transition-[opacity,transform] duration-150 ${
            open
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-0.5 opacity-0 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
          }`}
        >
          {BETA_HINT}
          <span
            aria-hidden
            className="absolute -top-1.5 left-3 size-3 rotate-45 border-l border-t border-carbon/10 bg-carbon"
          />
        </p>
      </div>
    </div>
  );
}
