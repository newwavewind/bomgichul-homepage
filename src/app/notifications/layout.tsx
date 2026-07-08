import type { Metadata } from "next";
import { ROBOTS_NOINDEX } from "@/lib/seo";

export const metadata: Metadata = {
  robots: ROBOTS_NOINDEX,
  title: "알림",
};

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
