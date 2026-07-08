import type { Metadata } from "next";
import { ROBOTS_NOINDEX } from "@/lib/seo";

export const metadata: Metadata = {
  robots: ROBOTS_NOINDEX,
  title: "아이디 만들기",
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
