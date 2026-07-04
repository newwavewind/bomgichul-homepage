"use client";

import { useState } from "react";
import { LogoMark } from "@/components/illustrations/LogoMark";
import { PrimaryButton, OutlineButton, TextButton } from "@/components/ui/Button";
import { NAV_LINKS } from "@/lib/constants";

interface HeaderNavProps {
  user?: {
    id: string;
    nickname: string;
    usernameSet: boolean;
  } | null;
}

export function HeaderNav({ user }: HeaderNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 py-4">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="flex items-center justify-between gap-3 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-paper px-3 py-2 shadow-[var(--shadow-button)] md:px-4">
          <LogoMark />

          <nav className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => (
              <OutlineButton key={link.href} href={link.href}>
                {link.label}
              </OutlineButton>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
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
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <OutlineButton
                  key={link.href}
                  href={link.href}
                  className="w-full justify-start"
                >
                  {link.label}
                </OutlineButton>
              ))}
              {user ? (
                <>
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
