import type { Metadata } from "next";
import { ROBOTS_NOINDEX } from "@/lib/seo";

export const metadata: Metadata = {
  robots: ROBOTS_NOINDEX,
  title: "글쓰기",
};

export default function PublicServiceCommunityWriteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
