"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  archiveBaseHref,
  communityBaseHref,
  faqBaseHref,
} from "@/lib/exam-track/community";
import type { CommunityScope } from "@/types/database";

const BASE_TABS = [
  { id: "board", label: "게시판" },
  { id: "archive", label: "자료실" },
  { id: "faq", label: "FAQ" },
] as const;

type TabId = "board" | "archive" | "news" | "faq";

function activeTab(pathname: string, scope: CommunityScope): TabId {
  const archive = archiveBaseHref(scope);
  const faq = faqBaseHref(scope);
  if (pathname === archive || pathname.startsWith(`${archive}/`)) return "archive";
  if (
    scope === "real_estate" &&
    (pathname === "/news" || pathname.startsWith("/news/"))
  ) {
    return "news";
  }
  if (pathname === faq || pathname.startsWith(`${faq}/`)) return "faq";
  return "board";
}

export function CommunityHubNav({ scope }: { scope: CommunityScope }) {
  const pathname = usePathname() ?? "";
  const current = activeTab(pathname, scope);
  const tabs =
    scope === "real_estate"
      ? [
          BASE_TABS[0],
          BASE_TABS[1],
          { id: "news" as const, label: "뉴스" },
          BASE_TABS[2],
        ]
      : BASE_TABS;
  const hrefs: Record<TabId, string> = {
    board: communityBaseHref(scope),
    archive: archiveBaseHref(scope),
    news: "/news",
    faq: faqBaseHref(scope),
  };

  return (
    <nav
      aria-label="커뮤니티 메뉴"
      className="mb-8 flex gap-1 rounded-2xl border border-[#007AFF]/15 bg-gradient-to-r from-[#E8F1FF]/80 to-[#F7FAFC] p-1.5"
    >
      {tabs.map((tab) => {
        const active = current === tab.id;
        return (
          <Link
            key={tab.id}
            href={hrefs[tab.id]}
            className={`flex-1 rounded-xl px-3 py-2.5 text-center font-display text-[13px] font-semibold transition-all sm:text-[14px] ${
              active
                ? "bg-[#007AFF] text-white shadow-[0_4px_14px_rgba(0,122,255,0.28)]"
                : "text-slate-600 hover:bg-white/80 hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
