"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/illustrations/LogoMark";
import { OceanRankBadge } from "@/components/ranks/OceanRankBadge";
import {
  isCommunitySectionPath,
  resolveNavContext,
  type TrackNavContext,
} from "@/lib/exam-track/nav";
import { communityBaseHref } from "@/lib/exam-track/community";
import type { OceanRank } from "@/lib/ocean-ranks";

/** 아래로 스크롤하면 숨기고, 위로 올리면 다시 보이게 */
function useHideHeaderOnScroll() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    setHidden(false);
    lastY.current = window.scrollY;
  }, [pathname]);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (y < 24) {
        setHidden(false);
      } else if (delta > 8) {
        setHidden(true);
      } else if (delta < -8) {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}

interface HeaderNavProps {
  user?: {
    id: string;
    nickname: string;
    usernameSet: boolean;
    isAdmin?: boolean;
    oceanRank?: OceanRank | null;
  } | null;
  unreadCount?: number;
}

function AccountCluster({
  user,
  unread,
  compact = false,
}: {
  user: HeaderNavProps["user"];
  unread: number;
  compact?: boolean;
}) {
  if (!user) {
    return (
      <div className={`flex items-center ${compact ? "gap-1.5" : "gap-2"}`}>
        <Link
          href="/login"
          className="rounded-full px-3 py-1.5 font-display text-[13px] font-medium text-slate-600 transition-colors hover:bg-white/70 hover:text-ink"
        >
          로그인
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-[#007AFF] px-3.5 py-1.5 font-display text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,122,255,0.35)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          가입
        </Link>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${compact ? "gap-1" : "gap-1.5"}`}>
      {user.isAdmin ? (
        <Link
          href="/admin"
          className="rounded-full px-2.5 py-1.5 font-display text-[12px] font-medium text-slate-500 hover:bg-white/70"
        >
          관리
        </Link>
      ) : null}
      <Link
        href="/notifications"
        className="relative flex size-9 items-center justify-center rounded-full bg-white/80 font-display text-[15px] text-ink shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] transition-colors hover:bg-white"
        aria-label="알림"
      >
        <span aria-hidden>🔔</span>
        {unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ef4444] px-1 font-display text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </Link>
      <Link
        href={user.usernameSet ? "/profile" : "/onboarding"}
        className="flex max-w-[7.5rem] items-center gap-1 truncate rounded-full bg-white/80 px-2.5 py-1.5 font-display text-[13px] font-medium text-ink shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] hover:bg-white"
      >
        <span className="truncate">
          {user.usernameSet ? user.nickname : "아이디"}
        </span>
        {user.usernameSet && user.oceanRank ? (
          <OceanRankBadge rank={user.oceanRank} variant="icon" />
        ) : null}
      </Link>
    </div>
  );
}

function HomeHeader({
  user,
  unread,
}: {
  user: HeaderNavProps["user"];
  unread: number;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const hidden = useHideHeaderOnScroll();

  return (
    <header
      className={`sticky top-0 z-50 border-b border-slate-200/80 bg-[#F7FAFC]/90 backdrop-blur-xl transition-transform duration-300 ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex max-w-[var(--page-max-width)] items-center justify-between gap-3 px-4 py-3">
        <LogoMark />
        <div className="hidden items-center gap-2 md:flex">
          <AccountCluster user={user} unread={unread} />
        </div>
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full bg-white text-ink shadow-[inset_0_0_0_1px_rgba(15,23,42,0.08)] md:hidden"
          aria-label="계정 메뉴"
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen((v) => !v)}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
          >
            <path
              d="M3 5H17M3 10H17M3 15H17"
              stroke="#007AFF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {moreOpen ? (
        <div className="border-t border-slate-200/80 bg-white px-4 py-3 md:hidden">
          <AccountCluster user={user} unread={unread} />
          {user ? (
            <form action="/auth/signout" method="post" className="mt-2">
              <button
                type="submit"
                className="w-full rounded-xl px-3 py-2 text-left font-display text-[13px] text-slate-500"
              >
                로그아웃
              </button>
            </form>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}

function TrackHeader({
  ctx,
  user,
  unread,
}: {
  ctx: TrackNavContext;
  user: HeaderNavProps["user"];
  unread: number;
}) {
  const pathname = usePathname();
  const hidden = useHideHeaderOnScroll();

  return (
    <header
      className={`sticky top-0 z-50 transition-transform duration-300 ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="border-b border-white/40 bg-gradient-to-b from-[#E8F1FF] via-[#F3F8FF] to-[#F8FAFC]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-[var(--page-max-width)] px-3 pt-3 sm:px-4">
          <div className="flex items-center gap-1.5 pb-2.5 sm:gap-2">
            <LogoMark />

            <nav
              className="flex min-w-0 flex-1 items-center justify-start gap-0.5 overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-1 sm:px-3 [&::-webkit-scrollbar]:hidden"
              aria-label="바로가기"
            >
              {ctx.tools.map((tool) => {
                const communityHref = communityBaseHref(ctx.scope);
                const active =
                  tool.href === communityHref
                    ? isCommunitySectionPath(pathname, ctx.scope)
                    : pathname === tool.href ||
                      (tool.href !== ctx.hubHref &&
                        pathname.startsWith(tool.href));
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`shrink-0 rounded-lg px-2 py-1.5 font-display text-[13px] font-medium transition-colors sm:px-2.5 ${
                      active
                        ? "bg-[#007AFF]/12 text-[#0066D6]"
                        : "text-slate-600 hover:bg-white/70 hover:text-ink"
                    }`}
                  >
                    {tool.label}
                  </Link>
                );
              })}
            </nav>

            <div className="shrink-0">
              <AccountCluster user={user} unread={unread} compact />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function HeaderNav({ user, unreadCount = 0 }: HeaderNavProps) {
  const pathname = usePathname();
  const ctx = resolveNavContext(pathname);
  const [unread, setUnread] = useState(unreadCount);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    const controller = new AbortController();

    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/notifications/unread-count", {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) return;
        const json = (await res.json()) as { unreadCount?: number };
        if (!cancelled && typeof json.unreadCount === "number") {
          setUnread(json.unreadCount);
        }
      } catch {
        // ignore
      }
    };

    void fetchUnread();
    const intervalId = window.setInterval(fetchUnread, 30_000);
    window.addEventListener("focus", fetchUnread);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", fetchUnread);
      controller.abort();
    };
  }, [user]);

  if (ctx.mode === "home") {
    return <HomeHeader user={user} unread={unread} />;
  }

  return <TrackHeader ctx={ctx} user={user} unread={unread} />;
}
