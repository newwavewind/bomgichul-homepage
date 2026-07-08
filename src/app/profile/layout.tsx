import type { Metadata } from "next";
import { ROBOTS_NOINDEX } from "@/lib/seo";

export const metadata: Metadata = {
  robots: ROBOTS_NOINDEX,
  title: "내 프로필",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
