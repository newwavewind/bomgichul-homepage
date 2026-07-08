import type { Metadata } from "next";
import { ROBOTS_NOINDEX } from "@/lib/seo";

export const metadata: Metadata = {
  robots: ROBOTS_NOINDEX,
  title: "자료 올리기",
};

export default function ArchiveNewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
