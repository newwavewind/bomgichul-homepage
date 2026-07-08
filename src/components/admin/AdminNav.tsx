"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_LINKS = [
  { href: "/admin", label: "대시보드", exact: true },
  { href: "/admin/users", label: "회원·로그인" },
  { href: "/admin/reports", label: "오류·피드백" },
  { href: "/admin/community", label: "게시글" },
  { href: "/admin/premium", label: "프리미엄" },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 border-b border-mist pb-4">
      {ADMIN_LINKS.map((link) => {
        const active =
          "exact" in link && link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-[var(--radius-tags)] px-4 py-1.5 font-display text-body-sm font-medium transition-colors ${
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
