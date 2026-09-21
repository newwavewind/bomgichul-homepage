"use client";

import { useRouter } from "next/navigation";
import { BackLinkChevron, backLinkClass } from "@/components/ui/backLinkShared";

function canUseHistoryBack(): boolean {
  if (typeof window === "undefined") return false;
  const ref = document.referrer;
  if (!ref) return false;
  try {
    return new URL(ref).origin === window.location.origin;
  } catch {
    return false;
  }
}

/** 같은 사이트에서 온 경우 history.back, 아니면 fallback href. */
export function HistoryBackLink({
  href,
  children,
  emphasized = false,
}: {
  href: string;
  children: React.ReactNode;
  emphasized?: boolean;
}) {
  const router = useRouter();

  return (
    <a
      href={href}
      className={backLinkClass(emphasized)}
      onClick={(event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        if (!canUseHistoryBack()) return;
        event.preventDefault();
        router.back();
      }}
    >
      <BackLinkChevron />
      <span className="underline-offset-4 group-hover:underline">{children}</span>
    </a>
  );
}
