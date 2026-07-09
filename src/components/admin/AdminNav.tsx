"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_LINKS = [
  { href: "/admin", label: "대시보드", exact: true },
  { href: "/admin/visits", label: "방문" },
  { href: "/admin/users", label: "회원·로그인" },
  { href: "/admin/reports", label: "오류·피드백" },
  { href: "/admin/community", label: "게시글" },
  { href: "/admin/premium", label: "프리미엄" },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      className="-mx-1 flex gap-1.5 overflow-x-auto border-b border-mist pb-3 sm:mx-0 sm:flex-wrap sm:gap-2 sm:pb-4"
      aria-label="관리자 메뉴"
    >
      {ADMIN_LINKS.map((link) => {
        const active =
          "exact" in link && link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-[var(--radius-tags)] px-3 py-2 font-display text-[13px] font-medium transition-colors sm:px-4 sm:py-1.5 sm:text-body-sm ${
              active ? "bg-midnight text-paper" : "bg-surface text-ink hover:bg-snow"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
