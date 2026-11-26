import Link from "next/link";

export const historyLibraryLinks = [
  { key: "sources", title: "사료 모음집", href: "/history/library?view=sources" },
  { key: "people", title: "인물 사전", href: "/history/library?view=people" },
] as const;

export function HistoryLibraryLinks() {
  return (
    <div className="mt-2 grid grid-cols-3 gap-2">
      {historyLibraryLinks.map(({ key, title, href }) => (
        <Link key={key} href={href} prefetch={false}
          className="flex min-h-11 items-center justify-center gap-1 rounded-[12px] border border-mist bg-paper px-2 text-center text-xs font-semibold text-carbon hover:bg-snow sm:text-sm">
          {title}
        </Link>
      ))}
    </div>
  );
}
