"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/illustrations/LogoMark";
import { PrimaryButton, OutlineButton, TextButton } from "@/components/ui/Button";
import { OceanRankBadge } from "@/components/ranks/OceanRankBadge";
import { NAV_LINKS, PC_APP_URL, PUBLIC_SERVICE_PC_APP_URL, isNavGroup, navGroupKey, type NavGroupLink } from "@/lib/constants";
import type { OceanRank } from "@/lib/ocean-ranks";

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
  onNavigate,
}: {
  href: string;
  label: string;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <OutlineButton href={href} className={`shrink-0 whitespace-nowrap ${className}`} onClick={onNavigate}>
      {label}
    </OutlineButton>
  );
}

function NavDropdown({ label, children }: NavGroupLink) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const root = detailsRef.current;
    if (!root) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!root.open) return;
      if (!root.contains(event.target as Node)) {
        root.open = false;
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") root.open = false;
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <details ref={detailsRef} className="group relative shrink-0">
      <summary className="inline-flex shrink-0 cursor-pointer list-none items-center justify-center gap-1 whitespace-nowrap rounded-[var(--radius-buttons)] border border-transparent px-3.5 py-2 font-display text-body-sm font-medium text-ink transition-colors hover:border-mist hover:bg-snow marker:content-none [&::-webkit-details-marker]:hidden group-open:border-carbon group-open:bg-snow">
        {label}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          className="transition-transform group-open:rotate-180"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>
      <div className="absolute left-0 top-full z-[60] min-w-[10rem] pt-1">
        <div className="flex flex-col rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper py-1 shadow-[var(--shadow-card)]">
          {children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="block px-3.5 py-2 font-display text-body-sm font-medium text-ink transition-colors hover:bg-snow"
              onClick={() => {
                if (detailsRef.current) detailsRef.current.open = false;
              }}
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </details>
  );
}

function MobileNavGroup({
  label,
  children,
  onNavigate,
}: NavGroupLink & { onNavigate: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-[var(--radius-buttons)] px-3.5 py-2 font-display text-body-sm font-medium text-ink transition-colors hover:bg-snow"
        aria-expanded={expanded}
      >
        {label}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {expanded && (
        <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-mist pl-3">
          {children.map((child) => (
            <NavLink
              key={child.href}
              href={child.href}
              label={child.label}
              className="w-full justify-start"
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function HeaderNav({ user, unreadCount = 0 }: HeaderNavProps) {
  const pathname = usePathname();
  const isPublicService = pathname.startsWith("/public-service");
  const isExamSelection = pathname === "/";
  const scopedNavLinks = NAV_LINKS.filter((link) => {
    if ((isPublicService || isExamSelection) && "href" in link && link.href === PC_APP_URL) return false;
    if (isExamSelection && isNavGroup(link) && link.label === "학습") return false;
    return true;
  }).concat(isPublicService ? [{ href: PUBLIC_SERVICE_PC_APP_URL, label: "공무원 PC앱" }] : []);
  const navLinks = scopedNavLinks.map((link) => {
    if (isExamSelection && isNavGroup(link) && link.label === "커뮤니티") {
      return {
        label: "커뮤니티",
        children: [
          { href: "/public-service/community", label: "공무원 커뮤니티" },
          { href: "/community", label: "공인중개사 커뮤니티" },
        ],
      };
    }
    if (!isPublicService || !isNavGroup(link) || link.label !== "커뮤니티") return link;
    return {
      href: "/public-service/community",
      label: "커뮤니티",
      children: [
        { href: "/public-service/community", label: "공무원 게시판" },
        { href: "/public-service/community?category=question", label: "공무원 질문" },
        { href: "/public-service/community?category=info", label: "공무원 수험정보" },
      ],
    };
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unread, setUnread] = useState(unreadCount);

  useEffect(() => {
    if (!user) {
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

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex"
            aria-label="주요 메뉴"
          >
            {navLinks.map((link) =>
              isNavGroup(link) ? (
                <NavDropdown key={navGroupKey(link)} {...link} />
              ) : (
                <NavLink key={link.href} href={link.href} label={link.label} />
              )
            )}
          </nav>

          <div className="hidden items-center gap-2 xl:flex">
            {user ? (
              <>
                {user.isAdmin && (
                  <OutlineButton href="/admin">관리자</OutlineButton>
                )}
                <NotificationBell unreadCount={unread} />
                <OutlineButton
                  href={user.usernameSet ? "/profile" : "/onboarding"}
                  className="gap-1.5"
                >
                  {user.usernameSet ? user.nickname : "아이디 설정"}
                  {user.usernameSet && user.oceanRank ? (
                    <OceanRankBadge rank={user.oceanRank} variant="icon" />
                  ) : null}
                </OutlineButton>
                <form action="/auth/signout" method="post">
                  <TextButton type="submit">로그아웃</TextButton>
                </form>
              </>
            ) : (
              <>
                <OutlineButton href="/login">로그인</OutlineButton>
                <PrimaryButton href="/signup">회원가입</PrimaryButton>
              </>
            )}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-0">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-buttons)] border border-mist xl:hidden"
              aria-label="메뉴"
              aria-expanded={mobileOpen}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M3 5H17M3 10H17M3 15H17" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="mt-2 rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper p-4 shadow-[var(--shadow-card)] xl:hidden">
            <nav className="flex flex-col gap-1" onClick={() => setMobileOpen(false)}>
              {navLinks.map((link) =>
                isNavGroup(link) ? (
                  <MobileNavGroup
                    key={navGroupKey(link)}
                    {...link}
                    onNavigate={() => setMobileOpen(false)}
                  />
                ) : (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    className="w-full justify-start"
                    onNavigate={() => setMobileOpen(false)}
                  />
                )
              )}
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
                    className="w-full justify-start gap-1.5"
                  >
                    {user.usernameSet ? user.nickname : "아이디 설정"}
                    {user.usernameSet && user.oceanRank ? (
                      <OceanRankBadge rank={user.oceanRank} variant="icon" />
                    ) : null}
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
                <>
                  <OutlineButton href="/login" className="w-full justify-start">
                    로그인
                  </OutlineButton>
                  <PrimaryButton href="/signup" className="w-full justify-start">
                    회원가입
                  </PrimaryButton>
                </>
              )}
              <PrimaryButton href={isPublicService ? "/public-service/community/write" : "/community/write"} className="mt-2 w-full">
                글쓰기
              </PrimaryButton>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
