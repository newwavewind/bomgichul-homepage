"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/illustrations/LogoMark";
import { PrimaryButton, OutlineButton, TextButton } from "@/components/ui/Button";
import { NAV_LINKS } from "@/lib/constants";

interface HeaderNavProps {
  user?: {
    id: string;
    nickname: string;
    usernameSet: boolean;
    isAdmin?: boolean;
  } | null;
  unreadCount?: number;
}

function NotificationBell({ unreadCount }: { unreadCount: number }) {
  return (
    <OutlineButton href="/notifications" className="relative">
      🔔
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ef4444] font-display text-[10px] font-bold text-paper">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </OutlineButton>
  );
}

function NavLink({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <OutlineButton href={href} className={className}>
      {label}
    </OutlineButton>
  );
}

export function HeaderNav({ user, unreadCount = 0 }: HeaderNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unread, setUnread] = useState(unreadCount);

  useEffect(() => {
    if (!user) {
      setUnread(0);
      return;
    }

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
        // Ignore transient fetch errors to avoid breaking navigation.
      }
    };

    void fetchUnread();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [user]);

  return (
    <header className="sticky top-0 z-50 px-4 py-4">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="flex items-center justify-between gap-3 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-paper px-3 py-2 shadow-[var(--shadow-button)] md:px-4">
          <LogoMark />

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                {user.isAdmin && (
                  <OutlineButton href="/admin">관리자</OutlineButton>
                )}
                <NotificationBell unreadCount={unread} />
                <OutlineButton href={user.usernameSet ? "/profile" : "/onboarding"}>
                  {user.usernameSet ? user.nickname : "아이디 설정"}
                </OutlineButton>
                <form action="/auth/signout" method="post">
                  <TextButton type="submit">로그아웃</TextButton>
                </form>
              </>
            ) : (
              <OutlineButton href="/login">로그인</OutlineButton>
            )}
            <PrimaryButton href="/community/write" size="nav">
              글쓰기
            </PrimaryButton>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-buttons)] border border-mist md:hidden"
            aria-label="메뉴"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5H17M3 10H17M3 15H17" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="mt-2 rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper p-4 shadow-[var(--shadow-card)] md:hidden">
            <nav className="flex flex-col gap-1" onClick={() => setMobileOpen(false)}>
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  className="w-full justify-start"
                />
              ))}
              {user ? (
                <>
                  {user.isAdmin && (
                    <OutlineButton href="/admin" className="w-full justify-start">
                      관리자
                    </OutlineButton>
                  )}
                  <OutlineButton
                    href="/notifications"
                    className="w-full justify-start"
                  >
                    🔔 알림{unread > 0 ? ` (${unread})` : ""}
                  </OutlineButton>
                  <OutlineButton
                    href={user.usernameSet ? "/profile" : "/onboarding"}
                    className="w-full justify-start"
                  >
                    {user.usernameSet ? user.nickname : "아이디 설정"}
                  </OutlineButton>
                  <form action="/auth/signout" method="post">
                    <button
                      type="submit"
                      className="w-full px-3 py-2 text-left font-display text-body-sm text-fog"
                    >
                      로그아웃
                    </button>
                  </form>
                </>
              ) : (
                <OutlineButton href="/login" className="w-full justify-start">
                  로그인
                </OutlineButton>
              )}
              <PrimaryButton href="/community/write" className="mt-2 w-full">
                글쓰기
              </PrimaryButton>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
