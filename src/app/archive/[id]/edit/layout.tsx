import type { Metadata } from "next";
import { ROBOTS_NOINDEX } from "@/lib/seo";

export const metadata: Metadata = {
  robots: ROBOTS_NOINDEX,
  title: "자료 수정",
};

export default function ArchiveEditLayout({ children }: { children: React.ReactNode }) {
  return children;
}
