"use client";

import { useRouter } from "next/navigation";
import { BackLinkChevron, backLinkClass } from "@/components/ui/backLinkShared";

/**
 * Next 클라이언트 이동 뒤에도 「바로 전 화면」으로 돌아가게 한다.
 * document.referrer 만 보면 SPA 이동을 놓친다.
 */
function canUseHistoryBack(): boolean {
  if (typeof window === "undefined") return false;

  const navigation = (
    window as Window & { navigation?: { canGoBack?: boolean } }
  ).navigation;
  if (typeof navigation?.canGoBack === "boolean") {
    return navigation.canGoBack;
  }

  const idx = (window.history.state as { idx?: number } | null)?.idx;
  if (typeof idx === "number") {
    return idx > 0;
  }

  try {
    const ref = document.referrer;
    if (ref && new URL(ref).origin === window.location.origin) {
      return true;
    }
  } catch {
    /* ignore */
  }

  return window.history.length > 1;
}

/** 같은 세션에서 온 경우 history.back, 아니면 fallback href. */
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
